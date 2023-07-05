const isDom = () => typeof window !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
const pt = (v) => isDom() && v.test(getPlatform());
const vn = (v) => isDom() && v.test(navigator.vendor);
const isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;
const isMac = () => pt(/^Mac/) && !isTouchDevice();
const isSafari = () => isApple() && vn(/apple/i);
const isApple = () => pt(/mac|iphone|ipad|ipod/i);
const isIos = () => isApple() && !isMac();
export {
  isIos as a,
  isSafari as i
};
