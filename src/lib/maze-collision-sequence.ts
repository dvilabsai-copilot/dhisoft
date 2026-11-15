import {DHI_D_CENTRE} from "./dhi-d-outline";

export const MAZE_DOT_BOUNDS=[
  [21,77,39,96],[73,87,91,106],[47,107,65,126],
  [4,109,16,121],[100,116,118,135],[27,132,43,148],
  [65,134,83,152],[92,150,111,169],[42,161,54,173],
] as const;
export const MAZE_LOGO={width:2,height:2*325/569,y:.06} as const;
export const MAZE_WALLS=[{radius:2.05,gate:0},{radius:1.65,gate:Math.PI/2},{radius:1.25,gate:3*Math.PI/2}] as const;
export const MAZE_GATE_HALF=.23;
export const MAZE_FIRST_IMPACT=3.85;
export const MAZE_ENTRY_START=8.3,MAZE_ENTRY_DURATION=.95,MAZE_ENTRY_INTERVAL=1.05;
export const MAZE_LAST_ENTRY=MAZE_ENTRY_START+3*MAZE_ENTRY_INTERVAL+MAZE_ENTRY_DURATION;
export const MAZE_D_MOVE_START=17.4,MAZE_D_MOVE_END=19.55;
export const MAZE_DOT_ROLL_START=19.9;
export const MAZE_LOGO_START=21.35,MAZE_LOGO_END=22.65,MAZE_CYCLE=27;
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
const initialRadius=.06,rollingRadius=.052;
export const MAZE_D_FINAL={x:(DHI_D_CENTRE[0]/569-.5)*2,y:(.5-DHI_D_CENTRE[1]/325)*MAZE_LOGO.height+MAZE_LOGO.y};
const rawDot=(index:number)=>{
  const [l,t,r,b]=MAZE_DOT_BOUNDS[index];
  return {x:((l+r)/2/569-.5)*2,y:(.5-(t+b)/2/325)*MAZE_LOGO.height+MAZE_LOGO.y,radius:(r-l)/569*2*.54};
};

export function mazeCollector(seconds:number,still=false) {
  const time=still ? MAZE_LOGO_END+1 : seconds%MAZE_CYCLE;
  const progress=ease((time-MAZE_D_MOVE_START)/(MAZE_D_MOVE_END-MAZE_D_MOVE_START));
  return {x:MAZE_D_FINAL.x*progress,y:mix(.17,MAZE_D_FINAL.y,progress),angle:Math.PI/2*(1-progress),scale:mix(1.6,1,progress),lift:Math.sin(progress*Math.PI)*.10,progress};
}
function inCollector(p:Point,time:number) {
  const c=mazeCollector(time),cos=Math.cos(c.angle),sin=Math.sin(c.angle);
  return {x:c.x+(p.x*cos-p.y*sin)*c.scale,y:c.y+(p.x*sin+p.y*cos)*c.scale};
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
  const s=MAZE_STAGES.findIndex(stage=>time<=stage.end),stage=MAZE_STAGES[Math.max(0,s)];
  return parentOnStage(index,Math.max(0,s),ease((time-stage.start)/(stage.end-stage.start)));
}
export type MazePairCollision={time:number;pair:readonly[number,number];child:number;point:Point};
function buildMazeSequence(seed:number) {
  let randomState=seed>>>0;
  const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;};
  const secondTime=4.7+random()*.35,secondAngle=Math.PI/2+.28+random()*.12;
  const secondPoint=polar(1.85,secondAngle),tangent={x:-Math.sin(secondAngle),y:Math.cos(secondAngle)};
  const secondContacts=[{x:secondPoint.x-tangent.x*rollingRadius,y:secondPoint.y-tangent.y*rollingRadius},{x:secondPoint.x+tangent.x*rollingRadius,y:secondPoint.y+tangent.y*rollingRadius}];
  const spreadAngles=[.05,-.15,.30,.45];
const gateOffsets=[.10,-.10,.035,-.035];
const firstRebound=(index:number)=>polar(1.85,Math.PI/2+[.12,-.18,.30][index%3]);
const outsidePose=(time:number,index:number):Point=>{
  const reboundEnd=MAZE_FIRST_IMPACT+.55;
  if(time<reboundEnd) return lerp(index===2 ? {x:0,y:1.85} : MAZE_FIRST_CONTACTS[index%2],firstRebound(index),ease((time-MAZE_FIRST_IMPACT)/.55));
  if(time<secondTime) {
    const target=index===0 ? secondContacts[0] : index===2 ? secondContacts[1] : polar(1.85,Math.PI/2-.25);
    return lerp(firstRebound(index),target,ease((time-reboundEnd)/(secondTime-reboundEnd)));
  }
  const start=index===0 ? secondContacts[0] : index===2 ? secondContacts[1] : index===3 ? secondPoint : polar(1.85,Math.PI/2-.25);
  if(time<5.4) return lerp(start,polar(1.85,Math.PI/2+gateOffsets[index]),ease((time-secondTime)/(5.4-secondTime)));
  if(time<6.1) return polar(mix(1.85,1.45,ease((time-5.4)/.7)),Math.PI/2+gateOffsets[index]);
  if(time<6.35) return polar(1.45,Math.PI/2+gateOffsets[index]);
  return polar(1.45,mix(Math.PI/2+gateOffsets[index],3*Math.PI/2+spreadAngles[index],ease((time-6.35)/1.4)));
};
const entryLocal=(index:number)=>({x:-.27,y:[-.055,.055,-.018,.018][index]});
const arrival=(index:number)=>MAZE_ENTRY_START+index*MAZE_ENTRY_INTERVAL+MAZE_ENTRY_DURATION;
function entryAt(time:number,index:number):Point {
  const u=Math.max(0,Math.min(1,(time-MAZE_ENTRY_START-index*MAZE_ENTRY_INTERVAL)/MAZE_ENTRY_DURATION));
  if(u<.25) return polar(1.45,3*Math.PI/2+spreadAngles[index]*(1-ease(u/.25)));
  if(u<.65) return polar(mix(1.45,.78,ease((u-.25)/.4)),3*Math.PI/2);
  return lerp(polar(.78,3*Math.PI/2),inCollector(entryLocal(index),MAZE_ENTRY_START),ease((u-.65)/.35));
}

function downhill(time:number) {
  if(time<MAZE_FIRST_IMPACT) {
    let index=MAZE_STAGES.findIndex(s=>time>=s.start&&time<=s.end);
    if(index<0) index=MAZE_STAGES.findIndex(s=>time>=s.start-.16&&time<=s.end+.1);
    if(index<0) return {x:0,y:0,stage:"settled"};
    const s=MAZE_STAGES[index],q=ease((time+.06-s.start)/(s.end-s.start));
    let x=0,y=0;
    for(let i=0;i<2;i++) {const a=parentOnStage(i,index,Math.max(0,q-.001)),b=parentOnStage(i,index,Math.min(1,q+.001));x+=b.x-a.x;y+=b.y-a.y;}
    const length=Math.hypot(x,y)||1,strength=Math.sin(.24)*ease((time-s.start+.16)/.16)*(1-ease((time-s.end+.15)/.25));
    return {x:x/length*strength,y:y/length*strength,stage:s.name};
  }
  if(time<MAZE_ENTRY_START) {
    let x=0,y=0;
    for(let i=0;i<4;i++) {
      if(time<(i<2 ? 0 : i===2 ? MAZE_FIRST_IMPACT : secondTime)) continue;
      const a=outsidePose(time-.002,i),b=outsidePose(time+.002,i);x+=b.x-a.x;y+=b.y-a.y;
    }
    const length=Math.hypot(x,y),strength=Math.sin(.19)*Math.min(1,length/.0015);
    return {x:length ? x/length*strength : 0,y:length ? y/length*strength : 0,stage:time<5.4 ? "second-circle-collisions" : time<6.1 ? "enter-middle" : "follow-inner"};
  }
  if(time<MAZE_LAST_ENTRY) {
    const index=[0,1,2,3].find(i=>time>=MAZE_ENTRY_START+i*MAZE_ENTRY_INTERVAL-.12&&time<=arrival(i)+.08);
    if(index===undefined) return {x:0,y:0,stage:"rebound"};
    const start=MAZE_ENTRY_START+index*MAZE_ENTRY_INTERVAL,end=arrival(index);
    const a=entryAt(time+.04-.002,index),b=entryAt(time+.04+.002,index),dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;
    const strength=Math.sin(.19)*ease((time-start+.12)/.12)*(1-ease((time-end+.12)/.2));
    return {x:dx/length*strength,y:dy/length*strength,stage:`enter-D-${index+1}`};
  }
  if(time<MAZE_D_MOVE_START+.2) {
    const ramp=ease((time-MAZE_LAST_ENTRY)/.25)*(1-ease((time-MAZE_D_MOVE_START)/.2));
    const angle=(time-MAZE_LAST_ENTRY)*shakeRate+shakePhase,strength=Math.sin(.16)*ramp;
    return {x:Math.cos(angle)*strength,y:Math.sin(angle)*strength,stage:"loose-collisions"};
  }
  return {x:0,y:0,stage:time<MAZE_D_MOVE_END ? "move-D" : "settled"};
}

type Body=Point&{vx:number;vy:number;entered:boolean};
const bowlCollisions:MazePairCollision[]=[];
const outsideCollisions:MazePairCollision[]=[{time:MAZE_FIRST_IMPACT,pair:[0,1],child:2,point:{x:0,y:1.85}},{time:secondTime,pair:[0,2],child:3,point:secondPoint}];
const births=[0,0,MAZE_FIRST_IMPACT,secondTime,...Array<number>(4).fill(Infinity),0];
const shakeRate=1.65+random()*.5,shakePhase=random()*Math.PI*2;
const bowlStart=0,steps=Math.ceil(MAZE_D_MOVE_END*120),dt=MAZE_D_MOVE_END/steps;
const bodies:Body[]=Array.from({length:9},(_,i)=>({...entryLocal(i%4),vx:0,vy:0,entered:false}));
bodies[8]={x:-.08+random()*.08,y:(random()-.5)*.10,vx:(random()-.5)*.08,vy:(random()-.5)*.08,entered:true};
const bowlFrames:Point[][]=[bodies.map(({x,y})=>({x,y}))];
let nextChild=4,lastBirth=-Infinity;
let splitDelay=.6+random()*.22;
for(let step=1;step<=steps;step++) {
  const time=bowlStart+step*dt,c=mazeCollector(time),before=mazeCollector(time-dt),after=mazeCollector(time+dt);
  const w=(after.angle-before.angle)/(2*dt),alpha=(after.angle-2*c.angle+before.angle)/(dt*dt);
  const ax=(after.x-2*c.x+before.x)/(dt*dt),ay=(after.y-2*c.y+before.y)/(dt*dt);
  const g=downhill(time),cos=Math.cos(c.angle),sin=Math.sin(c.angle);
  const fx=(9.81*(g.x*cos+g.y*sin)-ax*cos-ay*sin)/c.scale;
  const fy=(9.81*(-g.x*sin+g.y*cos)+ax*sin-ay*cos)/c.scale;
  const drag=Math.exp(-1.7*dt);
  for(let i=0;i<9;i++) {
    const p=bodies[i];
    if(i<4&&!p.entered&&time>=arrival(i)) {p.entered=true;p.vx=.26+random()*.08;p.vy=(random()-.5)*.16;}
    if(!p.entered) continue;
    const rx=p.x+.08,ry=p.y;
    p.vx=(p.vx+(fx+alpha*ry+w*w*rx)*dt)*drag;
    p.vy=(p.vy+(fy-alpha*rx+w*w*ry)*dt)*drag;
    p.x+=p.vx*dt;p.y+=p.vy*dt;
  }
  for(let iteration=0;iteration<4;iteration++) {
    for(let i=0;i<9;i++) for(let j=i+1;j<9;j++) {
      const p=bodies[i],q=bodies[j];if(!p.entered||!q.entered) continue;
      const rp=rollingRadius/c.scale*(i<4||i===8 ? 1 : ease((time-births[i])/.18));
      const rq=rollingRadius/c.scale*(j<4||j===8 ? 1 : ease((time-births[j])/.18));
      const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);if(d>=rp+rq) continue;
      const nx=d>1e-8 ? dx/d : 1,ny=d>1e-8 ? dy/d : 0;
      const incoming=(q.vx-p.vx)*nx+(q.vy-p.vy)*ny;
      // One contact can add just one child, with a global cooldown. No group bursts.
      if(iteration===0&&incoming<-.012&&nextChild<8&&time>MAZE_LAST_ENTRY+.2&&time<MAZE_D_MOVE_START-.4&&time-lastBirth>splitDelay) {
        const index=nextChild++,point={x:(p.x+q.x)/2,y:(p.y+q.y)/2};
        bodies[index]={...point,vx:(p.vx+q.vx)/2-ny*.14,vy:(p.vy+q.vy)/2+nx*.14,entered:true};
        births[index]=time;lastBirth=time;splitDelay=.6+random()*.22;
        bowlCollisions.push({time,pair:[i,j],child:index,point:inCollector(point,time)});
      }
      const push=(rp+rq-d)/2;p.x-=nx*push;p.y-=ny*push;q.x+=nx*push;q.y+=ny*push;
      if(incoming<0) {p.vx+=incoming*.68*nx;p.vy+=incoming*.68*ny;q.vx-=incoming*.68*nx;q.vy-=incoming*.68*ny;}
    }
    for(let i=0;i<9;i++) {
      const p=bodies[i];if(!p.entered) continue;
      const r=rollingRadius/c.scale*(i<4||i===8 ? 1 : ease((time-births[i])/.18));
      const dx=p.x+.08,dy=p.y,d=Math.hypot(dx,dy),limit=.265-r;
      if(d>limit) {const nx=dx/d,ny=dy/d;p.x=-.08+nx*limit;p.y=ny*limit;const speed=p.vx*nx+p.vy*ny;if(speed>0){p.vx-=speed*1.5*nx;p.vy-=speed*1.5*ny;}}
    }
  }
  bowlFrames.push(bodies.map(({x,y})=>({x,y})));
}
function looseLocal(index:number,time:number) {
  const frame=Math.max(0,Math.min(steps,(time-bowlStart)/dt)),a=Math.floor(frame),b=Math.min(steps,a+1);
  return lerp(bowlFrames[a][index],bowlFrames[b][index],frame-a);
}
const endOrder=Array.from({length:9},(_,i)=>i).sort((a,b)=>bowlFrames[steps][a].x-bowlFrames[steps][b].x);
const dotOrder=Array.from({length:9},(_,i)=>i).sort((a,b)=>rawDot(a).x-rawDot(b).x),dotForBall:number[]=[];
endOrder.forEach((ball,rank)=>{dotForBall[ball]=dotOrder[rank];});
function mazeDestination(index:number) {return rawDot(dotForBall[index]);}

function sampleMazeMarble(seconds:number,index:number,still=false) {
  const time=still ? MAZE_LOGO_END+1 : seconds%MAZE_CYCLE,target=mazeDestination(index),active=time>=births[index];
  let p:Point={x:0,y:0},radius=rollingRadius,docked=false,z=0;
  if(index===8&&time<MAZE_D_MOVE_END) {p=inCollector(looseLocal(index,time),time);z=mazeCollector(time).lift;}
  else if(time<MAZE_FIRST_IMPACT) {p=parentBeforeImpact(time,index%2);radius=initialRadius;}
  else if(time<MAZE_ENTRY_START) {p=outsidePose(time,index);radius=mix(initialRadius,rollingRadius,ease((time-MAZE_FIRST_IMPACT)/.18));}
  else if(index<4&&time<arrival(index)) p=entryAt(time,index);
  else if(time<MAZE_D_MOVE_END) {p=inCollector(looseLocal(index,time),time);z=mazeCollector(time).lift;}
  else {const q=ease((time-MAZE_DOT_ROLL_START-index*.07)/1.3);p=q===1 ? target : lerp(inCollector(looseLocal(index,MAZE_D_MOVE_END),MAZE_D_MOVE_END),target,q);radius=mix(rollingRadius,target.radius,q);docked=q===1;}
  const age=(time-births[index])/.18,scale=index<2||index===8 ? 1 : ease(age);
  const impacts=[...outsideCollisions,...bowlCollisions].filter(e=>e.pair.includes(index)||e.child===index).map(e=>e.time);
  const impact=impacts.reduce((value,event)=>{const q=(time-event)/.22;return Math.max(value,q>=0&&q<=1 ? Math.sin(q*Math.PI) : 0);},0);
  return {...p,radius,active,scale,docked,z,impact};
}

function mazeHandTilt(seconds:number,still=false) {
  if(still) return {pitch:0,yaw:0,downhillX:0,downhillY:0,stage:"still"};
  const time=seconds%MAZE_CYCLE;
  let g=downhill(time);
  if(time>=MAZE_DOT_ROLL_START&&time<MAZE_LOGO_START+.4) {
    let x=0,y=0;
    for(let i=0;i<9;i++){const a=sampleMazeMarble(time-.002,i),b=sampleMazeMarble(time+.002,i);x+=b.x-a.x;y+=b.y-a.y;}
    const length=Math.hypot(x,y)||1,strength=Math.sin(.12)*ease((time-MAZE_DOT_ROLL_START)/.15)*(1-ease((time-MAZE_LOGO_START+.1)/.5));
    g={x:x/length*strength,y:y/length*strength,stage:"seat-dots"};
  }
  const pitch=-Math.asin(g.y),yaw=Math.asin(Math.max(-1,Math.min(1,g.x/Math.cos(pitch))));
  return {pitch,yaw,downhillX:g.x,downhillY:g.y,stage:g.stage};
}

function sampleMazeSequence(seconds:number,still=false) {
  const time=still ? MAZE_LOGO_END+1 : seconds%MAZE_CYCLE;
  const marbles=MAZE_DOT_BOUNDS.map((_,i)=>sampleMazeMarble(time,i,still));
  const events=[...outsideCollisions,...bowlCollisions];
  const impacts=events.flatMap(e=>{const age=(time-e.time)/.3;return age>=0&&age<1 ? [{...e.point,age}] : [];});
  return {marbles,impacts,collector:mazeCollector(time,still),collision:events.filter(e=>time>=e.time).length,
    logo:ease((time-MAZE_LOGO_START)/(MAZE_LOGO_END-MAZE_LOGO_START)),...mazeHandTilt(time,still),
    fade:still ? 1 : ease(time/.3)*(1-ease((time-MAZE_CYCLE+.55)/.55)),
    phase:still ? "still" : time>=MAZE_LOGO_END ? "logo" : impacts.length ? "impact" : time>=MAZE_D_MOVE_START&&time<MAZE_D_MOVE_END ? "assembling" : time>=MAZE_ENTRY_START ? "collecting" : "rolling"};
}
  return {sampleMazeSequence,sampleMazeMarble,mazeDestination,mazeHandTilt,bowlCollisions,outsideCollisions,complete:nextChild===8};
}
export function createMazeSequence(seed:number) {
  // Accept only physically simulated runs that finish the nine-marble story.
  // A sparse-contact random run is regenerated rather than adding a timed fake split.
  for(let attempt=0;attempt<8;attempt++) {
    const candidate=buildMazeSequence((seed+Math.imul(attempt,0x9e3779b9))>>>0);
    if(candidate.complete) return candidate;
  }
  const fallback=buildMazeSequence(1);
  if(!fallback.complete) throw new Error("Maze collision sequence did not reach nine marbles");
  return fallback;
}
const defaultSequence=createMazeSequence(20261115);
export const sampleMazeSequence=defaultSequence.sampleMazeSequence;
export const sampleMazeMarble=defaultSequence.sampleMazeMarble;
export const mazeDestination=defaultSequence.mazeDestination;
export const mazeHandTilt=defaultSequence.mazeHandTilt;
export const MAZE_BOWL_COLLISIONS=defaultSequence.bowlCollisions;
export const MAZE_OUTSIDE_COLLISIONS=defaultSequence.outsideCollisions;
