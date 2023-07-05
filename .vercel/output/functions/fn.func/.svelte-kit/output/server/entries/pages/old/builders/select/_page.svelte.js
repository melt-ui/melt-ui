import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateSelectArgs",
  description: "The configuration object passed to the `createSelect` builder function.",
  args: [
    {
      label: "required",
      type: "boolean",
      default: false
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "label",
      type: "string"
    },
    {
      label: "value",
      type: "unknown"
    },
    {
      label: "name",
      type: "string"
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    },
    {
      label: "loop",
      type: "boolean",
      default: false
    }
  ]
};
const trigger = {
  title: "Trigger",
  description: "The element which opens/closes the select.",
  dataAttributes: [
    {
      label: "data-state",
      value: ['"open"', '"closed"']
    },
    {
      label: "data-disabled",
      value: "Present if the `select` element is disabled."
    }
  ]
};
const option = {
  title: "Option",
  description: "The option elements",
  args: [
    {
      label: "label",
      type: "string"
    },
    {
      label: "value",
      type: "unknown"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ]
};
const arrow = {
  title: "Arrow",
  description: "The optional arrow element",
  dataAttributes: [
    {
      label: "data-arrow",
      value: ['"true"']
    }
  ]
};
const separator = {
  title: "Separator",
  description: "An optional separator element"
};
const group = {
  title: "createGroup",
  description: "An optional builder used to group options together."
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option."
    },
    {
      key: "Enter",
      description: "When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option."
    },
    {
      key: "ArrowDown",
      description: "When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the next option."
    },
    {
      key: "ArrowUp",
      description: "When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the previous option."
    },
    {
      key: "Esc",
      description: "Closes the select and moves focus to the `trigger`."
    }
  ]
};
const schemas = {
  builder,
  trigger,
  option,
  arrow,
  group,
  separator,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Full keyboard navigation",
    "Can be controlled or uncontrolled",
    "Typeahead support",
    "Optional arrow component",
    "Custom positioning"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Select`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `Presents a selection of choices to the user, activated by a button.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The button that opens/closes the select menu`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-fgsx7z">Menu:</b> The popover select menu`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1uo5bfd">Option:</b> The individual select options`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1qgzk9j">Arrow:</b> An optional arrow component`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.trigger }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.option }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.group }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.separator }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
        },
        {},
        {
          default: () => {
            return `ListBox WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
