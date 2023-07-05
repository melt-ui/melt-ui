import { h as hiddenAction } from "./builder.js";
import { a as addEventListener } from "./event.js";
function createLabel() {
  const root = hiddenAction({
    action: (node) => {
      const mouseDown = addEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    root
  };
}
export {
  createLabel as c
};
