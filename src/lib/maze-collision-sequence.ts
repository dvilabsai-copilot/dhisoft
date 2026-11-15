import {DHI_D_OUTLINE,DHI_D_CENTRE} from "./dhi-d-outline";

export const MAZE_DOT_BOUNDS=[
  [21,77,39,96],[73,87,91,106],[47,107,65,126],
  [4,109,16,121],[100,116,118,135],[27,132,43,148],
  [65,134,83,152],[92,150,111,169],[42,161,54,173],
] as const;
export const MAZE_LOGO={width:2,height:2*325/569,y:.06} as const;
export const MAZE_WALLS=[{radius:2.05,gate:0},{radius:1.65,gate:Math.PI/2},{radius:1.25,gate:3*Math.PI/2}] as const;
export const MAZE_GATE_HALF=.23;
export const MAZE_FIRST_IMPACT=3.85;
export const MAZE_ENTRY_START=10.5,MAZE_ENTRY_DURATION=1.7,MAZE_ENTRY_INTERVAL=1.95;
export const MAZE_LAST_ENTRY=MAZE_ENTRY_START+7*MAZE_ENTRY_INTERVAL+MAZE_ENTRY_DURATION;
export const MAZE_LOGO_END=MAZE_LAST_ENTRY+.2,MAZE_CYCLE=30.5;
export const MAZE_STAGES=[
  {name:"gather-outer",start:.55,end:1.55},
  {name:"enter-outer",start:1.8,end:2.3},
  {name:"follow-middle",start:2.55,end:3.35},
  {name:"meet-second-circle",start:3.35,end:3.65},
  {name:"pair-contact",start:3.65,end:MAZE_FIRST_IMPACT},
] as const;
type Point={x:number;y:number};
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const lerp=(a:Point,b:Point,t:number)=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)});
const polar=(r:number,a:number)=>({x:r*Math.cos(a),y:r*Math.sin(a)});
const rollingRadius=.052;
export const MAZE_D_FINAL={x:(DHI_D_CENTRE[0]/569-.5)*2,y:(.5-DHI_D_CENTRE[1]/325)*MAZE_LOGO.height+MAZE_LOGO.y};
// Fill from right to left so incoming marbles do not roll over filled dots.
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
export const MAZE_FIRST_CONTACTS=[{x:-.06,y:1.85},{x:.06,y:1.85}] as const;
function parentOnStage(index:number,stage:number,q:number):Point {
  const offset=index===0 ? .1 : -.1;
  if(stage===0) return polar(index===0 ? 2.28 : 1.85,mix(index===0 ? -.65 : -1.1,offset,q));
  if(stage===1) return polar(index===0 ? mix(2.28,1.85,q) : 1.85,offset);
  if(stage===2) return polar(1.85,offset+q*Math.PI/2);
  const start=polar(1.85,offset+Math.PI/2),contact=MAZE_FIRST_CONTACTS[index];
  if(stage===3) return lerp(start,contact,.75*q);
  return lerp(lerp(start,contact,.75),contact,q);
}
function parentBeforeImpact(time:number,index:number) {
  const found=MAZE_STAGES.findIndex(stage=>time<=stage.end),s=Math.max(0,found),stage=MAZE_STAGES[s];
  return parentOnStage(index,s,ease((time-stage.start)/(stage.end-stage.start)));
}
export type MazePairCollision={time:number;pair:readonly[number,number];child:number;point:Point};
export function createMazeSequence(seed:number) {
  let state=seed>>>0;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const pairs:readonly[number,number][]=[[0,1],[0,2],[1,3],[2,4],[3,5],[4,6]];
  let time=MAZE_FIRST_IMPACT,angle=Math.PI/2;
  const outsideCollisions:MazePairCollision[]=pairs.map((pair,index)=>{
    if(index) {time+=.85+random()*.28;angle+=.30+random()*.26;}
    return {time,pair,child:index+2,point:polar(1.85,angle)};
  });
  const births=[0,0,...outsideCollisions.map(e=>e.time),0];
  const ringLerp=(a:Point,b:Point,q:number)=>{
    let aa=Math.atan2(a.y,a.x),ba=Math.atan2(b.y,b.x);
    ba=aa+Math.atan2(Math.sin(ba-aa),Math.cos(ba-aa));
    return polar(mix(Math.hypot(a.x,a.y),Math.hypot(b.x,b.y),q),mix(aa,ba,q));
  };
  function contact(event:MazePairCollision,index:number) {
    const a=Math.atan2(event.point.y,event.point.x),r=event.child===2 ? .06 : rollingRadius;
    if(index===event.pair[0]) return {x:event.point.x-Math.sin(a)*r,y:event.point.y+Math.cos(a)*r};
    if(index===event.pair[1]) return {x:event.point.x+Math.sin(a)*r,y:event.point.y-Math.cos(a)*r};
    const others=Array.from({length:event.child},(_,i)=>i).filter(i=>!event.pair.includes(i));
    return polar(1.85,a+.75+others.indexOf(index)*.25);
  }
  function rebound(event:MazePairCollision,index:number) {
    const a=Math.atan2(event.point.y,event.point.x);
    if(index===event.pair[0]) return polar(1.85,a+.16);
    if(index===event.pair[1]) return polar(1.85,a-.16);
    if(index===event.child) return polar(1.85,a+.38);
    return contact(event,index);
  }
  const last=outsideCollisions[outsideCollisions.length-1];
  // The eight wait in the second ring. Only the dispatched marble travels inward.
  const parked=(index:number)=>polar(1.85,-.2-index*.23);
  function outsidePose(t:number,index:number):Point {
    if(t<MAZE_FIRST_IMPACT) return parentBeforeImpact(t,index%2);
    let at=outsideCollisions.length-1;
    for(let e=0;e<outsideCollisions.length-1;e++) if(t<outsideCollisions[e+1].time) {at=e;break;}
    const event=outsideCollisions[at],next=outsideCollisions[at+1],start=index===event.child ? event.point : contact(event,index);
    const end=event.time+.32;
    if(t<end) return ringLerp(start,rebound(event,index),ease((t-event.time)/.32));
    if(next) return ringLerp(rebound(event,index),contact(next,index),ease((t-end)/(next.time-end)));
    return ringLerp(rebound(last,index),parked(index),ease((t-end)/(MAZE_ENTRY_START-.25-end)));
  }
  const departure=(index:number)=>MAZE_ENTRY_START+index*MAZE_ENTRY_INTERVAL;
  const arrival=(index:number)=>departure(index)+MAZE_ENTRY_DURATION;
  function entryAt(t:number,index:number) {
    const u=Math.max(0,Math.min(1,(t-departure(index))/MAZE_ENTRY_DURATION));
    const target=mazeDestination(index);
    if(u<.18) return ringLerp(parked(index),polar(1.85,Math.PI/2),ease(u/.18));
    if(u<.29) return polar(mix(1.85,1.45,ease((u-.18)/.11)),Math.PI/2);
    if(u<.55) return polar(1.45,mix(Math.PI/2,3*Math.PI/2,ease((u-.29)/.26)));
    if(u<.65) return polar(mix(1.45,.78,ease((u-.55)/.10)),3*Math.PI/2);
    const below={x:MAZE_D_FINAL.x-.63,y:-.30},entrance={x:below.x,y:target.y};
    if(u<.76) return lerp(polar(.78,3*Math.PI/2),below,ease((u-.65)/.11));
    if(u<.87) return lerp(below,entrance,ease((u-.76)/.11));
    return lerp(entrance,target,ease((u-.87)/.13));
  }
  function sampleMazeMarble(seconds:number,index:number,still=false) {
    const t=still ? MAZE_LOGO_END+1 : seconds%MAZE_CYCLE,target=mazeDestination(index);
    const active=t>=births[index],docked=index===8||t>=arrival(index);
    let p:Point=target,radius=target.radius;
    if(!docked) {
      p=t<departure(index) ? outsidePose(t,index) : entryAt(t,index);
      radius=mix(index<2 ? mix(.06,rollingRadius,ease((t-MAZE_FIRST_IMPACT)/.18)) : rollingRadius,target.radius,ease((t-departure(index)-MAZE_ENTRY_DURATION*.87)/(MAZE_ENTRY_DURATION*.13)));
    }
    const impact=outsideCollisions.filter(e=>e.pair.includes(index)||e.child===index).reduce((v,e)=>{
      const u=(t-e.time)/.22;return Math.max(v,u>=0&&u<=1 ? Math.sin(u*Math.PI) : 0);
    },0);
    return {...p,radius,active,scale:index<2||index===8 ? 1 : ease((t-births[index])/.18),docked,z:0,impact};
  }
  function mazeHandTilt(seconds:number,still=false) {
    const t=seconds%MAZE_CYCLE;
    if(still||t>=MAZE_LAST_ENTRY) return {pitch:0,yaw:0,downhillX:0,downhillY:0,stage:still ? "still" : "settled"};
    let x=0,y=0,stage="second-circle-collisions";
    if(t<MAZE_FIRST_IMPACT) {
      stage="approach-second-circle";
      for(let i=0;i<2;i++) {const a=parentBeforeImpact(t-.002,i),b=parentBeforeImpact(t+.002,i);x+=b.x-a.x;y+=b.y-a.y;}
    } else if(t<MAZE_ENTRY_START) {
      for(let i=0;i<8;i++) {if(t<births[i]+.004) continue;const a=outsidePose(t-.002,i),b=outsidePose(t+.002,i);x+=b.x-a.x;y+=b.y-a.y;}
    } else {
      const index=Array.from({length:8},(_,i)=>i).find(i=>t>=departure(i)&&t<arrival(i));
      stage=index===undefined ? "dot-seated" : `place-dot-${index+1}`;
      if(index!==undefined) {const a=entryAt(t-.002,index),b=entryAt(t+.002,index);x=b.x-a.x;y=b.y-a.y;}
    }
    const length=Math.hypot(x,y),strength=Math.sin(.16)*Math.min(1,length/.003);
    const gx=length ? x/length*strength : 0,gy=length ? y/length*strength : 0;
    const pitch=-Math.asin(gy),yaw=Math.asin(Math.max(-1,Math.min(1,gx/Math.cos(pitch))));
    return {pitch,yaw,downhillX:gx,downhillY:gy,stage};
  }
  function sampleMazeSequence(seconds:number,still=false) {
    const t=still ? MAZE_LOGO_END+1 : seconds%MAZE_CYCLE;
    const marbles=MAZE_DOT_BOUNDS.map((_,i)=>sampleMazeMarble(seconds,i,still));
    const impacts=outsideCollisions.flatMap(e=>{const age=(t-e.time)/.3;return age>=0&&age<1 ? [{...e.point,age}] : [];});
    return {marbles,impacts,collector:mazeCollector(t),collision:outsideCollisions.filter(e=>t>=e.time).length,logo:1,...mazeHandTilt(seconds,still),
      fade:still ? 1 : ease(t/.3)*(1-ease((t-MAZE_CYCLE+.55)/.55)),
      phase:still ? "still" : t>=MAZE_LAST_ENTRY ? "logo" : impacts.length ? "impact" : t>=MAZE_ENTRY_START ? "placing-dots" : "rolling"};
  }
  return {sampleMazeSequence,sampleMazeMarble,mazeDestination,mazeHandTilt,outsideCollisions,complete:true};
}
const defaultSequence=createMazeSequence(20261115);
export const sampleMazeSequence=defaultSequence.sampleMazeSequence;
export const sampleMazeMarble=defaultSequence.sampleMazeMarble;
export const mazeHandTilt=defaultSequence.mazeHandTilt;
export const MAZE_OUTSIDE_COLLISIONS=defaultSequence.outsideCollisions;
