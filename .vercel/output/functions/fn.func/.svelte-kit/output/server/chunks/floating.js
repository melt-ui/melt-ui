import { flip, offset, shift, arrow, size, autoUpdate, computePosition } from "@floating-ui/dom";
import { n as noop } from "./callbacks.js";
const defaultConfig = {
  strategy: "absolute",
  placement: "top",
  gutter: 5,
  flip: true,
  sameWidth: false,
  overflowPadding: 8
};
const ARROW_TRANSFORM = {
  bottom: "rotate(45deg)",
  left: "rotate(135deg)",
  top: "rotate(225deg)",
  right: "rotate(315deg)"
};
function useFloating(reference, floating, opts = {}) {
  if (!floating || !reference)
    return {
      destroy: noop
    };
  const options = { ...defaultConfig, ...opts };
  const arrowEl = floating.querySelector("[data-arrow=true]");
  const middleware = [];
  if (options.flip) {
    middleware.push(
      flip({
        boundary: options.boundary,
        padding: options.overflowPadding
      })
    );
  }
  const arrowOffset = arrowEl ? arrowEl.offsetHeight / 2 : 0;
  if (options.gutter || options.offset) {
    const data = options.gutter ? { mainAxis: options.gutter } : options.offset;
    if (data?.mainAxis != null) {
      data.mainAxis += arrowOffset;
    }
    middleware.push(offset(data));
  }
  middleware.push(
    shift({
      boundary: options.boundary,
      crossAxis: options.overlap,
      padding: options.overflowPadding
    })
  );
  if (arrowEl) {
    middleware.push(arrow({ element: arrowEl, padding: 8 }));
  }
  middleware.push(
    size({
      padding: options.overflowPadding,
      apply({ rects, availableHeight, availableWidth }) {
        if (options.sameWidth) {
          Object.assign(floating.style, {
            width: `${Math.round(rects.reference.width)}px`,
            minWidth: "unset"
          });
        }
        if (options.fitViewport) {
          Object.assign(floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`
          });
        }
      }
    })
  );
  function compute() {
    if (!reference || !floating)
      return;
    const { placement, strategy } = options;
    computePosition(reference, floating, {
      placement,
      middleware,
      strategy
    }).then((data) => {
      const x = Math.round(data.x);
      const y = Math.round(data.y);
      Object.assign(floating.style, {
        top: `${y}px`,
        left: `${x}px`
      });
      if (arrowEl && data.middlewareData.arrow) {
        const { x: x2, y: y2 } = data.middlewareData.arrow;
        const dir = data.placement.split("-")[0];
        Object.assign(arrowEl.style, {
          position: "absolute",
          left: x2 != null ? `${x2}px` : "",
          top: y2 != null ? `${y2}px` : "",
          [dir]: `calc(100% - ${arrowOffset}px)`,
          transform: ARROW_TRANSFORM[dir],
          backgroundColor: "inherit",
          zIndex: "inherit"
        });
      }
      return data;
    });
  }
  Object.assign(floating.style, {
    position: options.strategy
  });
  return {
    destroy: autoUpdate(reference, floating, compute)
  };
}
export {
  useFloating as u
};
