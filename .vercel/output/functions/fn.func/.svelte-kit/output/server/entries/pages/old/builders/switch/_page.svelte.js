import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const disable = `<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte';

	const { root, input, checked, isChecked, options } = createSwitch({
		disabled: true,
	});
	// or
	options.update((prev) => ({ ...prev, disabled: true }));
<\/script>
`;
const controlled = `<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte';

	export let checked = true;
	export let disabled = false;

	const { checked: checkedStore, options } = createSwitch({
		disabled,
		checked,
	});

	$: checkedStore.set(checked);
	checkedStore.subscribe((v) => (checked = v));
	$: options.update((o) => ({ ...o, disabled }));
<\/script>
`;
const snippets = {
  disable,
  controlled
};
const builder = {
  title: "CreateSwitchArgs",
  description: "The configuration object passed to the `createSwitch` builder function.",
  args: [
    {
      label: "checked",
      type: "boolean",
      default: "false"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    },
    {
      label: "required",
      type: "boolean",
      default: "false"
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
const root = {
  title: "Root",
  description: "The switch component.",
  dataAttributes: [
    {
      label: "data-disabled",
      value: "Present if the switch is disabled."
    },
    {
      label: "data-state",
      value: ['"checked"', '"unchecked"']
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When the switch has focus, toggles the switch."
    },
    {
      key: "Enter",
      description: "When the switch has focus, toggles the switch."
    }
  ]
};
const schemas = {
  builder,
  keyboard,
  root
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = ["Full keyboard navigation", "Can be controlled or uncontrolled"];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Switch`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A control that allows the user to toggle between checked and not checked.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the accordion`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1elel2u">Input:</b> The native HTML input that is visually hidden`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create a switch, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createSwitch`;
        }
      })} builder function. You can then reference
	the anatomy or example above to create your switch.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Disabling the switch`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To disable the switch, set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `disabled`;
        }
      })} argument as ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `true`;
        }
      })}.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.disable }, {}, {})} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Controlled access`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To programatically control the switch, you can directly set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `checked`;
        }
      })} store.
	You can also update the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `options`;
        }
      })} store with new arguments.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.controlled }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
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
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/"
        },
        {},
        {
          default: () => {
            return `Switch WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
