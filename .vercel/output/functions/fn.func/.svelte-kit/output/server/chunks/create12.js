import { t as typedDerived, e as effect, g as getElementByMeltId } from "./builder.js";
import { a as isBrowser } from "./is.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { s as styleToString } from "./style.js";
import { g as generateId } from "./id.js";
import { k as kbd } from "./keyboard.js";
import { w as writable, d as derived } from "./index2.js";
import { g as get_store_value } from "./utils.js";
const defaults = {
  value: [],
  min: 0,
  max: 100,
  step: 1,
  orientation: "horizontal",
  disabled: false
};
const createSlider = (args = defaults) => {
  const withDefaults = { ...defaults, ...args };
  const options = writable(omit(withDefaults, "value"));
  const value = writable(withDefaults.value);
  const isActive = writable(false);
  const currentThumbIndex = writable(0);
  const activeThumb = writable(null);
  const ids = {
    root: generateId()
  };
  const root = derived(options, ($options) => {
    return {
      disabled: $options.disabled,
      "data-orientation": $options.orientation,
      style: "touch-action: none;",
      "data-melt-id": ids.root
    };
  });
  const position = derived(options, ($options) => {
    return (val) => {
      const pos = (val - $options.min) / ($options.max - $options.min) * 100;
      return Math.abs(pos);
    };
  });
  const range = derived([value, options, position], ([$value, $options, $position]) => {
    const minimum = $value.length > 1 ? $position(Math.min(...$value) ?? 0) : 0;
    const maximum = 100 - $position(Math.max(...$value) ?? 0);
    const orientationStyles = $options.orientation === "horizontal" ? { left: `${minimum}%`, right: `${maximum}%` } : { top: `${minimum}%`, bottom: `${maximum}%` };
    return {
      style: styleToString({
        position: "absolute",
        ...orientationStyles
      })
    };
  });
  const updatePosition = (val, index) => {
    value.update((prev) => {
      if (!prev)
        return [val];
      const isFirst = index === 0;
      const isLast = index === prev.length - 1;
      if (!isLast && val > prev[index + 1]) {
        prev[index] = prev[index + 1];
      } else if (!isFirst && val < prev[index - 1]) {
        prev[index] = prev[index - 1];
      } else {
        prev[index] = val;
      }
      return prev.map(Math.abs);
    });
  };
  const getAllThumbs = () => {
    const root2 = getElementByMeltId(ids.root);
    if (!root2)
      return null;
    const thumbs = Array.from(root2.querySelectorAll('[data-melt-part="thumb"]')).filter(
      Boolean
    );
    return thumbs;
  };
  const thumb = {
    ...typedDerived([value, options, position], ([$value, $options, $position]) => {
      let index = -1;
      return () => {
        index++;
        const { min: $min, max: $max, disabled: $disabled } = $options;
        const currentThumb = get_store_value(currentThumbIndex);
        if (currentThumb < $value.length) {
          currentThumbIndex.update((prev) => prev + 1);
        }
        const thumbPosition = `${$position($value[index])}%`;
        return {
          role: "slider",
          "aria-label": "Volume",
          "aria-valuemin": $min,
          "aria-valuemax": $max,
          "aria-valuenow": $value[index],
          "data-melt-part": "thumb",
          style: styleToString({
            position: "absolute",
            ...$options.orientation === "horizontal" ? { left: thumbPosition, translate: "-50% 0" } : { top: thumbPosition, translate: "0 -50%`" }
          }),
          tabindex: $disabled ? -1 : 0
        };
      };
    }),
    action: (node) => {
      const unsub = addEventListener(node, "keydown", (event) => {
        const $options = get_store_value(options);
        const $min = $options.min;
        const $max = $options.max;
        if ($options.disabled)
          return;
        const target = event.currentTarget;
        const thumbs = getAllThumbs();
        if (!thumbs?.length)
          return;
        const index = thumbs.indexOf(target);
        currentThumbIndex.set(index);
        if (![
          kbd.ARROW_LEFT,
          kbd.ARROW_RIGHT,
          kbd.ARROW_UP,
          kbd.ARROW_DOWN,
          kbd.HOME,
          kbd.END
        ].includes(event.key)) {
          return;
        }
        event.preventDefault();
        const step = $options.step;
        const $value = get_store_value(value);
        switch (event.key) {
          case kbd.HOME: {
            updatePosition($min, index);
            break;
          }
          case kbd.END: {
            updatePosition($max, index);
            break;
          }
          case kbd.ARROW_LEFT: {
            if ($value[index] > $min && $options.orientation === "horizontal") {
              const newValue = $value[index] - step;
              updatePosition(newValue, index);
            }
            break;
          }
          case kbd.ARROW_RIGHT: {
            if ($value[index] < $max && $options.orientation === "horizontal") {
              const newValue = $value[index] + step;
              updatePosition(newValue, index);
            }
            break;
          }
          case kbd.ARROW_UP: {
            if ($value[index] > $min && $options.orientation === "vertical") {
              const newValue = $value[index] - step;
              updatePosition(newValue, index);
            } else if ($value[index] < $max) {
              const newValue = $value[index] + step;
              updatePosition(newValue, index);
            }
            break;
          }
          case kbd.ARROW_DOWN: {
            if ($value[index] < $max && $options.orientation === "vertical") {
              const newValue = $value[index] + step;
              updatePosition(newValue, index);
            } else if ($value[index] > $min) {
              const newValue = $value[index] - step;
              updatePosition(newValue, index);
            }
            break;
          }
        }
      });
      return {
        destroy: unsub
      };
    }
  };
  effect([root, options], ([$root, $options]) => {
    const { min: $min, max: $max, disabled: $disabled } = $options;
    if (!isBrowser || $disabled)
      return;
    const applyPosition = (clientXY, activeThumbIdx, leftOrTop, rightOrBottom) => {
      const percent = (clientXY - leftOrTop) / (rightOrBottom - leftOrTop);
      const val = Math.round(percent * ($max - $min) + $min);
      if (val < $min || val > $max)
        return;
      const step = $options.step;
      const newValue = Math.round(val / step) * step;
      updatePosition(newValue, activeThumbIdx);
    };
    const getClosestThumb = (e) => {
      const thumbs = getAllThumbs();
      if (!thumbs)
        return;
      thumbs.forEach((thumb3) => thumb3?.blur());
      const distances = thumbs.map((thumb3) => {
        if ($options.orientation === "horizontal") {
          const { left, right } = thumb3.getBoundingClientRect();
          return Math.abs(e.clientX - (left + right) / 2);
        } else {
          const { top, bottom } = thumb3.getBoundingClientRect();
          return Math.abs(e.clientY - (top + bottom) / 2);
        }
      });
      const thumb2 = thumbs[distances.indexOf(Math.min(...distances))];
      const index = thumbs.indexOf(thumb2);
      return { thumb: thumb2, index };
    };
    const pointerDown = (e) => {
      const sliderEl = getElementByMeltId($root["data-melt-id"]);
      const closestThumb = getClosestThumb(e);
      if (!closestThumb || !sliderEl)
        return;
      if (!sliderEl.contains(e.target))
        return;
      e.preventDefault();
      activeThumb.set(closestThumb);
      closestThumb.thumb.focus();
      isActive.set(true);
      if ($options.orientation === "horizontal") {
        const { left, right } = sliderEl.getBoundingClientRect();
        applyPosition(e.clientX, closestThumb.index, left, right);
      } else {
        const { top, bottom } = sliderEl.getBoundingClientRect();
        applyPosition(e.clientY, closestThumb.index, top, bottom);
      }
    };
    const pointerUp = () => {
      isActive.set(false);
    };
    const pointerMove = (e) => {
      if (!get_store_value(isActive))
        return;
      const sliderEl = getElementByMeltId($root["data-melt-id"]);
      const closestThumb = get_store_value(activeThumb);
      if (!sliderEl || !closestThumb)
        return;
      closestThumb.thumb.focus();
      if ($options.orientation === "horizontal") {
        const { left, right } = sliderEl.getBoundingClientRect();
        applyPosition(e.clientX, closestThumb.index, left, right);
      } else {
        const { top, bottom } = sliderEl.getBoundingClientRect();
        applyPosition(e.clientY, closestThumb.index, top, bottom);
      }
    };
    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("pointerup", pointerUp);
    document.addEventListener("pointerleave", pointerUp);
    document.addEventListener("pointermove", pointerMove);
    return () => {
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("pointerup", pointerUp);
      document.removeEventListener("pointerleave", pointerUp);
      document.removeEventListener("pointermove", pointerMove);
    };
  });
  return {
    root,
    slider: root,
    range,
    thumb,
    value,
    options
  };
};
export {
  createSlider as c
};
