import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateCheckboxArgs",
  description: "The configuration object passed to the `createCheckbox` builder function.",
  args: [
    {
      label: "checked",
      type: 'boolean | "indeterminate"',
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
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Toggles the checkbox state."
    }
  ]
};
const schemas = {
  builder,
  keyboard
};
const disable = `<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';

	const { root, input, isChecked, isIndeterminate, checked, options } = createCheckbox({
		disabled: true,
	});
	// or
	options.update((prev) => ({ ...prev, disabled: true }));
<\/script>
`;
const indeterminate = `<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';

	const { root, input, isChecked, isIndeterminate, checked } = createCheckbox({
		checked: 'indeterminate',
	});
	// or
	checked.set('indeterminate');
<\/script>
`;
const controlled = `<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';

	export let checked: boolean | 'indeterminate' = true;
	export let disabled = false;

	const { checked: checkedStore, options } = createCheckbox({
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
  controlled,
  indeterminate
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Supports indeterminate state",
    "Full keyboard navigation",
    "Can be controlled or uncontrolled"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Checkbox`;
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
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the checkbox`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1elel2u">Input:</b> The native html input that is visually hidden.`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create a checkbox, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createCheckbox`;
        }
      })} builder function. Follow the anatomy
	or the example above to create your checkbox.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Indeterminate state`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create an indeterminate checkbox, set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `checked`;
        }
      })} argument as
	${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `indeterminate`;
        }
      })}.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.indeterminate }, {}, {})} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Disabling the checkbox`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To disable the checkbox, set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `disabled`;
        }
      })} argument as
	${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
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
      return `To programatically control the checkbox, you can directly set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
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
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/"
        },
        {},
        {
          default: () => {
            return `tri-state Checkbox WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
