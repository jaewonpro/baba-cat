import { Player } from "./audio";
import { Scene } from "./scene";

(async _=>{
let scene = new Scene();
let [b,c,f,l,m,X,Y,B,G,H]=[document.body,document.querySelector(`canvas`),`fillStyle`,`length`,`fillRect`,1920,1080,`black`,`gray`,`white`],
x=c.getContext(`2d`),w=c.width=b.clientWidth,h=c.height=b.clientHeight,fa=t=>{
w=b.clientWidth,h=b.clientHeight;let [z,n]=[w*9>h*16,Date.now()];w=c.width=z?X/Y*h:w;h=c.height=z?h:Y/X*w;x.scale(w/X,h/Y);

scene._draw(x, t);
// https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths
// @google "walkikng cat animation"
// https://www.instagram.com/shouxin13141
// https://inkscape.org/
// let p = new Path2D(`M 200 200 h 90 v 90 h -90 Z`);
// x.fill(p);

// TODO: create time object global that includes now, time since previous frame call, 

},ra=_=>requestAnimationFrame(ra,fa(_,x.clearRect(0,0,w,h)));ra(0);

c.addEventListener('click', async () => {
    (new Player()).playScore([
        {b: 190, i: [[2,0,[.05,.7,.8,.3],.2],[1,0,[.1,.8,.4,.1],.3]]},
        [
            [[2.5,3],0,61],
            [[3,3.5],0,61],
            [[3.5,4],0,61],
        ],
        [
            [[0,1],0,68],[[0,3],1,[8,39,44,47]],
            [[1,2],0,68],
            [[2,3],0,68],
            [[3,3.5],0,65],[[3,6.5],1,[16,40,44,47]],
            [[3.5,4],0,63],
        ],
        [
            [[0,.5],0,63],
            [[.5,1],0,63],
            [[1,1.5],0,63],
            [[1.5,2.5],0,61],
            [[2.5,3],0,61],
            [[3,3.5],0,61],
            [[3.5,4],0,61],
        ],
        [
            [[0,1],0,68],[[0,3],1,[11,39,42,47]],
            [[1,1.5],0,68],
            [[1.5,2.5],0,68],
            [[2.5,3.5],0,65],[[3,6.5],1,[18,42,46,49]],
            [[3.5,5.5],0,63],
        ],
        [
        ]
    ]);
});

})();

