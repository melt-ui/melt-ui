function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export {
  sleep as s
};
