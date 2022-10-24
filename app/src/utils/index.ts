export * from './tasks';

export const transposeMatrix = <T>(matrix: T[][]): T[][] => {
  const allRowsHaveSameLength = matrix
    .map((row) => row.length)
    .every((length, _, rowLengths) => length === rowLengths[0]);

  if (!allRowsHaveSameLength) {
    throw new Error('All rows must have the same length');
  }

  const result = matrix[0].map((_, i) => matrix.map((row) => row[i]));
  return result;
};
