import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, d as escape } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createSwitch } from "../../../../../chunks/create3.js";
const tw = `<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte';

	const { root, input, isChecked } = createSwitch();
<\/script>

<form>
	<div class="flex items-center">
		<label class="pr-4 leading-none text-white" for="airplane-mode"> Airplane mode </label>
		<button
			{...$root}
			use:root.action
			class="relative h-6 w-11 cursor-default rounded-full bg-magnum-800 transition-colors data-[state=checked]:bg-magnum-950"
			id="airplane-mode"
		>
			<span
				class="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform
                {$isChecked && 'translate-x-[22px]'}"
			/>
			<input {...$input} />
		</button>
	</div>
</form>
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $isChecked, $$unsubscribe_isChecked;
  let $input, $$unsubscribe_input;
  const { root, input, isChecked } = createSwitch();
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_input = subscribe(input, (value) => $input = value);
  $$unsubscribe_isChecked = subscribe(isChecked, (value) => $isChecked = value);
  $$unsubscribe_root();
  $$unsubscribe_isChecked();
  $$unsubscribe_input();
  return `<form><div class="flex items-center"><label class="pr-4 leading-none text-white" for="airplane-mode" data-svelte-h="svelte-14gdl3l">Airplane mode</label> <button${spread(
    [
      escape_object($root),
      {
        class: "relative h-6 w-11 cursor-default rounded-full bg-magnum-800 transition-colors data-[state=checked]:bg-magnum-950"
      },
      { id: "airplane-mode" }
    ],
    {}
  )}><span class="${"block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform " + escape($isChecked && "translate-x-[22px]", true)}"></span> <input${spread([escape_object($input)], {})}></button></div></form>`;
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
