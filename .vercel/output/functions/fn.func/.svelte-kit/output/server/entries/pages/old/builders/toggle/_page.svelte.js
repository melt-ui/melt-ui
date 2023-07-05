import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateToggleArgs",
  description: "The configuration object passed to the `createToggle` builder function.",
  args: [
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "pressed",
      type: "boolean",
      default: false
    }
  ]
};
const toggle = {
  title: "Toggle",
  description: "The toggle component.",
  dataAttributes: [
    {
      label: "data-disabled",
      value: "Present if the toggle is disabled."
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
      key: "Space",
      description: "Activates/deactivates the toggle."
    },
    {
      key: "Enter",
      description: "Activates/deactivates the toggle."
    }
  ]
};
const schemas = {
  builder,
  toggle,
  keyboard
};
const disable = `<script lang="ts">
	import { createToggle } from '@melt-ui/svelte';

	const { toggle, pressed, disabled } = createToggle({
		disabled: true,
	});
	// or
	disabled.set(true);
	// or
	disabled.update((d) => !d);
<\/script>
`;
const controlled = `<script lang="ts">
	import { createToggle } from '@melt-ui/svelte';

	export let pressed = true;
	export let disabled = false;

	const { pressed: pressedStore, disabled: disabledStore } = createToggle({
		pressed,
		disabled,
	});

	$: pressedStore.set(pressed);
	pressedStore.subscribe((v) => (pressed = v));

	$: disabledStore.set(pressed);
	disabledStore.subscribe((v) => (disabled = v));
<\/script>
`;
const snippets = {
  disable,
  controlled
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = ["Full keyboard navigation", "Can be controlled or uncontrolled"];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Toggle`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A two-state button that can be either on or off.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1ondk6q">Toggle:</b> The toggle component`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create a toggle, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createToggle`;
        }
      })} builder function. Follow the anatomy
	or the example above to create your toggle.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Disabling the toggle`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To disable a the toggle,, set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
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
      return `To programmatically control the Toggle, you can directly set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `pressed`;
        }
      })} store.
	you can also directly set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `disabled`;
        }
      })} store.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.controlled }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.toggle }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
        },
        {},
        {
          default: () => {
            return `Button WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
