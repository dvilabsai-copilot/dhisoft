import {MAZE_TRACK_RADII,MAZE_GATE_ANGLES,MAZE_WALLS,MAZE_GATE_HALF,MAZE_MARBLE_RADIUS,MAZE_D_FINAL,mazeDestination,mazeCollector,dWallContact,MAZE_LOGO} from "./maze-geometry";

type Point={x:number;y:number};
type Body=Point&{vx:number;vy:number;slot:number;seatedAt:number};
export const MAZE_PLAYBACK_RATE=3;
export const MAZE_GRAVITY=26*5/7*MAZE_PLAYBACK_RATE**2,MAZE_DRAG=.45*MAZE_PLAYBACK_RATE;
const R=MAZE_MARBLE_RADIUS,DT=1/120,G=26*5/7,DRAG=.45;
const LIMIT=2.72-R-.012,MAX_TIME=210;
const slots=Array.from({length:9},(_,i)=>mazeDestination(i));
const angleDelta=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
function wallContact(p:Point,radius:number,gate:number) {
  const a=Math.atan2(p.y,p.x),delta=angleDelta(a-gate);
  const nearest=Math.abs(delta)>=MAZE_GATE_HALF ? a : gate+(delta>=0 ? MAZE_GATE_HALF : -MAZE_GATE_HALF);
  const x=radius*Math.cos(nearest),y=radius*Math.sin(nearest),dx=p.x-x,dy=p.y-y,d=Math.hypot(dx,dy);
  return {distance:d-.083,nx:dx/(d||1),ny:dy/(d||1)};
}
function dContact(p:Point) {return dWallContact({x:p.x-MAZE_D_FINAL.x,y:p.y-MAZE_D_FINAL.y});}
function clear(p:Point,margin=R+.006) {
  if(Math.hypot(p.x,p.y)>LIMIT) return false;
  for(const wall of MAZE_WALLS) if(wallContact(p,wall.radius,wall.gates[0]).distance<margin) return false;
  return p.x<-.92||p.x>.04||p.y<-.27||p.y>.65||dContact(p).distance>=margin;
}
export function mazePhysicalClearance(p:Point) {
  return Math.min(LIMIT-Math.hypot(p.x,p.y)+R,...MAZE_WALLS.map(w=>wallContact(p,w.radius,w.gates[0]).distance),dContact(p).distance);
}
const GRID=.045,N=121,HALF=(N-1)/2;
const point=(id:number)=>({x:(id%N-HALF)*GRID,y:(Math.floor(id/N)-HALF)*GRID});
let staticGrid:Uint8Array|undefined;
function grid() {
  if(!staticGrid) {staticGrid=new Uint8Array(N*N);for(let i=0;i<N*N;i++) staticGrid[i]=clear(point(i)) ? 1 : 0;}
  return staticGrid;
}
function route(from:Point,to:Point,occupied:number[]) {
  const valid=(id:number)=>id>=0&&id<N*N&&grid()[id]&&occupied.every(slot=>Math.hypot(point(id).x-slots[slot].x,point(id).y-slots[slot].y)>R+slots[slot].radius+.006);
  function nearest(p:Point) {
    const col=Math.round(p.x/GRID+HALF),row=Math.round(p.y/GRID+HALF);
    let best=-1,distance=Infinity;
    for(let y=-4;y<=4;y++) for(let x=-4;x<=4;x++) {
      const id=(row+y)*N+col+x;if(!valid(id)) continue;
      const q=point(id),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<distance){distance=d;best=id;}
    }
    return best;
  }
  const start=nearest(from),end=nearest(to);if(start<0||end<0) return [];
  const cost=new Float64Array(N*N);cost.fill(Infinity);cost[start]=0;
  const parent=new Int32Array(N*N);parent.fill(-1);
  const done=new Uint8Array(N*N),heap:{id:number;score:number}[]=[];
  function push(id:number,score:number) {
    let at=heap.length;heap.push({id,score});while(at){const p=(at-1)>>1;if(heap[p].score<=score)break;heap[at]=heap[p];at=p;}heap[at]={id,score};
  }
  function pop() {
    const result=heap[0],last=heap.pop()!;if(heap.length){let at=0;while(at*2+1<heap.length){let next=at*2+1;if(next+1<heap.length&&heap[next+1].score<heap[next].score)next++;if(heap[next].score>=last.score)break;heap[at]=heap[next];at=next;}heap[at]=last;}return result.id;
  }
  const goal=point(end);push(start,0);
  while(heap.length) {
    const id=pop();if(done[id])continue;done[id]=1;
    if(id===end) {
      const result:Point[]=[];for(let at=end;at!==start&&at>=0;at=parent[at])result.push(point(at));
      result.reverse();result.push(to);return result;
    }
    const col=id%N,row=Math.floor(id/N);
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) {
      if(!dx&&!dy||col+dx<0||col+dx>=N||row+dy<0||row+dy>=N)continue;
      const next=id+dy*N+dx;if(done[next]||!valid(next))continue;
      const nextCost=cost[id]+Math.hypot(dx,dy)*GRID;
      if(nextCost<cost[next]){cost[next]=nextCost;parent[next]=id;const p=point(next);push(next,nextCost+Math.hypot(p.x-goal.x,p.y-goal.y));}
    }
  }
  return [];
}
export function createPhysicsMaze(seed:number) {
  let state=seed>>>0;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const bodies:Body[]=Array.from({length:9},(_,i)=>{
    if(i===8)return {...slots[8],vx:0,vy:0,slot:8,seatedAt:0};
    const ring=3-Math.floor(i/2),angle=MAZE_GATE_ANGLES[ring]+(i%2 ? 1 : -1)*(.45+random()*.65);
    return {x:MAZE_TRACK_RADII[ring]*Math.cos(angle),y:MAZE_TRACK_RADII[ring]*Math.sin(angle),vx:0,vy:0,slot:-1,seatedAt:Infinity};
  });
  let gx=0,gy=0,leader=-1,target=-1,waypoints:Point[]=[],lastPlan=-Infinity,completeAt=Infinity,collisions=0;
  const frames:{marbles:{x:number;y:number;vx:number;vy:number;slot:number;seatedAt:number}[];gx:number;gy:number;collisions:number}[]=[];
  const arrivals=Array<number>(9).fill(Infinity);arrivals[8]=0;
  const occupied=()=>bodies.filter(b=>b.slot>=0).map(b=>b.slot);
  const save=()=>frames.push({marbles:bodies.map(b=>({...b})),gx,gy,collisions});save();
  function bounce(p:Body,nx:number,ny:number,push:number) {
    p.x+=nx*push;p.y+=ny*push;const speed=p.vx*nx+p.vy*ny;
    if(speed<0){p.vx-=1.18*speed*nx;p.vy-=1.18*speed*ny;}
  }
  for(let step=1;step<=MAX_TIME/DT;step++) {
    const time=step*DT;
    if(leader<0||bodies[leader].slot>=0) {
      const loose=bodies.map((b,i)=>({b,i})).filter(({b})=>b.slot<0).sort((a,b)=>Math.hypot(a.b.x,a.b.y)-Math.hypot(b.b.x,b.b.y));
      const pair=loose.length ? Math.min(...loose.map(({i})=>Math.floor(i/2))) : -1;
      leader=loose.find(({i})=>Math.floor(i/2)===pair)?.i ?? -1;
      target=slots.findIndex((_,i)=>!occupied().includes(i));lastPlan=-Infinity;
    }
    if(target>=0&&occupied().includes(target)) {target=slots.findIndex((_,i)=>!occupied().includes(i));lastPlan=-Infinity;}
    let desiredX=0,desiredY=0;
    if(leader>=0&&target>=0&&time>.65) {
      const p=bodies[leader];
      if(time-lastPlan>1.5) {waypoints=route(p,slots[target],occupied());lastPlan=time;}
      while(waypoints.length>1&&Math.hypot(p.x-waypoints[0].x,p.y-waypoints[0].y)<.065)waypoints.shift();
      const aim=waypoints[0] ?? slots[target],dx=aim.x-p.x,dy=aim.y-p.y,d=Math.hypot(dx,dy)||1;
      const speed=Math.min(.90,Math.sqrt(1.5*Math.hypot(p.x-slots[target].x,p.y-slots[target].y)));
      desiredX=(dx/d*speed-p.vx)*4/G;desiredY=(dy/d*speed-p.vy)*4/G;
      const length=Math.hypot(desiredX,desiredY),max=Math.sin(.13);if(length>max){desiredX*=max/length;desiredY*=max/length;}
    }
    if(time<5&&time>.45) {desiredX=0;desiredY=-Math.sin(.10)*Math.sin(Math.PI*(time-.45)/4.55);}
    gx+=(desiredX-gx)*(1-Math.exp(-8*DT));gy+=(desiredY-gy)*(1-Math.exp(-8*DT));
    for(const b of bodies) if(b.slot<0) {
      b.vx=(b.vx+G*gx*DT)*Math.exp(-DRAG*DT);b.vy=(b.vy+G*gy*DT)*Math.exp(-DRAG*DT);
      b.x+=b.vx*DT;b.y+=b.vy*DT;
    }
    for(let iteration=0;iteration<4;iteration++) {
      for(const b of bodies) if(b.slot<0) {
        const radius=Math.hypot(b.x,b.y);if(radius>LIMIT)bounce(b,-b.x/radius,-b.y/radius,radius-LIMIT);
        for(const wall of MAZE_WALLS){const c=wallContact(b,wall.radius,wall.gates[0]);if(c.distance<R+.003)bounce(b,c.nx,c.ny,R+.003-c.distance);}
        if(b.x>-.92&&b.x<.04&&b.y>-.27&&b.y<.65){const c=dContact(b);if(c.distance<R+.003)bounce(b,c.nx,c.ny,R+.003-c.distance);}
      }
      for(let i=0;i<9;i++)for(let j=i+1;j<9;j++) {
        const a=bodies[i],b=bodies[j];if(a.slot>=0&&b.slot>=0)continue;
        const ra=a.slot<0 ? R : slots[a.slot].radius,rb=b.slot<0 ? R : slots[b.slot].radius;
        const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>=ra+rb+.002)continue;
        const nx=dx/(d||1),ny=dy/(d||1),push=ra+rb+.002-d;
        if(a.slot<0&&b.slot<0){a.x-=nx*push/2;a.y-=ny*push/2;b.x+=nx*push/2;b.y+=ny*push/2;const incoming=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(incoming<0){a.vx+=incoming*.60*nx;a.vy+=incoming*.60*ny;b.vx-=incoming*.60*nx;b.vy-=incoming*.60*ny;if(iteration===0)collisions++;}}
        else if(a.slot<0)bounce(a,-nx,-ny,push);else bounce(b,nx,ny,push);
      }
    }
    const used=occupied();
    for(let i=0;i<8;i++) {
      const b=bodies[i];if(b.slot>=0)continue;
      const slot=target>=0&&!used.includes(target)&&Math.hypot(slots[target].x-b.x,slots[target].y-b.y)<.026&&Math.hypot(b.vx,b.vy)<.45 ? target : -1;
      if(slot>=0){b.slot=slot;b.x=slots[slot].x;b.y=slots[slot].y;b.vx=0;b.vy=0;b.seatedAt=time;used.push(slot);arrivals[i]=time;}
    }
    if(occupied().length===9&&completeAt===Infinity)completeAt=time;
    save();if(time>completeAt+3)break;
  }
  const duration=(frames.length-1)*DT/MAZE_PLAYBACK_RATE,cycle=duration+.8;
  function frameAt(seconds:number,still=false) {
    const displayTime=still ? duration : ((seconds%cycle)+cycle)%cycle;
    const t=displayTime*MAZE_PLAYBACK_RATE;
    const at=Math.min(frames.length-1,t/DT),i=Math.floor(at),next=Math.min(frames.length-1,i+1),q=at-i;
    const a=frames[i],b=frames[next],lerp=(x:number,y:number)=>x+(y-x)*q;
    const x=lerp(a.gx,b.gx),y=lerp(a.gy,b.gy),pitch=y ? -Math.asin(y) : 0,yaw=x ? Math.asin(x/Math.cos(pitch)) : 0;
    return {marbles:a.marbles.map((p,index)=>{
      const end=b.marbles[index],docked=p.slot>=0,slot=docked ? slots[p.slot] : null;
      return {x:lerp(p.x,end.x),y:lerp(p.y,end.y),vx:lerp(p.vx,end.vx)*MAZE_PLAYBACK_RATE,vy:lerp(p.vy,end.vy)*MAZE_PLAYBACK_RATE,radius:slot?.radius ?? R,docked,slot:p.slot,active:true,scale:1,z:0,impact:0};
    }),collector:mazeCollector(0),logo:1,impacts:[] as {x:number;y:number;age:number}[],collision:a.collisions,pitch:still ? 0 : pitch,yaw:still ? 0 : yaw,downhillX:still ? 0 : x,downhillY:still ? 0 : y,
      stage:still ? "still" : t>=completeAt ? "settled" : "shared-gravity",direction:Math.hypot(x,y)<.002 ? "level" : Math.abs(x)>Math.abs(y) ? x>0 ? "right" : "left" : y>0 ? "up" : "down",relayStep:0,activeRing:0,
      fade:still ? 1 : Math.min(1,displayTime/.25)*Math.max(0,Math.min(1,(cycle-displayTime)/.45)),phase:still ? "still" : t>=completeAt ? "logo" : "rolling"};
  }
  return {sampleMazeSequence:frameAt,sampleMazeMarble:(t:number,i:number,still=false)=>frameAt(t,still).marbles[i],mazeHandTilt:frameAt,mazeDestination,arrival:(i:number)=>arrivals[i]/MAZE_PLAYBACK_RATE,completeAt:completeAt/MAZE_PLAYBACK_RATE,cycle,duration};
}
