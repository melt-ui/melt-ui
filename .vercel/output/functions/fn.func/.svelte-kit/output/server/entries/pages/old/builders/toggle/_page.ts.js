import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "../../../../../chunks/ssr.js";
import { c as createToggle } from "../../../../../chunks/create14.js";
import { I as Italic } from "../../../../../chunks/italic.js";
const tw = `<script lang="ts">
	import { createToggle } from '@melt-ui/svelte';
	import Italic from '~icons/lucide/italic';

	const { toggle } = createToggle();
<\/script>

<button
	{...$toggle}
	use:toggle.action
	aria-label="Toggle italic"
	class="grid h-9 w-9 place-items-center items-center justify-center rounded
	bg-white text-base leading-4 text-magnum-800 shadow-lg hover:bg-magnum-100 data-[disabled]:cursor-not-allowed data-[state=on]:bg-magnum-200
	data-[state=on]:text-magnum-900"
>
	<Italic />
</button>
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toggle, $$unsubscribe_toggle;
  const { toggle } = createToggle();
  $$unsubscribe_toggle = subscribe(toggle, (value) => $toggle = value);
  $$unsubscribe_toggle();
  return `<button${spread(
    [
      escape_object($toggle),
      { "aria-label": "Toggle italic" },
      {
        class: "grid h-9 w-9 place-items-center items-center justify-center rounded bg-white text-base leading-4 text-magnum-800 shadow-lg hover:bg-magnum-100 data-[disabled]:cursor-not-allowed data-[state=on]:bg-magnum-200 data-[state=on]:text-magnum-900"
      }
    ],
    {}
  )}>${validate_component(Italic, "Italic").$$render($$result, {}, {}, {})}</button>`;
});
const Tailwind = {
  "index.svelte": tw,
  "tailwind.config.ts": TwConfig
};
const CSS = null;
const preview = {
  component: Preview,
  code: {
    Tailwind,
    CSS
  }
};
async function load() {
  return {
    preview
  };
}
export {
  load
};
