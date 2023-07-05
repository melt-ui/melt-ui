import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, d as escape, v as validate_component, b as each } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createSelect, C as Chevron_down } from "../../../../../chunks/chevron-down.js";
import { C as Check } from "../../../../../chunks/check.js";
const tw = `<script lang="ts">
	import { createSelect } from '@melt-ui/svelte';
	import { Check, ChevronDown } from 'icons';

	const { label, trigger, menu, option, isSelected, createGroup } = createSelect();

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
<\/script>

<button class="trigger" {...$trigger} use:trigger.action aria-label="Food">
	{$label || 'Select an option'}
	<ChevronDown />
</button>

<div class="menu" {...$menu} use:menu.action>
	{#each Object.entries(options) as [key, arr]}
		{@const { group, label } = createGroup()}
		<div {...group}>
			<div class="label" {...label}>{key}</div>
			{#each arr as item}
				<div class="option" {...$option({ value: item, label: item })} use:option.action>
					{#if $isSelected(item)}
						<div class="check">
							<Check />
						</div>
					{/if}
					{item}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4  font-semibold capitalize text-neutral-800;
	}

	.menu {
		@apply z-10 flex max-h-[360px]  flex-col overflow-y-auto;
		@apply rounded-md bg-white p-1;
		@apply ring-0 !important;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
		@apply focus:z-10 focus:text-magnum-700;
		@apply data-[highlighted]:bg-magnum-50 data-[highlighted]:text-magnum-900;
		@apply data-[selected]:bg-magnum-100 data-[selected]:text-magnum-900;
	}
	.trigger {
		@apply flex h-10 min-w-[220px] items-center justify-between rounded-md bg-white px-3;
		@apply py-2 text-magnum-700 transition-opacity hover:opacity-90;
	}
	.check {
		@apply absolute left-2 top-1/2 z-20 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
`;
const preview_svelte_svelte_type_style_lang = "";
const css = {
  code: ".label.svelte-3b77pf{padding-top:0.25rem;padding-bottom:0.25rem;padding-left:1rem;padding-right:1rem;font-weight:600;text-transform:capitalize;--tw-text-opacity:1;color:rgb(38 38 38 / var(--tw-text-opacity))\n}.menu.svelte-3b77pf{z-index:10;display:flex;max-height:360px;flex-direction:column;overflow-y:auto;border-radius:0.375rem;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0.25rem;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important\n}.option.svelte-3b77pf{position:relative;cursor:pointer;border-radius:0.375rem;padding-top:0.25rem;padding-bottom:0.25rem;padding-left:2rem;padding-right:1rem;--tw-text-opacity:1;color:rgb(38 38 38 / var(--tw-text-opacity))\n}.option.svelte-3b77pf:focus{z-index:10;--tw-text-opacity:1;color:rgb(189 87 17 / var(--tw-text-opacity))\n}.option[data-highlighted].svelte-3b77pf{--tw-bg-opacity:1;background-color:rgb(255 249 237 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))\n}.option[data-selected].svelte-3b77pf{--tw-bg-opacity:1;background-color:rgb(254 242 214 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))\n}.trigger.svelte-3b77pf{display:flex;height:2.5rem;min-width:220px;align-items:center;justify-content:space-between;border-radius:0.375rem;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding-left:0.75rem;padding-right:0.75rem;padding-top:0.5rem;padding-bottom:0.5rem;--tw-text-opacity:1;color:rgb(189 87 17 / var(--tw-text-opacity));transition-property:opacity;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.trigger.svelte-3b77pf:hover{opacity:0.9\n}.check.svelte-3b77pf{position:absolute;left:0.5rem;top:50%;z-index:20;--tw-text-opacity:1;color:rgb(243 141 28 / var(--tw-text-opacity));translate:0 calc(-50% + 1px)\n}",
  map: null
};
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $label, $$unsubscribe_label;
  let $menu, $$unsubscribe_menu;
  let $option, $$unsubscribe_option;
  let $isSelected, $$unsubscribe_isSelected;
  const { label, trigger, menu, option, isSelected, createGroup } = createSelect();
  $$unsubscribe_label = subscribe(label, (value) => $label = value);
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_menu = subscribe(menu, (value) => $menu = value);
  $$unsubscribe_option = subscribe(option, (value) => $option = value);
  $$unsubscribe_isSelected = subscribe(isSelected, (value) => $isSelected = value);
  const options = {
    sweet: ["Caramel", "Chocolate", "Strawberry", "Cookies & Cream"],
    savory: ["Basil", "Bacon", "Rosemary", "Balsamic Fig"]
  };
  $$result.css.add(css);
  $$unsubscribe_trigger();
  $$unsubscribe_label();
  $$unsubscribe_menu();
  $$unsubscribe_option();
  $$unsubscribe_isSelected();
  return `<button${spread([{ class: "trigger" }, escape_object($trigger), { "aria-label": "Food" }], { classes: "svelte-3b77pf" })}>${escape($label || "Select an option")} ${validate_component(Chevron_down, "ChevronDown").$$render($$result, {}, {}, {})}</button> <div${spread([{ class: "menu" }, escape_object($menu)], { classes: "svelte-3b77pf" })}>${each(Object.entries(options), ([key, arr]) => {
    let { group, label: label2 } = createGroup();
    return ` <div${spread([escape_object(group)], { classes: "svelte-3b77pf" })}><div${spread([{ class: "label" }, escape_object(label2)], { classes: "svelte-3b77pf" })}>${escape(key)}</div> ${each(arr, (item) => {
      return `<div${spread([{ class: "option" }, escape_object($option({ value: item, label: item }))], { classes: "svelte-3b77pf" })}>${$isSelected(item) ? `<div class="check svelte-3b77pf">${validate_component(Check, "Check").$$render($$result, {}, {}, {})} </div>` : ``} ${escape(item)} </div>`;
    })} </div>`;
  })} </div>`;
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
