const isBrowser = typeof document !== "undefined";
const isFunction = (v) => typeof v === "function";
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}
function isElementDisabled(element) {
  const ariaDisabled = element.getAttribute("aria-disabled");
  const disabled = element.getAttribute("disabled");
  if (ariaDisabled === "true" || disabled !== null) {
    return true;
  }
  return false;
}
function isTouch(event) {
  return event.pointerType === "touch";
}
export {
  isBrowser as a,
  isHTMLElement as b,
  isElementDisabled as c,
  isTouch as d,
  isFunction as i
};
