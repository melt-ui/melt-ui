import { a as isBrowser, b as isHTMLElement } from "./is.js";
import { s as sleep } from "./sleep.js";
function handleRovingFocus(nextElement) {
  if (!isBrowser)
    return;
  const currentFocusedElement = document.activeElement;
  if (!isHTMLElement(currentFocusedElement))
    return;
  if (currentFocusedElement === nextElement)
    return;
  currentFocusedElement.tabIndex = -1;
  nextElement.tabIndex = 0;
  sleep(1).then(() => nextElement.focus());
}
function getFocusableElements() {
  return Array.from(
    document.querySelectorAll(
      'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
    )
  );
}
function getNextFocusable(currentElement) {
  const focusableElements = getFocusableElements();
  const currentIndex = focusableElements.indexOf(currentElement);
  const nextIndex = currentIndex + 1;
  return nextIndex < focusableElements.length ? focusableElements[nextIndex] : null;
}
function getPreviousFocusable(currentElement) {
  const focusableElements = getFocusableElements();
  const currentIndex = focusableElements.indexOf(currentElement);
  const previousIndex = currentIndex - 1;
  return previousIndex >= 0 ? focusableElements[previousIndex] : null;
}
export {
  getPreviousFocusable as a,
  getNextFocusable as g,
  handleRovingFocus as h
};
