import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateTabsArgs",
  description: "The configuration object passed to the `createTabs` builder function.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "onChange",
      type: "(value: string) => void"
    },
    {
      label: "activateOnFocus",
      type: "boolean",
      default: true
    },
    {
      label: "loop",
      type: "boolean",
      default: true
    },
    {
      label: "orientation",
      type: ['"horizontal"', '"vertical"'],
      default: '"horizontal"'
    },
    {
      label: "autoSet",
      type: "boolean",
      default: true
    }
  ]
};
const root = {
  title: "Root",
  description: "The tabs component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-melt-part",
      value: "`tabs-root`"
    }
  ]
};
const list = {
  title: "List",
  description: "The tabs list component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    }
  ]
};
const trigger = {
  title: "Trigger",
  description: "The element which opens a given tab.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "data-state",
      value: ['"active"', '"inactive"']
    },
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-disabled",
      value: "Present if disabled"
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "When focus moves onto the tabs, focuses the active trigger. When a trigger is focused, moves focus to the active content."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "ArrowUp",
      description: "Moves focus to the preview trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the preview trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "Home",
      description: "Moves focus to the first trigger depending & activates the corresponding content."
    },
    {
      key: "End",
      description: "Moves focus to the last trigger depending & activates the corresponding content."
    }
  ]
};
const schemas = {
  builder,
  root,
  list,
  trigger,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Full keyboard navigation",
    "Can be controlled or uncontrolled",
    "Supports horizontal and vertical orientation"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Tabs`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A set of layered sections of content—known as tab panels—that are displayed one at a time.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the tab component`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-fbhn26">List:</b> The container for the tab triggers`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The button(s) that open/close the tab panels`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-tk2yx7">Content:</b> The container for the tab panels`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.root }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.list }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.trigger }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/"
        },
        {},
        {
          default: () => {
            return `Tabs WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
