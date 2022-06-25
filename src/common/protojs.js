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
