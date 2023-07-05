import { d as derived, w as writable } from "./index2.js";
const defaults = {
  orientation: "horizontal",
  decorative: false
};
const createSeparator = (args = defaults) => {
  const withDefaults = { ...defaults, ...args };
  const options = writable({ ...withDefaults });
  const root = derived(options, ({ orientation, decorative }) => {
    const ariaOrientation = orientation === "vertical" ? orientation : void 0;
    return {
      role: decorative ? "none" : "separator",
      "aria-orientation": ariaOrientation,
      "aria-hidden": decorative,
      "data-orientation": orientation
    };
  });
  return {
    root,
    options
  };
};
export {
  createSeparator as c
};
