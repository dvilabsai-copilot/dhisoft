import {DHI_D_OUTLINE,DHI_D_CENTRE} from "./dhi-d-outline";

export const MAZE_DOT_BOUNDS=[
  [21,77,39,96],[73,87,91,106],[47,107,65,126],
  [4,109,16,121],[100,116,118,135],[27,132,43,148],
  [65,134,83,152],[92,150,111,169],[42,161,54,173],
] as const;
export const MAZE_LOGO={width:2,height:2*325/569,y:.06} as const;
export const MAZE_WALLS=[{radius:2.05,gate:0},{radius:1.65,gate:Math.PI/2},{radius:1.25,gate:3*Math.PI/2}] as const;
export const MAZE_GATE_HALF=.23;
export const MAZE_ENTRY_START=1,MAZE_ENTRY_DURATION=2.3,MAZE_ENTRY_INTERVAL=2.55;
export const MAZE_LAST_ENTRY=MAZE_ENTRY_START+5*MAZE_ENTRY_INTERVAL+MAZE_ENTRY_DURATION;
export const MAZE_LOGO_END=MAZE_LAST_ENTRY+.2,MAZE_CYCLE=21;
type Point={x:number;y:number};
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const lerp=(a:Point,b:Point,t:number)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)});
const polar=(r:number,a:number)=>({x:r*Math.cos(a),y:r*Math.sin(a)});
const rollingRadius=.052;
export const MAZE_D_FINAL={x:(DHI_D_CENTRE[0]/569-.5)*2,y:(.5-DHI_D_CENTRE[1]/325)*MAZE_LOGO.height+MAZE_LOGO.y};
// Three rightmost dots are filled initially. Fill the rest from right to left.
const DOT_ORDER=[6,2,8,5,0,3,7,1,4] as const;
export function mazeDestination(index:number) {
  const [l,t,r,b]=MAZE_DOT_BOUNDS[DOT_ORDER[index]];
  return {x:((l+r)/2/569-.5)*2,y:(.5-(t+b)/2/325)*MAZE_LOGO.height+MAZE_LOGO.y,radius:(r-l)/569*2*.54};
}
export function mazeCollector(seconds:number,still=false) {
  void seconds;void still;
  return {...MAZE_D_FINAL,angle:0,scale:1,lift:0,progress:1};
}
const dWall=DHI_D_OUTLINE.map(([x,y])=>({x:(x-DHI_D_CENTRE[0])*2/569,y:(DHI_D_CENTRE[1]-y)*2/569}));
function dWallContact(p:Point) {
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
export function createMazeSequence(seed:number) {
  let state=seed>>>0;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const radii=[2.28,1.85,1.45] as const;
  const starts=Array.from({length:6},(_,i)=>-.55-(i%2)*.60-random()*.14);
  const parked=(index:number)=>polar(radii[Math.floor(index/2)],starts[index]);
  const departure=(index:number)=>MAZE_ENTRY_START+index*MAZE_ENTRY_INTERVAL;
  const arrival=(index:number)=>departure(index)+MAZE_ENTRY_DURATION;
  function entryAt(t:number,index:number) {
    const u=Math.max(0,Math.min(1,(t-departure(index))/MAZE_ENTRY_DURATION)),ring=Math.floor(index/2);
    const target=mazeDestination(index);
    if(ring===0) {
      if(u<.12) return polar(2.28,mix(starts[index],0,ease(u/.12)));
      if(u<.22) return polar(mix(2.28,1.85,ease((u-.12)/.10)),0);
      if(u<.36) return polar(1.85,mix(0,Math.PI/2,ease((u-.22)/.14)));
      if(u<.45) return polar(mix(1.85,1.45,ease((u-.36)/.09)),Math.PI/2);
      if(u<.65) return polar(1.45,mix(Math.PI/2,3*Math.PI/2,ease((u-.45)/.20)));
    } else if(ring===1) {
      if(u<.24) return polar(1.85,mix(starts[index],Math.PI/2,ease(u/.24)));
      if(u<.38) return polar(mix(1.85,1.45,ease((u-.24)/.14)),Math.PI/2);
      if(u<.65) return polar(1.45,mix(Math.PI/2,3*Math.PI/2,ease((u-.38)/.27)));
    } else if(u<.65) return polar(1.45,mix(starts[index],-Math.PI/2,ease(u/.65)));
    if(u<.73) return polar(mix(1.45,.78,ease((u-.65)/.08)),3*Math.PI/2);
    const below={x:MAZE_D_FINAL.x-.63,y:-.30},entrance={x:below.x,y:target.y};
    if(u<.82) return lerp(polar(.78,3*Math.PI/2),below,ease((u-.73)/.09));
    if(u<.90) return lerp(below,entrance,ease((u-.82)/.08));
    return lerp(entrance,target,ease((u-.90)/.10));
  }
  function sampleMazeMarble(seconds:number,index:number,still=false) {
    const t=still ? MAZE_LOGO_END+1 : seconds%MAZE_CYCLE,target=mazeDestination(index);
    const docked=index>=6||t>=arrival(index);
    const p=docked ? target : t<departure(index) ? parked(index) : entryAt(t,index);
    const radius=docked ? target.radius : mix(rollingRadius,target.radius,ease((t-departure(index)-MAZE_ENTRY_DURATION*.90)/(MAZE_ENTRY_DURATION*.10)));
    return {...p,radius,active:true,scale:1,docked,z:0,impact:0};
  }
  function mazeHandTilt(seconds:number,still=false) {
    const t=seconds%MAZE_CYCLE;
    if(still||t>=MAZE_LAST_ENTRY) return {pitch:0,yaw:0,downhillX:0,downhillY:0,stage:still ? "still" : "settled"};
    const pair=Array.from({length:3},(_,i)=>i).find(i=>t>=departure(i*2)&&t<arrival(i*2+1));
    const stage=pair===undefined ? "dot-seated" : `fill-ring-${pair+1}`;
    let gx=0,gy=0;
    if(pair!==undefined) {
      const start=departure(pair*2),end=arrival(pair*2+1),u=(t-start)/(end-start);
      // One slow, shallow hand movement per pair. No rocking for each waypoint.
      const strength=Math.sin(Math.PI*u)**2*Math.sin(.10);
      const directions=[{x:1,y:0},{x:0,y:1},{x:0,y:-1}];
      gx=directions[pair].x*strength;gy=directions[pair].y*strength;
    }
    const pitch=-Math.asin(gy),yaw=Math.asin(Math.max(-1,Math.min(1,gx/Math.cos(pitch))));
    return {pitch,yaw,downhillX:gx,downhillY:gy,stage};
  }
  function sampleMazeSequence(seconds:number,still=false) {
    const t=still ? MAZE_LOGO_END+1 : seconds%MAZE_CYCLE;
    const marbles=MAZE_DOT_BOUNDS.map((_,i)=>sampleMazeMarble(seconds,i,still));
    return {marbles,impacts:[] as {x:number;y:number;age:number}[],collector:mazeCollector(t),collision:0,logo:1,...mazeHandTilt(seconds,still),
      fade:still ? 1 : ease(t/.3)*(1-ease((t-MAZE_CYCLE+.55)/.55)),
      phase:still ? "still" : t>=MAZE_LAST_ENTRY ? "logo" : t>=MAZE_ENTRY_START ? "placing-dots" : "rolling"};
  }
  return {sampleMazeSequence,sampleMazeMarble,mazeDestination,mazeHandTilt};
}
const defaultSequence=createMazeSequence(20261115);
export const sampleMazeSequence=defaultSequence.sampleMazeSequence;
export const sampleMazeMarble=defaultSequence.sampleMazeMarble;
export const mazeHandTilt=defaultSequence.mazeHandTilt;
