function diagonalDifference(matrix) {
  const n = matrix.length;
  let primaryDiagonal = 0;
  let secondaryDiagonal = 0;
  for (let i = 0; i < n; i++) {
    primaryDiagonal += matrix[i][i];
    secondaryDiagonal += matrix[i][n - 1 - i];
  }
  return primaryDiagonal - secondaryDiagonal;
}

const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
const result = diagonalDifference(matrix);
console.log("Matrix:");
for (const row of matrix) {
  console.log(`  ${JSON.stringify(row)}`);
}
console.log(`Diagonal difference: ${result}`);
