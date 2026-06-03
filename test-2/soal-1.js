function reverseAlphabet(str) {
  const letters = str.match(/[a-zA-Z]/g);
  const numbers = str.match(/[0-9]/g);
  const reversedLetters = letters.reverse().join('');
  return reversedLetters + (numbers ? numbers.join('') : '');
}

const input = "NEGIE1";
const output = reverseAlphabet(input);
console.log(`Input: ${input}`);
console.log(`Output: ${output}`);
