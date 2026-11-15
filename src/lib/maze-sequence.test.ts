import {describe,expect,it} from "vitest";
import {MAZE_OUTSIDE_COLLISIONS,MAZE_CYCLE,MAZE_ENTRY_START,MAZE_ENTRY_INTERVAL,MAZE_ENTRY_DURATION,MAZE_FIRST_IMPACT,MAZE_GATE_HALF,MAZE_LAST_ENTRY,MAZE_LOGO_END,MAZE_WALLS,createMazeSequence,mazeCollector,mazeDestination,mazeDWallClearance,sampleMazeSequence} from "./maze-sequence";

describe("one-by-one maze dots",()=> {
  it.each([1,2,3,7,42,2026,65535,4294967295])("uses staggered second-ring contacts and seats eight individually, seed %s",seed=>{
    const sequence=createMazeSequence(seed);
    const count=(t:number)=>sequence.sampleMazeSequence(t).marbles.filter(m=>m.active).length;
    const initial=sequence.sampleMazeSequence(0);
    expect(count(0)).toBe(3);expect(initial.marbles[8]).toMatchObject({...mazeDestination(8),active:true,docked:true});
    expect(sequence.outsideCollisions).toHaveLength(6);
    sequence.outsideCollisions.forEach((event,index)=>{
      expect(Math.hypot(event.point.x,event.point.y)).toBeCloseTo(1.85,9);
      if(index) expect(event.time-sequence.outsideCollisions[index-1].time).toBeGreaterThan(.8);
      expect(count(event.time-.001)).toBe(3+index);expect(count(event.time)).toBe(4+index);
      const a=sequence.sampleMazeMarble(event.time,event.pair[0]),b=sequence.sampleMazeMarble(event.time,event.pair[1]);
      expect(Math.hypot(a.x-b.x,a.y-b.y)).toBeCloseTo(a.radius+b.radius,8);
      expect(sequence.sampleMazeMarble(event.time,event.child).scale).toBe(0);
    });
    expect(count(MAZE_ENTRY_START)).toBe(9);
    expect(new Set(sequence.outsideCollisions.map(e=>`${e.point.x.toFixed(2)},${e.point.y.toFixed(2)}`)).size).toBe(6);
    expect(MAZE_ENTRY_INTERVAL).toBeGreaterThan(MAZE_ENTRY_DURATION);
    for(let index=0;index<8;index++) {
      const arrived=MAZE_ENTRY_START+index*MAZE_ENTRY_INTERVAL+MAZE_ENTRY_DURATION;
      expect(sequence.sampleMazeSequence(arrived+.001).marbles.filter(m=>m.docked)).toHaveLength(index+2);
      for(let t=arrived;t<MAZE_LOGO_END;t+=.18) expect(sequence.sampleMazeMarble(t+.001,index)).toMatchObject({...mazeDestination(index),docked:true});
    }
    for(let t=0;t<MAZE_LOGO_END;t+=.025) {
      const pose=sequence.sampleMazeSequence(t);
      expect(pose.logo).toBe(1);expect(pose.collector).toEqual(mazeCollector(0));
      const seated=pose.marbles.filter(m=>m.docked);
      for(const marble of pose.marbles) {
        if(!marble.active||marble.scale<.95) continue;
        expect(mazeDWallClearance(marble),`D clearance at ${t}`).toBeGreaterThanOrEqual(marble.radius+.007);
        if(!marble.docked&&t>=MAZE_ENTRY_START) for(const dot of seated) {
          expect(Math.hypot(marble.x-dot.x,marble.y-dot.y),`Filled dot at ${t}`).toBeGreaterThanOrEqual(marble.radius+dot.radius+.003);
        }
        const radius=Math.hypot(marble.x,marble.y);
        for(const wall of MAZE_WALLS) if(Math.abs(radius-wall.radius)<.075+marble.radius) {
          const angle=Math.atan2(marble.y,marble.x)-wall.gate;
          expect(Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle)))+Math.asin(marble.radius/radius),`Ring ${wall.radius} at ${t.toFixed(3)}: ${marble.x.toFixed(3)},${marble.y.toFixed(3)}`).toBeLessThan(MAZE_GATE_HALF);
        }
      }
    }
    expect(sequence.sampleMazeSequence(MAZE_LAST_ENTRY+.1).marbles.every(m=>m.docked)).toBe(true);
  });
  it("starts the first contact in the second ring before four seconds",()=> {
    expect(MAZE_FIRST_IMPACT).toBeLessThan(4);
    expect(MAZE_OUTSIDE_COLLISIONS[0].time).toBe(MAZE_FIRST_IMPACT);
  });
  it("makes fresh random collision positions and timing",()=> {
    expect(createMazeSequence(1).outsideCollisions).not.toEqual(createMazeSequence(2).outsideCollisions);
    expect(createMazeSequence(42).outsideCollisions).toEqual(createMazeSequence(42).outsideCollisions);
  });
  it("tilts toward the single traveling marble and stops tilting after placement",()=> {
    const sequence=createMazeSequence(42);
    for(let t=MAZE_ENTRY_START+.01;t<MAZE_LAST_ENTRY;t+=.023) {
      const h=sequence.mazeHandTilt(t);
      for(let i=0;i<8;i++) {
        const start=MAZE_ENTRY_START+i*MAZE_ENTRY_INTERVAL;
        if(t<start+.003||t>start+MAZE_ENTRY_DURATION-.003) continue;
        const a=sequence.sampleMazeMarble(t-.001,i),b=sequence.sampleMazeMarble(t+.001,i);
        expect((b.x-a.x)*h.downhillX+(b.y-a.y)*h.downhillY).toBeGreaterThanOrEqual(-1e-9);
      }
    }
    expect(sequence.mazeHandTilt(MAZE_LAST_ENTRY+.1)).toMatchObject({pitch:0,yaw:0,stage:"settled"});
  });
  it("shows all nine fixed dots with reduced motion and replays from three",()=> {
    const end=sampleMazeSequence(0,true);
    expect(end.logo).toBe(1);expect(end.phase).toBe("still");expect(end.pitch).toBe(0);expect(end.yaw).toBe(0);
    end.marbles.forEach((m,i)=>expect(m).toMatchObject({...mazeDestination(i),active:true,docked:true}));
    expect(sampleMazeSequence(MAZE_CYCLE).marbles.filter(m=>m.active)).toHaveLength(3);
  });
});
