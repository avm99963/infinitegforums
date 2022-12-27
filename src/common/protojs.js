// Function which converts a protobuf array into an array which can be accessed
// as if it was a protobuf object (with the same keys). If the input is not an
// array it returns itself (since it is called recursively).
export function correctArrayKeys(input) {
  if (!Array.isArray(input)) return input;

  let object = [];
  for (let i = 0; i < input.length; ++i) {
    if (input[i] === null) continue;
    object[i + 1] = correctArrayKeys(input[i]);
  }
  return object;
}

// The inverse function.
export function inverseCorrectArrayKeys(input) {
  if (Array.isArray(input)) {
    if (input[0] === null || input[0] === undefined) {
      // Make a copy of the input array so we don't modify the original one.
      input = Array.from(input);
      input.shift();
    }
    for (let i = 0; i < input.length; ++i) {
      input[i] = inverseCorrectArrayKeys(input[i]);
    }
    return input;
  }

  if (typeof input !== 'object' || input === null) return input;

  let array = [];
  Object.entries(input).forEach(entry => {
    array[entry[0] - 1] = inverseCorrectArrayKeys(entry[1]);
  });
  return array;
}
