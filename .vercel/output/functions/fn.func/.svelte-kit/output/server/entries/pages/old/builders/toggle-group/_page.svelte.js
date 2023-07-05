import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateToggleGroupArgs",
  description: "The configuration object passed to the `createToggleGroup` builder function.",
  args: [
    {
      label: "type",
      type: ["'single'", "'multiple'"],
      default: "'single'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "value",
      type: ["'string'", "string[]", "null"],
      default: "null"
    },
    {
      label: "rovingFocus",
      type: "boolean",
      default: true
    },
    {
      label: "orientation",
      type: ["'horizontal'", "'vertical'"],
      default: "'horizontal'"
    },
    {
      label: "loop",
      type: "boolean",
      default: true
    }
  ]
};
const root = {
  title: "Root",
  description: "The root toggle group element.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-part",
      value: "`toggle-group`"
    }
  ]
};
const item = {
  title: "Item",
  description: "The toggle group item element.",
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
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-part",
      value: "`toggle-group-item`"
    },
    {
      label: "data-state",
      value: ["'on'", "'off'"]
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "Moves focus to either the pressed item or the first item in the group."
    },
    {
      key: "Space",
      description: "Activates/deactivates the item."
    },
    {
      key: "Enter",
      description: "Activates/deactivates the item."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next item in the group."
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next item in the group."
    },
    {
      key: "ArrowUp",
      description: "Moves focus to the previous item in the group."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the previous item in the group."
    },
    {
      key: "Home",
      description: "Moves focus to the first item in the group."
    },
    {
      key: "End",
      description: "Moves focus to the last item in the group."
    }
  ]
};
const schemas = {
  builder,
  root,
  item,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Horizontal or vertical orientation",
    "Can be controlled or uncontrolled",
    "Full keyboard navigation"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Toggle Group`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A set of two-state buttons that can be toggled on or off.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The toggle group container component`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1je5gc7">Item:</b> A toggle group item component`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.root }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
        },
        {},
        {
          default: () => {
            return `Button WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
