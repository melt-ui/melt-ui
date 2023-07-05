import { e as effect, b as builder } from "./builder.js";
import { a as isBrowser } from "./is.js";
import { s as styleToString } from "./style.js";
import { w as writable } from "./index2.js";
const defaults = {
  src: ""
};
const createAvatar = (args = defaults) => {
  const withDefaults = { ...defaults, ...args };
  const { delayMs } = withDefaults;
  const src = writable(withDefaults.src);
  const loadingStatus = writable("loading");
  effect([src], ([$src]) => {
    if (isBrowser) {
      const image2 = new Image();
      image2.src = $src;
      image2.onload = () => {
        if (delayMs !== void 0) {
          const timerId = window.setTimeout(() => {
            loadingStatus.set("loaded");
          }, delayMs);
          return () => window.clearTimeout(timerId);
        } else {
          loadingStatus.set("loaded");
        }
      };
      image2.onerror = () => {
        loadingStatus.set("error");
      };
    }
  });
  const image = builder("avatar-image", {
    stores: [src, loadingStatus],
    returned: ([$src, $loadingStatus]) => {
      const imageStyles = styleToString({
        display: $loadingStatus === "loaded" ? "block" : "none"
      });
      return {
        src: $src,
        style: imageStyles
      };
    }
  });
  const fallback = builder("avatar-fallback", {
    stores: [loadingStatus],
    returned: ([$loadingStatus]) => {
      const fallbackStyles = styleToString({
        display: $loadingStatus === "loaded" ? "none" : "block"
      });
      return {
        style: fallbackStyles
      };
    }
  });
  return {
    image,
    fallback
  };
};
export {
  createAvatar as c
};
