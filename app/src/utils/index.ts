export * from './tasks';

export const transposeMatrix = (matrix: any[][]) =>
  matrix.reduce(
    (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
    []
  );
