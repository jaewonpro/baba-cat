const ax = new AudioContext();
/**
 * C C# D D# E F F# G G# A A# B
 * 0  1 2 3  4 5 6  7  8 9 10 11
 */
const pitch2freq = (p) => Math.pow(2, Math.floor(p/12)-4) * [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.30, 440, 466.16, 493.88][p%12],
waves = [`sine`, `square`, `sawtooth`, `triangle`],
osc = (f, w) => new OscillatorNode(ax, { frequency: f, type: waves[w] });

/**
 * custom score is implemented for audio.
 * score is an array full of two types of itme. header and bar
 * # Header
 * header object defines the properties of the track from the time point
 *  {
 *      b(BPM): number
 *      i(instruments): instrument[]
 *      e(envelopes): envelope[]
 *      l(loop): [beat-size, bar]
 *  }
 * # Bar
 * bar is an array full of notes at default duration of 4 beats. 
 * # Note
 * notes are 
 *  {
 *      instrument: number(instrument-index)
 *      time: number[start-beat, end-beat]
 *      pitch: string(A1~G7)[]
 *  }
 * # instrument
 * 
 *  {
 *      wave: wave_id
 *      pan: numberOrEnvelope[x,y,z]
 *      adsr: numberOrEnvelope[a,d,s,r]
 *      gain: numberOrEnvelope(0~1)
 *  }
 */

export class Player {
    doLoop = false;
    score;
    loadLoop = -1;

    // INFO: [currentBPM]
    state;

    // INFO: [currentBarIndex, currentBeat, currentBarStartTime,endTimeOfSong]
    timeIndice;

    instruments = [];
    loops = [];
    envelopes = {};
    constructor() {}

    playScore(score, at) {
        this.score = score;
        this.state = [120];
        this.timeIndice = [0,0,at??ax.currentTime,0];
        clearInterval(this.loadLoop);
        this.loadLoop = setInterval(_ => {
            this.triggerScoreLoad();
        }, 50);
    }

    get beattime() {return 60 / this.state[0]}




    // relative time after start of track on the `itemRead`'s beat 0
    triggerScoreLoad() {
        let endBeat = Math.max(ax.currentTime - this.timeIndice[2], 0) / this.beattime + this.state[0]/600;
        let readUptoBeat = -1; 
        let item = this.score[this.timeIndice[0]];
        while (item) {
            if (Array.isArray(item)) {// bars are arrays 
                if (this.timeIndice[2] >= this.timeIndice[3]) {
                    this.timeIndice[3] = this.timeIndice[2] + this.beattime * 4;
                }
                for (const [[sb,eb],i,p] of item) {// note: [[start-beat, end-beat], instrument, pitch]
                    if (sb >= this.timeIndice[1]) { // starting off where we didn't parse yet
                        console.log(`schedule ready`, sb, `<`, endBeat);
                        if (sb < endBeat) {
                            if (Array.isArray(i)) 
                                for (const ii of i) this.scheduleInstrument(this.timeIndice[2], sb,eb,ii,p);
                            else this.scheduleInstrument(this.timeIndice[2], sb,eb,i,p);
                            console.log(`scheduled a note`, this.timeIndice[1], sb, endBeat, ax.currentTime, this.timeIndice[2]);
                        } else {
                            readUptoBeat = sb;
                            break;
                        }
                    }
                }
                if (readUptoBeat > 0) {
                    this.timeIndice[1] = readUptoBeat;
                    break;
                }
                this.timeIndice[2] += this.beattime * 4;
                this.timeIndice[1] = 0;
                endBeat = this.state[0] / 600; // hard coded
            } else { 
                const {b,i,e,r,l,t} = item;
                if (b) this.state[0] = b;
                if (e) this.scheduleEnvelopes(e, this.timeIndice[2]); // [[name, wavesIndex, periodInBeats], [name, -1, lengthInBeats, [from,to]] ]
                if (i) this.updateInstruments(i); // update oscillator property on index's instrument. [wave, [panX, panY, panZ], [a, d, s, r], gain]
                // experimental linear envelope, might get removed, instrument properties might refer to this instead of static value. [name, [startTime, endTime], [fromValue, toValue]]
                // if (l) registerLoop(l, barStartTime);
                // if (r) this.state[1] = r; // experimental, might get removed. sets next bar's length from default 4 beats.
                // if (t) next bar will start after t seconds
            }
            this.timeIndice[0]++;
            item = this.score[this.timeIndice[0]];
            if (!item) {
                if (this.doLoop) this.timeIndice = [0,0,this.timeIndice[3],0];
                else clearInterval(this.loadLoop);
            }
        }
    }

    triggerLoopLoad() {

    }

    updateInstruments(it) {
        for (const i in it) {
            if (it[i] == 0) continue;
            this.instruments[i]=it[i];
        }
    }

    scheduleEnvelopes(es, st) {
        for (const [name, type,length,value] of es) {
            this.envelopes[name] = 
                type==-1 ? (a) => a
                    .setValueAtTime(value[0], st)
                    .linearRampToValueAtTime(value[1], st + length * this.beattime) : 
                type==-2 ? (audioParam) => audioParam
                    .setValueAtTime(value[0], st)
                    .exponentialRampToValueAtTime(value[1], st + length * this.beattime) :
                (audioParam) => {
                    const o = osc(1/(length * this.beattime), type);
                    o.connect(audioParam);
                    o.start(st);
                };  
        }
    }

    scheduleInstrument(barStartTime, startBeat, endBeat, instrumentId, pitch) {
        console.log(`schedule`);
        const [wave, pan, adsr, masterGain] = this.instruments[instrumentId];
        const [a,d,s,r] = adsr;

        const beforeAttack = barStartTime + this.beattime*startBeat;
        const afterAttack = beforeAttack + a;
        const afterRelease = barStartTime + this.beattime*endBeat + r;
        // console.log(ax.currentTime, beforeAttack, afterAttack, afterRelease);

        // TODO: noise or anythin else
        const oscs = [];
        if (Array.isArray(pitch)) for (const p of pitch) oscs.push(osc(pitch2freq(p), wave));
        else oscs[0] = osc(pitch2freq(pitch), wave);
        
        const g = new GainNode(ax, { gain: 0 });
        for (const osc of oscs) {
            osc.connect(g);
        }

        let beforeDest = g;
        if (pan) {
            const [x, y, z] = pan;
            const pn = new PannerNode(ax, {
                panningModel: "HRTF",
                distanceModel: "exponential"
            });
            this.resolveEnvelope(x, pn.positionX);
            this.resolveEnvelope(y, pn.positionY);
            this.resolveEnvelope(z, pn.positionZ);
            beforeDest = g.connect(pn);   
        }
        console.log(beforeDest);

        const { gain } = g;
        gain.linearRampToValueAtTime(1/oscs.length, afterAttack);
        gain.exponentialRampToValueAtTime(s / oscs.length, afterAttack + d);
        gain.exponentialRampToValueAtTime(1e-10, afterRelease);

        beforeDest = beforeDest.connect(new GainNode(ax));
        this.resolveEnvelope(masterGain, beforeDest.gain);


        beforeDest.connect(ax.destination);

        for (const osc of oscs) {
            osc.start(beforeAttack);
            osc.stop(afterRelease);
        }
    }

    resolveEnvelope(v, audioParam) {
        return typeof v === 'number' ? (audioParam.value=v) : this.envelopes[v](audioParam);
    }
}

//[[start-beat, end-beat], instrument, pitch]