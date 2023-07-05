import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const anatomy = "<nav {...root}>\n    <p>Showing items {$range.start} - {$range.end}</p>\n    <div>\n        <button {...$prevButton}>Prev</button>\n        {#each $pages as page (page.key)}\n            {#if page.type === 'ellipsis'}\n                <span>...</span>\n            {:else}\n                <button {...$pageTrigger(page)}>{page.value}</button>\n            {/if}            \n        {/each}\n        <button {...$nextButton}>Next</button>\n    </div>\n</nav>";
const snippets = {
  anatomy
};
const builder = {
  title: "CreatePaginationArgs",
  description: "The configuration object passed to the `createPagination` builder function.",
  args: [
    {
      label: "count",
      type: "number"
    },
    {
      label: "perPage",
      type: "number",
      default: 1
    },
    {
      label: "siblingCount",
      type: "number",
      default: 1
    },
    {
      label: "page",
      type: "number",
      default: 1
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focused on a `pageTrigger` or `nextButton`, moves to that page."
    },
    {
      key: "Enter",
      description: "When focused on a `pageTrigger` or `nextButton`, moves to that page."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element"
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next focusable `pageTrigger` or `nextButton`."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the previous focusable `pageTrigger` or `prevButton`"
    },
    {
      key: "Home",
      description: "Moves focus to the first focusable `pageTrigger` or `prevButton`."
    },
    {
      key: "End",
      description: "Moves focus to the first focusable `pageTrigger` or `prevButton`."
    }
  ]
};
const root = {
  title: "Root",
  description: "The root element of the pagination component.",
  dataAttributes: [
    {
      label: "data-scope",
      value: "`pagination`"
    }
  ]
};
const pageTrigger = {
  title: "Page Trigger",
  description: "A button that triggers a page change.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`page-trigger`"
    },
    {
      label: "data-selected",
      value: "Present when the page is selected."
    }
  ]
};
const prevButton = {
  title: "Previous Button",
  description: "A button that moves to the previous page.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`page-prev-button`"
    }
  ]
};
const nextButton = {
  title: "Next Button",
  description: "A button that moves to the next page.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`page-next-button`"
    }
  ]
};
const schemas = {
  builder,
  keyboard,
  root,
  pageTrigger,
  prevButton,
  nextButton
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Full keyboard navigation support",
    "Supports a custom number of pages",
    "Display range of visible pages",
    "Supports a custom number of visible pages",
    "Supports a custom number of sibling pages"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Pagination`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `An interface that allows navigating between pages that contain split entries.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the pagination component`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1jkheel">Previous Button:</b> The button which navigates to the previous page`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1wpzc4f">Page Trigger:</b> The button(s) which navigates to a specific page`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1js4u59">Next Button:</b> The button which navigates to the next page`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1itxxkv">Range:</b> The range of pages that are visible to the user`;
        }
      })}`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.anatomy }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create a pagination component, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createPagination`;
        }
      })} builder function.
	Follow the anatomy or the example above to create your pagination component.`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.root }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.pageTrigger }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.nextButton }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.prevButton }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.a11ymatters.com/pattern/pagination/"
        },
        {},
        {
          default: () => {
            return `a11y Accessible Pagination guidelines`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
