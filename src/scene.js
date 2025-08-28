/**
 * ui - start, cosmetic, money, highscore
 * black bg spotlight yellow/orange floor one cat widen open on start
 * brick wall ? fence wall ? bush hedge ?
 * terrain change update field characteristic
 * todo: how to describe maze and cat??
 * fog > black behind wall, distance change cell brightness
 */

let mod = (f,l,v) => n => v(Math.min(1,(n-f)/l)),
    rand=Math.random,
    abs = Math.abs,
    p = s=> new Path2D(s);
    



export class Logic {
    move = [0,0];
    pos = [0,0];
    constructor() {
        let r = (n)=>document.body.addEventListener(n,e => this._onEvent(e));
        r(`keydown`);
        r(`keyup`);
    }
    _onEvent({code,type}) {
        if (type == `kekydown`) {
            if (code == `keyW`) this.move[1] = 1;
            if (code == `keyA`) this.move[0] = -1;
            if (code == `keyS`) this.move[1] = -1;
            if (code == `keyD`) this.move[0] = 1;
            return;
        } 
        if (code == `keyA` || code == `keyD`) this.move[0] = 0;
        if (code == `keyW` || code == `keyS`) this.move[1] = 0;
    }
    update() {
        // TODO: process position, game events
    }
}

// hard coded 4e3 and 2e3. a block in ground is supposed to be 3840 wide and should trigger update on half way out
const // 3840
    COLORS = [``,``,``,``];
class Ground {
    center = [0, 0];
    // #FFAE13 - bg
    // #FF911C
    // #A15615
    // #FFEA3F


    // ┌        ┐       └       ┘
    // rd       ld      ru      lu
    blocks = [[], [], [], []];
    constructor() {
        window.g = this;
        
        this.center = [8e3,8e3];
        this._posUpdate(0,0);
    }

    update(x, px, py) {
        this._posUpdate(px, py);
        x.fillStyle = `#FFAE13`;
        let [bx, by] = this.center;

        // TODO: CAMERA SYSTEM, smooth the camera
        x.translate(px, py);

        x.fillRect(bx-4e3,by-4e3,8e3,8e3);
        // WARN: performance very bad.
        for (const [c,pa] of this.blocks.flat(1)) { 
            x.fillStyle=c;
            x.fill(p(pa));
        }

        x.translate(-px, -py);
    }

    // if new position leave the half of unit, 
    // update center
    // reuse blocks or create new
    _posUpdate(x,y) {
        let [xd,yd] = [x-this.center[0], y-this.center[1]],
            [ax,ay] = [abs(xd), abs(yd)];

        this.center = [Math.round(x/4e3)*4e3, Math.round(y/4e3)*4e3];
        if (ax>4e3||ay>4e3) 
            return this.blocks = [this._newBlock(0), this._newBlock(1),this._newBlock(2), this._newBlock(3)];

        if (ax>2e3) {
            this.blocks = xd>0 ? 
                [this._newBlock(0), this.blocks[0], this._newBlock(2), this.blocks[2]] : 
                [this.blocks[1], this._newBlock(1), this.blocks[3], this._newBlock(3)];
        }
        if (ay>2e3) {
            this.blocks = yd>0 ? 
                [this._newBlock(0), this._newBlock(1), this.blocks[0], this.blocks[1]] : 
                [this.blocks[2], this.blocks[3], this._newBlock(2), this._newBlock(3)];
        }
    }

    _newBlock(tileIndex) {
        let q=[], P = (I,S)=>[-I%2*4e3, (I>>1)*-4e3, S+rand()*S,.2+rand()*.3]
        for (let [C,N,S] of [[`#FF911C`,2e3,60],[`#A15615`,1e3,30],[`#FFEA3F`,8e2,10]]) 
            for (let j = 0; j < N; j++) {
                let [X,Y,W,H] = P(tileIndex, S)
                q.push([C, `M${rand()*4e3+X} ${rand()*4e3+Y}a${W} ${W*H} 0 1 0 1 0`]);
            }
        return q
    }
}

export class Scene {
    ground = new Ground();
    logic = new Logic();
    screenShakerMod = [0, ()=>0];

    // coins, cat, road
    commonSprites = [];
    sprites = [];

/**
 * [sceneIndex, sceneTo] 
 * sceneIndex = 0: main, 1: gacha, 2: gaming
 */
    state = [0, 0];

    _draw(x) {//: CanvasRenderingContext2D
        let [now, t] = clock;
        x.fillStyle = `black`;
        x.fillRect(-100, -100, 1920 + 200, 1080 + 200);
        let mt = this.screenShakerMod[1](t);
        x.translate(mt,mt);

        x.fillStyle = `gray`;
        x.fillRect(0,0,1920,1080);

        this.ground.update(x, 0, 0);

        
        // 100, 40


        // // INFO: actual draw
        // let n = Date.now();
        // let d = Math.floor(n / 1e3) % 10 / 10 * 1920;
        // x.fillStyle = 'black';
        // x.fillRect(d,100,100,100);

        x.translate(-mt, -mt);
    }

    shake() {
        let [n, t] = clock;
        this.screenShakerMod = [t + 3e2, mod(t + Date.now() - n,3e2,v=>Math.sin(v*20)*30*(1-v))];
    }

    drawTitle(state) {
        // this.
    }

}