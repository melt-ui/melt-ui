import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreatePopoverArgs",
  description: "The configuration object passed to the `createPopover` builder function.",
  args: [
    {
      label: "checked",
      type: ["boolean", '"indeterminate"'],
      default: false
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "required",
      type: "boolean",
      default: false
    },
    {
      label: "name",
      type: "string"
    },
    {
      label: "value",
      type: "string"
    }
  ]
};
const trigger = {
  title: "Trigger",
  description: "The button(s) which open/close the popover.",
  dataAttributes: [
    {
      label: "data-state",
      value: ['"open"', '"closed"']
    }
  ]
};
const arrow = {
  title: "Arrow",
  description: "The optional arrow element.",
  dataAttributes: [
    {
      label: "data-arrow",
      value: ["true"]
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Toggles the popover."
    },
    {
      key: "Enter",
      description: "Toggles the popover."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence."
    },
    {
      key: "Esc",
      description: "Closes the popover and moves focus to the trigger element."
    }
  ]
};
const schemas = {
  keyboard,
  builder,
  trigger,
  arrow
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Full keyboard navigation",
    "Customize positioning of popover",
    "Can be controlled or uncontrolled",
    "Focus is fully managed",
    "Supports an optional arrow component"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Popover`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `Displays rich content in a portal, triggered by a button.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The button(s) which open/close the popover.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-tk2yx7">Content:</b> The content area viewed when the trigger is clicked.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1qgzk9j">Arrow:</b> An optional arrow component`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-dgc5fa">Close:</b> A button which closes the popover`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create a popover, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createPopover`;
        }
      })} builder function. Follow the anatomy
	or the example above to create your popover.`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.trigger }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.arrow }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
        },
        {},
        {
          default: () => {
            return `Accordion WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
