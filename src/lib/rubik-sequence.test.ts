import { describe, expect, it } from "vitest";
import { RUBIK_SOLUTION, RUBIK_SCRAMBLED_HOLD, RUBIK_TURN_INTERVAL, RUBIK_TURN_SECONDS, RUBIK_SOLVE_END, rubikSolveStates, sampleRubikSequence, solvedRubik, turnRubik } from "./rubik-sequence";

describe("nine-turn Rubik solve", () => {
  it("starts scrambled and restores every cube's exact position and orientation after nine turns", () => {
    const states = rubikSolveStates();
    expect(states).toHaveLength(10);
    expect(states[0]).not.toEqual(solvedRubik());
    expect(states[9]).toEqual(solvedRubik());
  });
  it("preserves all 216 occupied slots and rotates exactly 36 cubes per move", () => {
    const states = rubikSolveStates();
    for (let i=0;i<9;i++) {
      const move = RUBIK_SOLUTION[i];
      const slice = states[i].filter(p=>p.position[move.axis === "x" ? 0 : 1] === move.layer);
      expect(slice).toHaveLength(36);
      expect(states[i+1]).toEqual(turnRubik(states[i],move));
      expect(new Set(states[i+1].map(p=>p.position.join(","))).size).toBe(216);
      for (const pose of states[i+1]) {
        expect(pose.position.every(n=>Number.isInteger(n) && n>=0 && n<6)).toBe(true);
        expect(pose.orientation.every(n=>n===-1 || n===0 || n===1)).toBe(true);
      }
    }
  });
  it("uses the requested outer, second, and third layer order", () => {
    expect(RUBIK_SOLUTION.map(m=>m.label)).toEqual(["Top","Left","Right","Second top","Second right","Second left","Third top","Third right","Third left"]);
  });
  it("holds the scramble first, animates all nine turns once, then holds the solved cube", () => {
    expect(sampleRubikSequence(0).phase).toBe("scrambled");
    for (let i=0;i<9;i++) {
      const mid=sampleRubikSequence(RUBIK_SCRAMBLED_HOLD+i*RUBIK_TURN_INTERVAL+RUBIK_TURN_SECONDS/2);
      expect(mid.move).toEqual(RUBIK_SOLUTION[i]);
      expect(mid.fraction).toBeCloseTo(.5);
      const gap=sampleRubikSequence(RUBIK_SCRAMBLED_HOLD+i*RUBIK_TURN_INTERVAL+RUBIK_TURN_SECONDS+.1);
      expect(gap.stateIndex).toBe(i+1);
      expect(gap.move).toBeNull();
    }
    expect(sampleRubikSequence(RUBIK_SOLVE_END+.1)).toMatchObject({phase:"aligned",completed:9,stateIndex:9});
    expect(sampleRubikSequence(0,true)).toMatchObject({phase:"aligned",completed:9,stateIndex:9});
  });
});
