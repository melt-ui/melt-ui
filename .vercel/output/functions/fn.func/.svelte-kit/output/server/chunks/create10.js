import { d as derived, w as writable } from "./index2.js";
const defaults = {
  max: 100
};
const createProgress = (args = defaults) => {
  const withDefaults = { ...defaults, ...args };
  const value = writable(withDefaults.value ?? null);
  const max = writable(withDefaults.max);
  const root = derived([value, max], ([$value, $max]) => {
    return {
      value: $value,
      max: $max,
      role: "meter",
      "aria-valuemin": 0,
      "aria-valuemax": $max,
      "aria-valuenow": $value,
      "data-value": $value,
      "data-state": $value === null ? "indeterminate" : $value === $max ? "complete" : "loading",
      "data-max": $max
    };
  });
  return {
    value,
    max,
    root,
    progress: root
  };
};
export {
  createProgress as c
};
