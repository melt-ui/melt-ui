import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateCollapsibleArgs",
  description: "The configuration object passed to the `createCollapsible` builder function.",
  args: [
    {
      label: "open",
      type: "boolean",
      default: "false"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Activates the trigger and toggles the visibility of the collapsible content"
    },
    {
      key: "Enter",
      description: "Activates the trigger and toggles the visibility of the collapsible content"
    }
  ]
};
const schemas = {
  builder,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Full keyboard navigation",
    "Svelte transition support",
    "Can be controlled or uncontrolled"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Collapsible`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `An interactive component which expands/collapses a panel.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview, { fullwidth: true }), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the collapsible`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The trigger for the collapsible`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-tk2yx7">Content:</b> The content area that is revealed when the trigger is clicked`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
        },
        {},
        {
          default: () => {
            return `Disclosure WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
