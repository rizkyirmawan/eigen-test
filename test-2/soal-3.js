function countOccurrences(input, query) {
  const result = [];
  for (const q of query) {
    let count = 0;
    for (const item of input) {
      if (item === q) count++;
    }
    result.push(count);
  }
  return result;
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
const OUTPUT = countOccurrences(INPUT, QUERY);

console.log(`INPUT: ${JSON.stringify(INPUT)}`);
console.log(`QUERY: ${JSON.stringify(QUERY)}`);
console.log(`OUTPUT: ${JSON.stringify(OUTPUT)}`);
