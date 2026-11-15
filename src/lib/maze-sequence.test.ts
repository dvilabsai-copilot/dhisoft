import {describe,expect,it} from "vitest";
import {MAZE_BOWL_COLLISIONS,MAZE_OUTSIDE_COLLISIONS,MAZE_CYCLE,MAZE_D_MOVE_END,MAZE_D_MOVE_START,MAZE_ENTRY_START,MAZE_ENTRY_INTERVAL,MAZE_ENTRY_DURATION,MAZE_FIRST_CONTACTS,MAZE_FIRST_IMPACT,MAZE_GATE_HALF,MAZE_LAST_ENTRY,MAZE_LOGO_END,MAZE_STAGES,MAZE_WALLS,createMazeSequence,mazeDWallClearance,mazeCollector,mazeDestination,mazeHandTilt,sampleMazeMarble,sampleMazeSequence} from "./maze-sequence";

describe("pair collision maze",()=> {
  const count=(time:number)=>sampleMazeSequence(time).marbles.filter(m=>m.active).length;
  it("starts with one in the D and two outside, then staggers the growth until nine",()=> {
    expect(count(0)).toBe(3);
    const resident=sampleMazeMarble(0,8);
    expect(resident.active).toBe(true);expect(Math.hypot(resident.x,resident.y)).toBeLessThan(.8);
    expect(count(MAZE_FIRST_IMPACT-.001)).toBe(3);
    expect(count(MAZE_FIRST_IMPACT)).toBe(4);
    expect(count(MAZE_OUTSIDE_COLLISIONS[1].time)).toBe(5);
    expect(count(MAZE_D_MOVE_START)).toBe(9);
    expect(count(MAZE_CYCLE)).toBe(3);
    const impact=sampleMazeSequence(MAZE_FIRST_IMPACT);
    const a=impact.marbles[0],b=impact.marbles[1];
    expect(Math.hypot(a.x-b.x,a.y-b.y)).toBeCloseTo(a.radius+b.radius,10);
    expect(Math.hypot(a.x,a.y)).toBeCloseTo(1.85,2);
    expect(impact.marbles[2].x).toBe(0);expect(impact.marbles[2].y).toBe(1.85);expect(impact.marbles[2].scale).toBe(0);
    for(let i=0;i<2;i++) expect(impact.marbles[i]).toMatchObject(MAZE_FIRST_CONTACTS[i]);
  });
  it("adds one marble per individual contact inside the D, with time between collisions",()=> {
    expect(MAZE_BOWL_COLLISIONS.map(e=>e.child)).toEqual([4,5,6,7]);
    MAZE_BOWL_COLLISIONS.forEach((event,index)=> {
      expect(event.time).toBeGreaterThan(MAZE_LAST_ENTRY);
      expect(event.time).toBeLessThan(MAZE_D_MOVE_START-.4);
      expect(event.pair[0]).not.toBe(event.pair[1]);
      expect(event.pair.every(i=>sampleMazeMarble(event.time-.001,i).active)).toBe(true);
      expect(count(event.time-.001)).toBe(5+index);
      expect(count(event.time)).toBe(6+index);
      if(index) expect(event.time-MAZE_BOWL_COLLISIONS[index-1].time).toBeGreaterThan(.6);
      expect(sampleMazeMarble(event.time,event.child).scale).toBe(0);
      const c=mazeCollector(event.time),dx=event.point.x-c.x,dy=event.point.y-c.y;
      expect(Math.hypot(dx,dy)).toBeLessThan(.6);
    });
  });
  it("collides in the second circle before crossing its inner wall",()=> {
    expect(MAZE_FIRST_IMPACT).toBeLessThan(4);
    for(const event of MAZE_OUTSIDE_COLLISIONS) {
      expect(Math.hypot(event.point.x,event.point.y)).toBeGreaterThan(MAZE_WALLS[1].radius+.12);
      expect(Math.hypot(event.point.x,event.point.y)).toBeLessThan(MAZE_WALLS[0].radius-.12);
    }
    for(let i=0;i<4;i++) for(let t=MAZE_FIRST_IMPACT;t<MAZE_ENTRY_START;t+=.012) {
      const m=sampleMazeMarble(t,i);if(!m.active) continue;
      const distance=Math.hypot(m.x,m.y);
      for(const wall of MAZE_WALLS) if(Math.abs(distance-wall.radius)<.075+m.radius) {
        const angle=Math.atan2(m.y,m.x)-wall.gate;
        expect(Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle)))+Math.asin(m.radius/distance)).toBeLessThan(MAZE_GATE_HALF);
      }
    }
  });
  it("routes both starting marbles through openings before the first collision",()=> {
    for(let i=0;i<2;i++) for(let t=0;t<MAZE_FIRST_IMPACT;t+=.012) {
      const m=sampleMazeMarble(t,i),distance=Math.hypot(m.x,m.y);
      const other=sampleMazeMarble(t,1-i);
      expect(Math.hypot(m.x-other.x,m.y-other.y)).toBeGreaterThanOrEqual(m.radius+other.radius-1e-7);
      for(const wall of MAZE_WALLS) if(Math.abs(distance-wall.radius)<.075+m.radius) {
        const angle=Math.atan2(m.y,m.x)-wall.gate,difference=Math.atan2(Math.sin(angle),Math.cos(angle));
        expect(Math.abs(difference)+Math.asin(m.radius/distance)).toBeLessThan(MAZE_GATE_HALF);
      }
    }
  });
  it("keeps rolling spheres clear of the actual raised D outline",()=> {
    for(let t=0;t<MAZE_LOGO_END;t+=.025) for(const marble of sampleMazeSequence(t).marbles) {
      if(marble.active&&marble.scale>.95) expect(mazeDWallClearance(marble),`D wall at ${t.toFixed(3)}: ${marble.x.toFixed(3)},${marble.y.toFixed(3)}`).toBeGreaterThanOrEqual(marble.radius+.008);
    }
  });
  it("takes the four into the D one after another",()=> {
    expect(MAZE_ENTRY_INTERVAL).toBeGreaterThan(MAZE_ENTRY_DURATION);
    for(let i=0;i<4;i++) {
      const time=MAZE_ENTRY_START+i*MAZE_ENTRY_INTERVAL+MAZE_ENTRY_DURATION;
      expect(count(time)).toBe(5);
      const m=sampleMazeMarble(time,i);
      expect(m.y).toBeGreaterThan(-.4);
      if(i<3) expect(Math.hypot(sampleMazeMarble(time,i+1).x,sampleMazeMarble(time,i+1).y)).toBeGreaterThan(1.3);
    }
  });
  it.each([1,2,3,7,42,2026,65535,4294967295])("finishes nine with randomized seed %s and only one birth at a time",seed=>{
    const sequence=createMazeSequence(seed);
    expect(sequence.sampleMazeSequence(0).marbles.filter(m=>m.active)).toHaveLength(3);
    expect(sequence.sampleMazeSequence(MAZE_D_MOVE_START).marbles.filter(m=>m.active)).toHaveLength(9);
    for(let t=0;t<MAZE_LOGO_END;t+=.08) for(const marble of sequence.sampleMazeSequence(t).marbles) {
      if(marble.active&&marble.scale>.95) expect(mazeDWallClearance(marble)).toBeGreaterThanOrEqual(marble.radius+.007);
    }
    const events=[...sequence.outsideCollisions,...sequence.bowlCollisions];
    expect(events).toHaveLength(6);
    events.forEach((event,index)=>{
      if(index) expect(event.time-events[index-1].time).toBeGreaterThan(.5);
      expect(sequence.sampleMazeSequence(event.time-.001).marbles.filter(m=>m.active).length+1).toBe(sequence.sampleMazeSequence(event.time).marbles.filter(m=>m.active).length);
    });
    expect(new Set(events.map(e=>`${e.point.x.toFixed(2)},${e.point.y.toFixed(2)}`)).size).toBeGreaterThan(3);
  });
  it("keeps the complete wordmark fixed while the marbles roll independently",()=> {
    const local=(time:number,index:number)=> {
      const m=sampleMazeMarble(time,index),c=mazeCollector(time),x=(m.x-c.x)/c.scale,y=(m.y-c.y)/c.scale;
      return {x:x*Math.cos(c.angle)+y*Math.sin(c.angle),y:-x*Math.sin(c.angle)+y*Math.cos(c.angle)};
    };
    const a=MAZE_D_MOVE_START+.3,b=MAZE_D_MOVE_START+1.2;
    for(const time of [0,MAZE_FIRST_IMPACT,MAZE_LAST_ENTRY,a,b,MAZE_LOGO_END]) {
      expect(sampleMazeSequence(time).logo).toBe(1);
      expect(mazeCollector(time)).toEqual(mazeCollector(0));
      expect(mazeCollector(time)).toMatchObject({angle:0,scale:1,lift:0,progress:1});
    }
    for(let i=0;i<9;i++) {
      const p=local(a,i),q=local(b,i);
      expect(Math.hypot(p.x-q.x,p.y-q.y)).toBeGreaterThan(.001);
      expect(sampleMazeMarble(a,i).docked).toBe(false);
    }
    for(let t=MAZE_D_MOVE_START;t<MAZE_D_MOVE_END;t+=.035) {
      const m=sampleMazeSequence(t).marbles;
      for(let i=0;i<9;i++) for(let j=i+1;j<9;j++) expect(Math.hypot(m[i].x-m[j].x,m[i].y-m[j].y)).toBeGreaterThanOrEqual(m[i].radius+m[j].radius-.008);
    }
  });
  it("aligns the guided rolls with the tilt and completes the original logo",()=> {
    for(const stage of MAZE_STAGES) for(let t=stage.start+.04;t<stage.end-.04;t+=.045) {
      const h=mazeHandTilt(t),gx=Math.cos(h.pitch)*Math.sin(h.yaw),gy=-Math.sin(h.pitch);
      expect(gx).toBeCloseTo(h.downhillX,10);expect(gy).toBeCloseTo(h.downhillY,10);
      for(let i=0;i<2;i++) {const a=sampleMazeMarble(t-.001,i),b=sampleMazeMarble(t+.001,i);expect((b.x-a.x)*gx+(b.y-a.y)*gy).toBeGreaterThanOrEqual(-1e-9);}
    }
    const end=sampleMazeSequence(MAZE_LOGO_END+.1);
    expect(end.logo).toBe(1);expect(end.phase).toBe("logo");
    end.marbles.forEach((m,i)=>{expect(m.docked).toBe(true);expect(m.x).toBe(mazeDestination(i).x);expect(m.y).toBe(mazeDestination(i).y);});
    const still=sampleMazeSequence(0,true);
    expect(still.logo).toBe(1);expect(still.collector.progress).toBe(1);
    expect(still.marbles.filter(m=>m.active&&m.docked)).toHaveLength(9);
    expect(still.pitch).toBe(0);expect(still.yaw).toBe(0);
  });
});
