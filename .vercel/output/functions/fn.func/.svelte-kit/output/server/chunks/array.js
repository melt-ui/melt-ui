function next(array, index, loop = true) {
  if (index === array.length - 1) {
    return loop ? array[0] : array[index];
  }
  return array[index + 1];
}
function prev(array, index, loop = true) {
  if (index === 0) {
    return loop ? array[array.length - 1] : array[index];
  }
  return array[index - 1];
}
function last(array) {
  return array[array.length - 1];
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
export {
  last as l,
  next as n,
  prev as p,
  wrapArray as w
};
