import { r as redirect, e as error } from "../../../../chunks/index.js";
import { s as slugFromPath } from "../../../../chunks/utils2.js";
const load = async (event) => {
  if (event.params.slug === "builders") {
    throw redirect(302, "/");
  }
  const modules = /* @__PURE__ */ Object.assign({ "/src/docs/content/builders/accordion.md": () => import("../../../../chunks/accordion.js"), "/src/docs/content/builders/avatar.md": () => import("../../../../chunks/avatar.js"), "/src/docs/content/builders/checkbox.md": () => import("../../../../chunks/checkbox.js"), "/src/docs/content/builders/collapsible.md": () => import("../../../../chunks/collapsible.js"), "/src/docs/content/builders/context-menu.md": () => import("../../../../chunks/context-menu.js"), "/src/docs/content/builders/dialog.md": () => import("../../../../chunks/dialog.js"), "/src/docs/content/builders/dropdown-menu.md": () => import("../../../../chunks/dropdown-menu.js"), "/src/docs/content/builders/hover-card.md": () => import("../../../../chunks/hover-card.js"), "/src/docs/content/builders/label.md": () => import("../../../../chunks/label.js"), "/src/docs/content/builders/menubar.md": () => import("../../../../chunks/menubar.js"), "/src/docs/content/builders/pagination.md": () => import("../../../../chunks/pagination.js"), "/src/docs/content/builders/popover.md": () => import("../../../../chunks/popover.js"), "/src/docs/content/builders/progress.md": () => import("../../../../chunks/progress.js"), "/src/docs/content/builders/radio-group.md": () => import("../../../../chunks/radio-group.js"), "/src/docs/content/builders/select.md": () => import("../../../../chunks/select.js"), "/src/docs/content/builders/separator.md": () => import("../../../../chunks/separator.js"), "/src/docs/content/builders/slider.md": () => import("../../../../chunks/slider.js"), "/src/docs/content/builders/switch.md": () => import("../../../../chunks/switch.js"), "/src/docs/content/builders/tabs.md": () => import("../../../../chunks/tabs.js"), "/src/docs/content/builders/tags-input.md": () => import("../../../../chunks/tags-input.js"), "/src/docs/content/builders/toggle-group.md": () => import("../../../../chunks/toggle-group.js"), "/src/docs/content/builders/toggle.md": () => import("../../../../chunks/toggle.js"), "/src/docs/content/builders/toolbar.md": () => import("../../../../chunks/toolbar.js"), "/src/docs/content/builders/tooltip.md": () => import("../../../../chunks/tooltip.js"), "/src/docs/content/getting-started.md": () => import("../../../../chunks/getting-started.js"), "/src/docs/content/introduction.md": () => import("../../../../chunks/introduction.js") });
  let match = {};
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromPath(path) === event.params.slug) {
      match = { path, resolver };
      break;
    }
  }
  const doc = await match?.resolver?.();
  if (!doc || !doc.metadata) {
    throw error(404);
  }
  return {
    component: doc.default,
    metadata: doc.metadata,
    title: doc.metadata.title
  };
};
export {
  load
};
