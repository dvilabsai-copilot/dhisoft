export * from "./maze-geometry";
import {createPhysicsMaze} from "./maze-physics";
export function createMazeSequence(seed:number) {
  // Keep a complete physical take. A stalled run is retried from new starting
  // positions rather than adding attraction forces or teleporting a marble.
  for(let attempt=0;attempt<3;attempt++) {
    const result=createPhysicsMaze((seed+Math.imul(attempt,0x9e3779b9))>>>0);
    if(Number.isFinite(result.completeAt)) return result;
  }
  return createPhysicsMaze(42);
}
const sequence=createMazeSequence(20261115);
export const MAZE_CYCLE=sequence.cycle,MAZE_LAST_ENTRY=sequence.completeAt,MAZE_LOGO_END=sequence.completeAt+.2;
export const sampleMazeSequence=sequence.sampleMazeSequence;
export const sampleMazeMarble=sequence.sampleMazeMarble;
export const mazeHandTilt=sequence.mazeHandTilt;
