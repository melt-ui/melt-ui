import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateProgressArgs",
  description: "The configuration object passed to the `createProgress` builder function.",
  args: [
    {
      label: "value",
      type: "number"
    },
    {
      label: "max",
      type: "number",
      default: 100
    }
  ]
};
const root = {
  title: "Progress",
  description: "The progress component.",
  dataAttributes: [
    {
      label: "data-value",
      value: "The current value of the progress bar."
    },
    {
      label: "data-state",
      value: ['"indeterminate"', '"complete"', '"loading"']
    },
    {
      label: "data-max",
      value: "The maximum value of the progress bar."
    }
  ]
};
const schemas = {
  builder,
  root
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = ["Assistive reading technology support for progress bar"];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Progress`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `Displays an indicator showing the completion progress of a task, typically displayed as a progress
	bar.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-9rhdaf">Progress:</b> The progress component.`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create an progress bar component, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createProgress`;
        }
      })} builder function.
	Follow the anatomy or the example above to create your progress bar.`;
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
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/meter/"
        },
        {},
        {
          default: () => {
            return `Meter WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })}`;
});
export {
  Page as default
};
