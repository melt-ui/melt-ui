import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateSliderArgs",
  description: "The configuration object passed to the `createSlider` builder function.",
  args: [
    {
      label: "value",
      type: "number[]",
      default: "[]"
    },
    {
      label: "min",
      type: "number",
      default: 0
    },
    {
      label: "max",
      type: "number",
      default: 100
    },
    {
      label: "step",
      type: "number",
      default: 1
    },
    {
      label: "orientation",
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'"
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
      key: "ArrowRight",
      description: "Increments/decrements by the `step` value depending on `orientation`."
    },
    {
      key: "ArrowLeft",
      description: "Increments/decrements by the `step` value depending on `orientation`."
    },
    {
      key: "ArrowUp",
      description: "Increases the value by the `step` amount."
    },
    {
      key: "ArrowDown",
      description: "Decreases the value by the `step` amount."
    },
    {
      key: "Home",
      description: "Sets the value to its minimum"
    },
    {
      key: "End",
      description: "Sets the value to its maximum"
    }
  ]
};
const slider = {
  title: "Slider",
  description: "The slider component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    }
  ]
};
const thumb = {
  title: "Thumb",
  description: "The slider thumb component.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`thumb`"
    }
  ]
};
const schemas = {
  builder,
  keyboard,
  slider,
  thumb
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Supports multiple thumbs",
    "Can be controlled or uncontrolled",
    "Supports a minimum value between thumbs",
    "Supports both touch and click",
    "Supports a custom step size",
    "Can be vertical or horizontal"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Slider`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `An input where the user selects a value from within a given range`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create a slider, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createSlider`;
        }
      })} builder function. Follow the anatomy
	or the example above to create your slider.`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.slider }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.thumb }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/"
        },
        {},
        {
          default: () => {
            return `Slider WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
