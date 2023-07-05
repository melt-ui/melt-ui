import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, f as escape_attribute_value, d as escape, g as add_attribute } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createRadioGroup } from "../../../../../chunks/create11.js";
const tw = `<script lang="ts">
	import { createRadioGroup } from '@melt-ui/svelte';

	const { root, item, isChecked } = createRadioGroup({
		value: 'default',
	});

	const optionsArr = ['default', 'comfortable', 'compact'];
<\/script>

<div
	{...$root}
	class="flex flex-col gap-3 data-[orientation=horizontal]:flex-row"
	aria-label="View density"
>
	{#each optionsArr as option}
		<div class="flex items-center gap-3">
			<button
				{...$item(option)}
				use:item.action
				class="grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm
			hover:bg-magnum-100"
				id={option}
				aria-labelledby="{option}-label"
			>
				{#if $isChecked(option)}
					<div class="h-3 w-3 rounded-full bg-magnum-500" />
				{/if}
			</button>
			<label class="capitalize leading-none text-white" for={option} id="{option}-label">
				{option}
			</label>
		</div>
	{/each}
</div>
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $item, $$unsubscribe_item;
  let $isChecked, $$unsubscribe_isChecked;
  const { root, item, isChecked } = createRadioGroup({ value: "default" });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$unsubscribe_isChecked = subscribe(isChecked, (value) => $isChecked = value);
  const optionsArr = ["default", "comfortable", "compact"];
  $$unsubscribe_root();
  $$unsubscribe_item();
  $$unsubscribe_isChecked();
  return `<div${spread(
    [
      escape_object($root),
      {
        class: "flex flex-col gap-3 data-[orientation=horizontal]:flex-row"
      },
      { "aria-label": "View density" }
    ],
    {}
  )}>${each(optionsArr, (option) => {
    return `<div class="flex items-center gap-3"><button${spread(
      [
        escape_object($item(option)),
        {
          class: "grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm hover:bg-magnum-100"
        },
        { id: escape_attribute_value(option) },
        {
          "aria-labelledby": escape(option, true) + "-label"
        }
      ],
      {}
    )}>${$isChecked(option) ? `<div class="h-3 w-3 rounded-full bg-magnum-500"></div>` : ``}</button> <label class="capitalize leading-none text-white"${add_attribute("for", option, 0)} id="${escape(option, true) + "-label"}">${escape(option)}</label> </div>`;
  })}</div>`;
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
