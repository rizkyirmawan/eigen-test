function longestWord(sentence: string): string {
  const words = sentence.split(' ');
  let longest = '';
  for (const word of words) {
    if (word.length > longest.length) {
      longest = word;
    }
  }
  return longest;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
const result = longestWord(sentence);
console.log(`Sentence: "${sentence}"`);
console.log(`Longest word: "${result}" (${result.length} characters)`);
