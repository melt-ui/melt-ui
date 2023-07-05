import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateToolbarArgs",
  description: "The configuration object passed to the `createToolbar` builder function.",
  args: [
    {
      label: "loop",
      type: "boolean",
      default: true
    },
    {
      label: "orientation",
      type: ["'horizontal'", "'vertical'"]
    }
  ]
};
const root = {
  title: "Root",
  description: "The root toolbar element.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-toolbar",
      value: ""
    }
  ]
};
const button = {
  title: "Button",
  description: "The toolbar button element.",
  dataAttributes: [
    {
      label: "data-melt-toolbar-item",
      value: ""
    }
  ]
};
const link = {
  title: "Link",
  description: "The toolbar link element.",
  dataAttributes: [
    {
      label: "data-melt-toolbar-item",
      value: ""
    }
  ]
};
const separator = {
  title: "Separator",
  description: "The toolbar separator element.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-toolbar-separator",
      value: ""
    }
  ]
};
const groupBuilder = {
  title: "CreateToolbarGroupArgs",
  description: "Configuration options for the `createToolbarGroup` builder.",
  args: [
    {
      label: "type",
      type: ["'single'", "'multiple'"],
      default: "'single'"
    },
    {
      label: "value",
      type: ["string", "string[]", "null"]
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ]
};
const groupRoot = {
  title: "Group Root",
  description: "The root toolbar element for a toolbar group.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-toolbar-group",
      value: ""
    }
  ]
};
const groupItem = {
  title: "Group Item",
  description: "A an item within a toolbar group.",
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
      label: "data-melt-toolbar-item",
      value: ""
    },
    {
      label: "data-disabled",
      value: "Present if the item is disabled."
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
      description: "Moves focus to the first item in the group."
    },
    {
      key: "Space",
      description: "Toggles the state of the focused item."
    },
    {
      key: "Enter",
      description: "Toggles the state of the focused item."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next item depeding on `orientation`."
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next item depeding on `orientation`."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the previous item depeding on `orientation`."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the previous item depeding on `orientation`."
    },
    {
      key: "Home",
      description: "Moves focus to the first item."
    },
    {
      key: "End",
      description: "Moves focus to the last item."
    }
  ]
};
const schemas = {
  builder,
  root,
  button,
  link,
  separator,
  groupBuilder,
  groupRoot,
  groupItem,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Full keyboard navigation",
    "Can be controlled or uncontrolled",
    "Horizontal or vertical orientation"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Toolbar`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A container for grouping a set of controls, such as buttons, toggle groups or dropdown menus.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview, { fullwidth: true }), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.root }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.button }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.link }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.groupBuilder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.groupRoot }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.groupItem }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/"
        },
        {},
        {
          default: () => {
            return `Toolbar WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
