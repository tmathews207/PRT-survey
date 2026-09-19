/** Random 6-digit respondent number (100000-999999). Not sequential, so submission order can't be inferred. */
export function generateRespondentNumber(): number {
  const range = 900000;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return 100000 + (array[0] % range);
}
