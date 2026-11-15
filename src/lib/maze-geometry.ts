import {DHI_D_OUTLINE,DHI_D_CENTRE} from "./dhi-d-outline";

export const MAZE_DOT_BOUNDS=[
  [21,77,39,96],[73,87,91,106],[47,107,65,126],
  [4,109,16,121],[100,116,118,135],[27,132,43,148],
  [65,134,83,152],[92,150,111,169],[42,161,54,173],
] as const;
export const MAZE_LOGO={width:2,height:2*325/569,y:.06} as const;
export const MAZE_TRACK_RADII=[2.57,2.20,1.83,1.46] as const;
export const MAZE_GATE_ANGLES=[0,Math.PI/2,Math.PI,3*Math.PI/2] as const;
export const MAZE_WALLS=MAZE_TRACK_RADII.map((radius,index)=>({radius:radius-.185,gates:[MAZE_GATE_ANGLES[index]]}));
export const MAZE_GATE_HALF=.23;
type Point={x:number;y:number};
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const lerp=(a:Point,b:Point,t:number)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)});
const polar=(r:number,a:number)=>({x:r*Math.cos(a),y:r*Math.sin(a)});
export const MAZE_MARBLE_RADIUS=.052;
export const MAZE_D_FINAL={x:(DHI_D_CENTRE[0]/569-.5)*2,y:(.5-DHI_D_CENTRE[1]/325)*MAZE_LOGO.height+MAZE_LOGO.y};
// One dot is filled initially. The arriving pairs fill from right to left.
const DOT_ORDER=[7,1,6,2,8,5,0,3,4] as const;
export function mazeDestination(index:number) {
  const [l,t,r,b]=MAZE_DOT_BOUNDS[DOT_ORDER[index]];
  return {x:((l+r)/2/569-.5)*2,y:(.5-(t+b)/2/325)*MAZE_LOGO.height+MAZE_LOGO.y,radius:(r-l)/569*2*.54};
}
export function mazeCollector(seconds:number,still=false) {
  void seconds;void still;
  return {...MAZE_D_FINAL,angle:0,scale:1,lift:0,progress:1};
}
const dWall=DHI_D_OUTLINE.map(([x,y])=>({x:(x-DHI_D_CENTRE[0])*2/569,y:(DHI_D_CENTRE[1]-y)*2/569}));
export function dWallContact(p:Point) {
  let inside=false,distance2=Infinity,closest={x:0,y:0};
  for(let i=0,j=dWall.length-1;i<dWall.length;j=i++) {
    const a=dWall[j],b=dWall[i],dx=b.x-a.x,dy=b.y-a.y;
    if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x) inside=!inside;
    const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));
    const q={x:a.x+dx*t,y:a.y+dy*t},d=(p.x-q.x)**2+(p.y-q.y)**2;
    if(d<distance2) {distance2=d;closest=q;}
  }
  const distance=Math.sqrt(distance2),direction=inside ? -1 : 1;
  return {distance:distance*direction,nx:(p.x-closest.x)/(distance||1)*direction,ny:(p.y-closest.y)/(distance||1)*direction};
}
export function mazeDWallClearance(p:Point) {
  return dWallContact({x:p.x-MAZE_D_FINAL.x,y:p.y-MAZE_D_FINAL.y}).distance;
}
