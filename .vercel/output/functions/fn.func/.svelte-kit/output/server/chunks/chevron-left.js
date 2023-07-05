import { g as get_store_value } from "./utils.js";
import { w as writable, d as derived } from "./index2.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks } from "./callbacks.js";
import { c as create_ssr_component, a as spread, e as escape_object } from "./ssr.js";
function getPageItems({
  page = 1,
  totalPages,
  siblingCount = 1
}) {
  const pageItems = [];
  const pagesToShow = /* @__PURE__ */ new Set([1, totalPages]);
  const firstItemWithSiblings = 3 + siblingCount;
  const lastItemWithSiblings = totalPages - 2 - siblingCount;
  if (firstItemWithSiblings > lastItemWithSiblings) {
    for (let p = 2; p <= totalPages - 1; p++) {
      pagesToShow.add(p);
    }
  } else if (page < firstItemWithSiblings) {
    for (let p = 2; p <= Math.min(firstItemWithSiblings, totalPages); p++) {
      pagesToShow.add(p);
    }
  } else if (page > lastItemWithSiblings) {
    for (let p = totalPages - 1; p >= Math.max(lastItemWithSiblings, 2); p--) {
      pagesToShow.add(p);
    }
  } else {
    for (let p = Math.max(page - siblingCount, 2); p <= Math.min(page + siblingCount, totalPages); p++) {
      pagesToShow.add(p);
    }
  }
  const addPage = (value) => {
    pageItems.push({ type: "page", value, key: `page-${value}` });
  };
  const addEllipsis = () => {
    pageItems.push({ type: "ellipsis", key: `ellipsis-${pageItems.length}` });
  };
  let lastNumber = 0;
  for (const page2 of Array.from(pagesToShow).sort((a, b) => a - b)) {
    if (page2 - lastNumber > 1) {
      addEllipsis();
    }
    addPage(page2);
    lastNumber = page2;
  }
  return pageItems;
}
const defaults = {
  perPage: 1,
  siblingCount: 1,
  page: 1
};
function createPagination(args) {
  const withDefaults = { ...defaults, ...args };
  const options = writable(omit(withDefaults, "page"));
  const page = writable(withDefaults.page);
  const totalPages = derived([options], ([$options]) => {
    return Math.ceil($options.count / $options.perPage);
  });
  const range = derived([page, options], ([$page, $options]) => {
    const start = ($page - 1) * $options.perPage;
    const end = Math.min(start + $options.perPage, $options.count);
    return { start, end };
  });
  const root = {
    "data-scope": "pagination"
  };
  const pages = derived([page, totalPages, options], ([$page, $totalPages, { siblingCount }]) => {
    return getPageItems({ page: $page, totalPages: $totalPages, siblingCount });
  });
  const keydown = (e) => {
    const thisEl = e.target;
    const rootEl = thisEl.closest('[data-scope="pagination"]');
    if (!rootEl)
      return;
    const triggers = Array.from(
      rootEl.querySelectorAll('[data-melt-part="page-trigger"]')
    );
    const prevButton2 = rootEl.querySelector(
      '[data-melt-part="page-prev-button"]'
    );
    const nextButton2 = rootEl.querySelector(
      '[data-melt-part="page-next-button"]'
    );
    const elements = [...triggers];
    if (prevButton2)
      elements.unshift(prevButton2);
    if (nextButton2)
      elements.push(nextButton2);
    const index = Array.from(elements).indexOf(thisEl);
    if (e.key === kbd.ARROW_LEFT && index !== 0) {
      e.preventDefault();
      elements[index - 1].focus();
    } else if (e.key === kbd.ARROW_RIGHT && index !== elements.length - 1) {
      e.preventDefault();
      elements[index + 1].focus();
    } else if (e.key === kbd.HOME) {
      e.preventDefault();
      elements[0].focus();
    } else if (e.key === kbd.END) {
      e.preventDefault();
      elements[elements.length - 1].focus();
    }
  };
  const pageTrigger = {
    ...derived(page, ($page) => {
      return (pageItem) => {
        return {
          "aria-label": `Page ${pageItem.value}`,
          "data-value": pageItem.value,
          "data-selected": pageItem.value === $page ? "" : void 0,
          "data-melt-part": "page-trigger"
        };
      };
    }),
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "click", () => {
          const value = node.dataset.value;
          if (!value || Number.isNaN(+value))
            return;
          page.set(Number(value));
        }),
        addEventListener(node, "keydown", keydown)
      );
      return {
        destroy: unsub
      };
    }
  };
  const prevButton = {
    ...derived([page], ([$page]) => {
      return {
        "aria-label": "Previous",
        disabled: $page <= 1,
        "data-melt-part": "page-prev-button"
      };
    }),
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "click", () => {
          page.update((p) => Math.max(p - 1, 1));
        }),
        addEventListener(node, "keydown", keydown)
      );
      return {
        destroy: unsub
      };
    }
  };
  const nextButton = {
    ...derived([page, totalPages], ([$page, $numPages]) => {
      return {
        "aria-label": "Next",
        disabled: $page >= $numPages,
        "data-melt-part": "page-next-button"
      };
    }),
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "click", () => {
          const $totalPages = get_store_value(totalPages);
          page.update((p) => Math.min(p + 1, $totalPages));
        }),
        addEventListener(node, "keydown", keydown)
      );
      return {
        destroy: unsub
      };
    }
  };
  return {
    root,
    options,
    page,
    pages,
    pageTrigger,
    prevButton,
    nextButton,
    totalPages,
    range
  };
}
const Chevron_left = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 18l-6-6l6-6"/>`}<!-- HTML_TAG_END --></svg>`;
});
export {
  Chevron_left as C,
  createPagination as c
};
