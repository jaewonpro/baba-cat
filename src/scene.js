/**
 * ui - start, cosmetic, money, highscore
 * black bg spotlight yellow/orange floor one cat widen open on start
 * brick wall ? fence wall ? bush hedge ?
 * terrain change update field characteristic
 * todo: how to describe maze and cat??
 * fog > black behind wall, distance change cell brightness
 */

let mod = (f,l,v) => n => v((n-f)/l);


export class Logic {

}


export class Scene {
    screenShakerMod = [0, ()=>0];

/**
 * [sceneIndex, sceneTo] 
 * sceneIndex = 0: main, 1: gacha, 2: gaming
 */
    state = [0, 0];


    _draw(x, t) {//: CanvasRenderingContext2D
        x.fillStyle = `black`;
        x.fillRect(-100, -100, 1920 + 200, 1080 + 200);
        if (this.screenShakerMod[0] < t) {
            // INFO: this registers a modifier that's screenshaker
            // this.screenShakerMod[1] = mod(t,5e2,v=>Math.sin(v*30)*30*(1-v));
            this.screenShakerMod[0] = t + 5e2;
        }
        let mt = this.screenShakerMod[1](t);
        x.translate(mt,mt);

        // INFO: actual draw
        let n = Date.now();
        let d = Math.floor(n / 1e3) % 10 / 10 * 1920;
        x.fillStyle = `gray`;
        x.fillRect(0,0,1920,1080);
        x.fillStyle = 'black';
        x.fillRect(d,100,100,100);
        // INFO: end of actual draw

        x.translate(-mt, -mt);
    }

    
}