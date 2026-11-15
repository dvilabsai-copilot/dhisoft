// Shared face dimensions for the Tetris and Rubik hero variations.
// Bevels extend each side by 0.025: visible width 0.56, gap 0.02.
export const BUILDING_BLOCK = {
  faceSize: .51,
  spacing: .58,
  bevel: .025,
  cornerRadius: .045,
} as const;

// Gravity-valid pieces tile a six-column, eight-row board from the bottom up.
export const TETRIS_PIECES = [
  [[0,0],[1,0],[1,1],[2,0]], [[1,2],[2,1],[2,2],[2,3]],
  [[3,0],[4,0],[5,0],[5,1]], [[3,1],[3,2],[3,3],[4,1]],
  [[3,4],[4,2],[4,3],[4,4]], [[0,1],[0,2],[0,3],[1,3]],
  [[0,4],[0,5],[1,4],[2,4]], [[0,6],[0,7],[1,5],[1,6]],
  [[2,5],[2,6],[3,5],[3,6]], [[5,2],[5,3],[5,4],[5,5]],
  [[4,5],[4,6],[5,6],[5,7]], [[1,7],[2,7],[3,7],[4,7]],
] as const;
