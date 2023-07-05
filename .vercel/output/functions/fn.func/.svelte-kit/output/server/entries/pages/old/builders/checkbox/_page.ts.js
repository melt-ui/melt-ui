import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { G as GlobalReset } from "../../../../../chunks/globals_raw.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "../../../../../chunks/ssr.js";
import { c as createCheckbox, M as Minus } from "../../../../../chunks/minus.js";
import "../../../../../chunks/clickOutside.js";
import { C as Check } from "../../../../../chunks/check.js";
const tw = `<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';
	import { Check, Minus } from 'icons';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
<\/script>

<form>
	<div class="flex items-center justify-center">
		<button
			{...$root}
			use:root.action
			class="flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75"
			id="checkbox"
		>
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input {...$input} />
		</button>
		<label class="pl-[15px] text-[15px] leading-none text-white" for="checkbox">
			Accept terms and conditions.
		</label>
	</div>
</form>
`;
const css = `<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';
	import { Check, Minus } from 'icons';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
<\/script>

<form>
	<div class="checkbox-wrapper">
		<button {...$root} use:root.action class="root" id="checkbox">
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input {...$input} />
		</button>
		<label for="checkbox" class="label"> Accept terms and conditions. </label>
	</div>
</form>

<style>
	.checkbox-wrapper {
		display: flex;
		background-color: #ffffff;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.125rem;
		appearance: none;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

		&:hover {
			opacity: 0.75;
		}
	}

	.root {
		display: flex;
		background-color: #ffffff;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.125rem;
		appearance: none;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		color: rgb(228 115 18);

		:hover {
			opacity: 0.75;
		}
	}

	.label {
		color: #ffffff;
		line-height: 1;
		padding-left: 15px;
		color: 15px;
	}
</style>
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $isIndeterminate, $$unsubscribe_isIndeterminate;
  let $isChecked, $$unsubscribe_isChecked;
  let $input, $$unsubscribe_input;
  const { root, input, isChecked, isIndeterminate } = createCheckbox({ checked: "indeterminate" });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_input = subscribe(input, (value) => $input = value);
  $$unsubscribe_isChecked = subscribe(isChecked, (value) => $isChecked = value);
  $$unsubscribe_isIndeterminate = subscribe(isIndeterminate, (value) => $isIndeterminate = value);
  $$unsubscribe_root();
  $$unsubscribe_isIndeterminate();
  $$unsubscribe_isChecked();
  $$unsubscribe_input();
  return `<form><div class="flex items-center justify-center"><button${spread(
    [
      escape_object($root),
      {
        class: "flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75"
      },
      { id: "checkbox" }
    ],
    {}
  )}>${$isIndeterminate ? `${validate_component(Minus, "Minus").$$render($$result, {}, {}, {})}` : `${$isChecked ? `${validate_component(Check, "Check").$$render($$result, {}, {}, {})}` : ``}`} <input${spread([escape_object($input)], {})}></button> <label class="pl-[15px] text-[15px] leading-none text-white" for="checkbox" data-svelte-h="svelte-1lkisay">Accept terms and conditions.</label></div></form>`;
});
const Tailwind = {
  "index.svelte": tw,
  "tailwind.config.ts": TwConfig
};
const CSS = {
  "index.svelte": css,
  "globals.css": GlobalReset
};
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
