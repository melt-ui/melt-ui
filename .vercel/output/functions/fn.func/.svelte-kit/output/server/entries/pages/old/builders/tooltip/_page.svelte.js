import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateTooltipArgs",
  description: "The configuration object passed to the `createTooltip` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig"
    },
    {
      label: "arrowSize",
      type: "number",
      default: 8
    },
    {
      label: "open",
      type: "boolean",
      default: false
    },
    {
      label: "closeOnPointerDown",
      type: "boolean",
      default: true
    },
    {
      label: "openDelay",
      type: "number",
      default: 1e3
    },
    {
      label: "closeDelay",
      type: "number",
      default: 500
    }
  ]
};
const trigger = {
  title: "Trigger",
  description: "The tooltip trigger element.",
  dataAttributes: [
    {
      label: "data-state",
      value: ["'open'", "'closed'"]
    }
  ]
};
const arrow = {
  title: "Arrow",
  description: "The tooltip arrow element.",
  dataAttributes: [
    {
      label: "data-arrow",
      value: "true"
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "Opens/closes the tooltip without delay."
    },
    {
      key: "Space",
      description: "If open, closes the tooltip without delay."
    },
    {
      key: "Enter",
      description: "If open, closes the tooltip without delay."
    },
    {
      key: "Escape",
      description: "If open, closes the tooltip without delay."
    }
  ]
};
const schemas = {
  builder,
  trigger,
  arrow,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Opens when the trigger is focused or hovered",
    "Closes when the trigger is activated or with escape",
    "Custom delay for opening and closing",
    "Supports custom positioning"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Tooltip`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A popup that displays information related to an element when the element receives keyboard focus
	or the mouse hovers over it.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The element that triggers the tooltip popover`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-tk2yx7">Content:</b> The tooltip&#39;s content container`;
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
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"
        },
        {},
        {
          default: () => {
            return `Tooltip WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
