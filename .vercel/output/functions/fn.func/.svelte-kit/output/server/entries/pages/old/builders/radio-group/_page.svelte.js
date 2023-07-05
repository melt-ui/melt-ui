import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateRadioGroupArgs",
  description: "The configuration object passed to the `createRadioGroup` builder function.",
  args: [
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "loop",
      type: "boolean",
      default: true
    },
    {
      label: "required",
      type: "boolean",
      default: false
    },
    {
      label: "orientation",
      type: ['"horizontal"', '"vertical"'],
      default: '"vertical"'
    },
    {
      label: "value",
      type: "string"
    }
  ]
};
const root = {
  title: "Root",
  description: "The radio group component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-melt-part",
      value: "`radio-group`"
    }
  ]
};
const item = {
  title: "Item",
  description: "The radio group item components.",
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
      label: "data-disabled",
      value: "Present if the item is disabled."
    },
    {
      label: "data-state",
      value: ['"checked"', '"unchecked"']
    },
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-melt-part",
      value: "`radio-group-item`"
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "Moves focus to either the checked radio item or the first radio item."
    },
    {
      key: "Space",
      description: "When focused on an unchecked item, checks it."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to & checks the next radio item"
    },
    {
      key: "ArrowRight",
      description: "Moves focus to & checks the next radio item"
    },
    {
      key: "ArrowUp",
      description: "Moves focus to & checks the previous radio item"
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to & checks the previous radio item"
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
    "Full keyboard navigation",
    "Can be controlled or uncontrolled",
    "Supports horizontal and vertical orientation"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Radio Group`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A set of checkable buttons — known as radio buttons — where no more than one of the buttons can
	be checked at a time.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the radio group`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1je5gc7">Item:</b> The individual radio button items`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.root }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.item }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/"
        },
        {},
        {
          default: () => {
            return `Radio Group WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
