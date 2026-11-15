export const RUBIK_SIZE = 6;
export type RubikMove = { axis: "x" | "y"; layer: number; direction: 1 | -1; label: string };
export type RubikPose = { position: [number, number, number]; orientation: number[] };

// The requested visible solve order. Scramble with its exact inverse, in reverse order.
export const RUBIK_SOLUTION: readonly RubikMove[] = [
  { axis: "y", layer: 5, direction: 1, label: "Top" },
  { axis: "x", layer: 0, direction: -1, label: "Left" },
  { axis: "x", layer: 5, direction: 1, label: "Right" },
  { axis: "y", layer: 4, direction: -1, label: "Second top" },
  { axis: "x", layer: 4, direction: -1, label: "Second right" },
  { axis: "x", layer: 1, direction: 1, label: "Second left" },
  { axis: "y", layer: 3, direction: 1, label: "Third top" },
  { axis: "x", layer: 3, direction: 1, label: "Third right" },
  { axis: "x", layer: 2, direction: -1, label: "Third left" },
];
export const RUBIK_SCRAMBLED_HOLD = 1.5;
export const RUBIK_TURN_SECONDS = 1.1;
export const RUBIK_TURN_INTERVAL = 1.35;
export const RUBIK_SOLVE_END = RUBIK_SCRAMBLED_HOLD + RUBIK_SOLUTION.length * RUBIK_TURN_INTERVAL;
const CYCLE_SECONDS = RUBIK_SOLVE_END + 4;

export function solvedRubik(): RubikPose[] {
  return Array.from({ length: RUBIK_SIZE ** 3 }, (_, i) => ({
    position: [Math.floor(i / 36), Math.floor(i / 6) % 6, i % 6],
    orientation: [1,0,0,0,1,0,0,0,1],
  }));
}

export function turnRubik(state: RubikPose[], move: RubikMove): RubikPose[] {
  const positive = move.direction === 1;
  const rotation = move.axis === "x"
    ? (positive ? [1,0,0,0,0,-1,0,1,0] : [1,0,0,0,0,1,0,-1,0])
    : (positive ? [0,0,1,0,1,0,-1,0,0] : [0,0,-1,0,1,0,1,0,0]);
  return state.map(pose => {
    const [x,y,z] = pose.position;
    if (pose.position[move.axis === "x" ? 0 : 1] !== move.layer) return pose;
    const position: [number,number,number] = move.axis === "x"
      ? (positive ? [x,5-z,y] : [x,z,5-y])
      : (positive ? [z,y,5-x] : [5-z,y,x]);
    const orientation = Array.from({ length: 9 }, (_, i) => {
      const row = Math.floor(i / 3), column = i % 3;
      return [0,1,2].reduce((sum,k) => sum + rotation[row*3+k]*pose.orientation[k*3+column], 0);
    });
    return { position, orientation };
  });
}

export function rubikSolveStates(): RubikPose[][] {
  let scrambled = solvedRubik();
  for (const move of [...RUBIK_SOLUTION].reverse()) {
    scrambled = turnRubik(scrambled, { ...move, direction: move.direction === 1 ? -1 : 1 });
  }
  const frames = [scrambled];
  for (const move of RUBIK_SOLUTION) frames.push(turnRubik(frames[frames.length-1], move));
  return frames;
}

export function sampleRubikSequence(seconds: number, still = false) {
  const t = still ? RUBIK_SOLVE_END : Math.max(0,seconds) % CYCLE_SECONDS;
  if (t < RUBIK_SCRAMBLED_HOLD) return { phase: "scrambled", stateIndex: 0, move: null, fraction: 0, completed: 0 } as const;
  if (t >= RUBIK_SOLVE_END) return { phase: "aligned", stateIndex: 9, move: null, fraction: 0, completed: 9 } as const;
  const elapsed = t - RUBIK_SCRAMBLED_HOLD;
  const index = Math.floor(elapsed / RUBIK_TURN_INTERVAL);
  const local = elapsed - index * RUBIK_TURN_INTERVAL;
  if (local >= RUBIK_TURN_SECONDS) return { phase: "solving", stateIndex: index+1, move: null, fraction: 0, completed: index+1 } as const;
  const f = local / RUBIK_TURN_SECONDS;
  return { phase: "solving", stateIndex: index, move: RUBIK_SOLUTION[index], fraction: f*f*(3-2*f), completed: index } as const;
}
