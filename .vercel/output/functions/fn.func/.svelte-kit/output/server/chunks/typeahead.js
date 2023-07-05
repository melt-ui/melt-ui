import { w as writable } from "./index2.js";
import { h as handleRovingFocus } from "./rovingFocus.js";
import { b as isHTMLElement } from "./is.js";
import { w as wrapArray } from "./array.js";
import { g as get_store_value } from "./utils.js";
function debounce(fn, wait = 500) {
  let timeout = null;
  return function(...args) {
    const later = () => {
      timeout = null;
      fn(...args);
    };
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
const defaults = {
  onMatch: handleRovingFocus
};
function createTypeaheadSearch(args = {}) {
  const withDefaults = { ...defaults, ...args };
  const typed = writable([]);
  const resetTyped = debounce(() => {
    typed.update(() => []);
  });
  const handleTypeaheadSearch = (key, items) => {
    const currentItem = document.activeElement;
    const $typed = get_store_value(typed);
    if (!Array.isArray($typed)) {
      return;
    }
    $typed.push(key.toLowerCase());
    typed.update(() => $typed);
    const candidateItems = items.filter((item) => {
      if (item.hasAttribute("disabled")) {
        return false;
      }
      if (item.hasAttribute("data-disabled")) {
        return false;
      }
      return true;
    });
    const isRepeated = $typed.length > 1 && $typed.every((char) => char === $typed[0]);
    const normalizeSearch = isRepeated ? $typed[0] : $typed.join("");
    const currentItemIndex = currentItem ? candidateItems.indexOf(currentItem) : -1;
    let wrappedItems = wrapArray(candidateItems, Math.max(currentItemIndex, 0));
    const excludeCurrentItem = normalizeSearch.length === 1;
    if (excludeCurrentItem) {
      wrappedItems = wrappedItems.filter((v) => v !== currentItem);
    }
    const nextItem = wrappedItems.find(
      (item) => item.innerText.toLowerCase().startsWith(normalizeSearch.toLowerCase())
    );
    if (isHTMLElement(nextItem) && nextItem !== currentItem) {
      withDefaults.onMatch(nextItem);
    }
    resetTyped();
  };
  return {
    typed,
    resetTyped,
    handleTypeaheadSearch
  };
}
export {
  createTypeaheadSearch as c
};
