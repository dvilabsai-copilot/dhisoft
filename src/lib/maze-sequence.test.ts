import {describe,expect,it} from "vitest";
import {MAZE_CYCLE,MAZE_ENTRY_START,MAZE_ENTRY_INTERVAL,MAZE_ENTRY_DURATION,MAZE_GATE_HALF,MAZE_LAST_ENTRY,MAZE_LOGO_END,MAZE_WALLS,createMazeSequence,mazeCollector,mazeDestination,mazeDWallClearance,sampleMazeSequence} from "./maze-sequence";

describe("one-by-one maze dots",()=> {
  it.each([1,2,3,7,42,2026,65535,4294967295])("starts two in each ring and seats six individually without multiplication, seed %s",seed=>{
    const sequence=createMazeSequence(seed);
    const count=(t:number)=>sequence.sampleMazeSequence(t).marbles.filter(m=>m.active).length;
    const initial=sequence.sampleMazeSequence(0);
    expect(count(0)).toBe(9);
    expect(initial.marbles.filter(m=>m.docked)).toHaveLength(3);
    for(const radius of [2.28,1.85,1.45]) expect(initial.marbles.filter(m=>!m.docked&&Math.abs(Math.hypot(m.x,m.y)-radius)<.001)).toHaveLength(2);
    expect(MAZE_ENTRY_INTERVAL).toBeGreaterThan(MAZE_ENTRY_DURATION);
    for(let index=0;index<6;index++) {
      const arrived=MAZE_ENTRY_START+index*MAZE_ENTRY_INTERVAL+MAZE_ENTRY_DURATION;
      expect(sequence.sampleMazeSequence(arrived+.001).marbles.filter(m=>m.docked)).toHaveLength(index+4);
      for(let t=arrived;t<MAZE_LOGO_END;t+=.18) expect(sequence.sampleMazeMarble(t+.001,index)).toMatchObject({...mazeDestination(index),docked:true});
    }
    for(let t=0;t<MAZE_LOGO_END;t+=.025) {
      const pose=sequence.sampleMazeSequence(t);
      expect(pose.marbles.filter(m=>m.active)).toHaveLength(9);expect(pose.collision).toBe(0);expect(pose.impacts).toHaveLength(0);
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
  it("varies starting angles without changing the number of marbles",()=> {
    expect(createMazeSequence(1).sampleMazeSequence(0).marbles).not.toEqual(createMazeSequence(2).sampleMazeSequence(0).marbles);
    expect(createMazeSequence(42).sampleMazeSequence(0)).toEqual(createMazeSequence(42).sampleMazeSequence(0));
  });
  it("uses only three shallow tilt gestures, one for each ring pair",()=> {
    const sequence=createMazeSequence(42);let gestures=0,moving=false;
    for(let t=0;t<MAZE_LAST_ENTRY+1;t+=.01) {
      const h=sequence.mazeHandTilt(t),active=Math.hypot(h.pitch,h.yaw)>.000001;
      if(active&&!moving) gestures++;moving=active;
      expect(Math.hypot(h.pitch,h.yaw)).toBeLessThanOrEqual(.100001);
    }
    expect(gestures).toBe(3);
    expect(sequence.mazeHandTilt(MAZE_LAST_ENTRY+.1)).toMatchObject({pitch:0,yaw:0,stage:"settled"});
  });
  it("shows all nine fixed dots with reduced motion and replays with two per ring",()=> {
    const end=sampleMazeSequence(0,true);
    expect(end.logo).toBe(1);expect(end.phase).toBe("still");expect(end.pitch).toBe(0);expect(end.yaw).toBe(0);
    end.marbles.forEach((m,i)=>expect(m).toMatchObject({...mazeDestination(i),active:true,docked:true}));
    expect(sampleMazeSequence(MAZE_CYCLE).marbles.filter(m=>!m.docked)).toHaveLength(6);
  });
});
