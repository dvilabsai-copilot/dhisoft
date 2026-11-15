import {describe,expect,it} from "vitest";
import {MAZE_TRACK_RADII,MAZE_GATE_HALF,MAZE_WALLS,createMazeSequence,mazeCollector,mazeDestination} from "./maze-sequence";
import {MAZE_GRAVITY,MAZE_DRAG,mazePhysicalClearance} from "./maze-physics";

describe("shared-gravity maze",()=> {
  it("keeps one staggered opening on each of the four rings",()=> {
    expect(MAZE_WALLS).toHaveLength(4);
    MAZE_WALLS.forEach((wall,index)=>expect(wall.gates).toEqual([index*Math.PI/2]));
  });
  it.each([1,2,3,7,42,2026,65535,4294967295])("rolls every loose ball and completes nine physical pockets, seed %s",seed=>{
    const sequence=createMazeSequence(seed),initial=sequence.sampleMazeSequence(0);
    expect(initial.marbles).toHaveLength(9);expect(initial.marbles.filter(m=>m.docked)).toHaveLength(1);
    expect(initial.marbles[8]).toMatchObject({...mazeDestination(8),docked:true});
    for(const radius of MAZE_TRACK_RADII) expect(initial.marbles.filter(m=>!m.docked&&Math.abs(Math.hypot(m.x,m.y)-radius)<.001)).toHaveLength(2);
    expect(sequence.completeAt).toBeLessThan(70);
    for(let i=0;i<8;i++) {
      const a=sequence.sampleMazeMarble(.3,i),b=sequence.sampleMazeMarble(1.2,i);
      expect(Math.hypot(a.x-b.x,a.y-b.y),`Frozen loose marble ${i}`).toBeGreaterThan(.015);
      expect(sequence.arrival(i)).toBeGreaterThan(0);
      const at=sequence.arrival(i)+.05,dot=sequence.sampleMazeMarble(at,i);
      expect(dot.docked).toBe(true);
      expect(sequence.sampleMazeMarble(sequence.duration,i)).toMatchObject({x:dot.x,y:dot.y,docked:true});
    }
    expect(Math.abs(sequence.arrival(0)-sequence.arrival(1))).toBeLessThan(5);
    for(let t=.1;t<sequence.completeAt;t+=.095) {
      const pose=sequence.sampleMazeSequence(t);
      expect(pose.marbles.filter(m=>m.active)).toHaveLength(9);
      expect(pose.logo).toBe(1);expect(pose.collector).toEqual(mazeCollector(0));
      for(let i=0;i<9;i++) {
        const marble=pose.marbles[i];
        expect(mazePhysicalClearance(marble),`Wall clearance at ${t}`).toBeGreaterThanOrEqual(marble.radius-.008);
        for(let j=i+1;j<9;j++) {
          const other=pose.marbles[j];
          expect(Math.hypot(marble.x-other.x,marble.y-other.y),`Marbles ${i},${j} at ${t}`).toBeGreaterThanOrEqual(marble.radius+other.radius-.008);
        }
        const radius=Math.hypot(marble.x,marble.y);
        for(const wall of MAZE_WALLS) if(Math.abs(radius-wall.radius)<.075+marble.radius-.01) {
          const angle=Math.atan2(marble.y,marble.x)-wall.gates[0];
          expect(Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle))),`Ring crossing at ${t}`).toBeLessThan(MAZE_GATE_HALF+.04);
        }
      }
    }
    const end=sequence.sampleMazeSequence(sequence.duration);
    expect(end.marbles.every(m=>m.docked)).toBe(true);expect(new Set(end.marbles.map(m=>m.slot)).size).toBe(9);
  },20000);
  it("applies the same gravity and drag to every free marble, including outer tracks",()=> {
    const sequence=createMazeSequence(42),tick=1/360;
    let checked=0;
    for(let frame=80;frame<3000;frame+=7) {
      const a=sequence.sampleMazeSequence(frame*tick),b=sequence.sampleMazeSequence((frame+1)*tick);
      for(let i=0;i<8;i++) {
        const p=a.marbles[i],q=b.marbles[i];
        if(p.docked||q.docked||mazePhysicalClearance(p)<p.radius+.025||mazePhysicalClearance(q)<q.radius+.025)continue;
        if(a.marbles.some((m,j)=>j!==i&&Math.hypot(p.x-m.x,p.y-m.y)<p.radius+m.radius+.04))continue;
        expect(q.vx).toBeCloseTo((p.vx+MAZE_GRAVITY*b.downhillX*tick)*Math.exp(-MAZE_DRAG*tick),5);
        expect(q.vy).toBeCloseTo((p.vy+MAZE_GRAVITY*b.downhillY*tick)*Math.exp(-MAZE_DRAG*tick),5);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(200);
  });
  it("randomizes initial positions, preserves tilt geometry and supports reduced motion",()=> {
    const a=createMazeSequence(1),b=createMazeSequence(2);
    expect(a.sampleMazeSequence(0).marbles).not.toEqual(b.sampleMazeSequence(0).marbles);
    for(let t=.2;t<a.completeAt;t+=.1) {
      const h=a.sampleMazeSequence(t);
      expect(Math.hypot(h.pitch,h.yaw)).toBeLessThan(.132);
      expect(-Math.sin(h.pitch)).toBeCloseTo(h.downhillY,10);
      expect(Math.cos(h.pitch)*Math.sin(h.yaw)).toBeCloseTo(h.downhillX,10);
    }
    const still=a.sampleMazeSequence(0,true);
    expect(still.marbles.every(m=>m.docked)).toBe(true);expect(still.pitch).toBe(0);expect(still.yaw).toBe(0);
    expect(a.sampleMazeSequence(a.cycle).marbles.filter(m=>!m.docked)).toHaveLength(8);
  });
});
