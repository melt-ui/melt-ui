import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { G as GlobalReset } from "../../../../../chunks/globals_raw.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, d as escape } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createSeparator } from "../../../../../chunks/create2.js";
const tw = `<script lang="ts">
	import { createSeparator, type CreateSeparatorArgs } from '@melt-ui/svelte';

	export let orientation: CreateSeparatorArgs['orientation'] = 'vertical';

	const { root: vertical } = createSeparator({
		orientation,
	});

	const { root: horizontalSeparator } = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});

	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];
<\/script>

<h2 class="font-bold">Melt UI</h2>
<p>Flavors for everyone</p>
<div {...$horizontalSeparator} class="my-3.5 h-[1px] w-full bg-white" />
<div class="flex items-center space-x-3.5">
	{#each icecreams as icecream, i}
		<p>{icecream}</p>
		{#if i !== icecreams.length - 1}
			<div {...$vertical} class="h-4 w-[1px] bg-white" />
		{/if}
	{/each}
</div>
`;
const css = `<script lang="ts">\r
	import { createSeparator, type CreateSeparatorArgs } from '@melt-ui/svelte';\r
\r
	export let orientation: CreateSeparatorArgs['orientation'] = 'vertical';\r
\r
	const { root: vertical } = createSeparator({\r
		orientation,\r
	});\r
\r
	const { root: horizontalSeparator } = createSeparator({\r
		orientation: 'horizontal',\r
		decorative: true,\r
	});\r
\r
	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];\r
<\/script>\r
\r
<h2>Melt UI</h2>\r
<p>Flavors for everyone</p>\r
<div {...$horizontalSeparator} class="separator separator--horizontal" />\r
<div class="ice-creams">\r
	{#each icecreams as icecream, i}\r
		<p>{icecream}</p>\r
		{#if i !== icecreams.length - 1}\r
			<div {...$vertical} class="separator separator--vertical" />\r
		{/if}\r
	{/each}\r
</div>\r
\r
<style lang="postcss">\r
	h2 {\r
		font-weight: var(--tw-font-weight-bold);\r
	}\r
\r
	.ice-creams {\r
		display: flex;\r
		align-items: center;\r
		column-gap: var(--tw-size-3_5);\r
	}\r
\r
	.separator {\r
		--tw-bg-opacity: 1;\r
\r
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));\r
	}\r
\r
	.separator--horizontal {\r
		margin-top: var(--tw-size-3_5);\r
		margin-bottom: var(--tw-size-3_5);\r
		height: 1px;\r
		width: 100%;\r
	}\r
\r
	.separator--vertical {\r
		height: var(--tw-size-4);\r
		width: 1px;\r
	}\r
</style>\r
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $horizontalSeparator, $$unsubscribe_horizontalSeparator;
  let $vertical, $$unsubscribe_vertical;
  let { orientation = "vertical" } = $$props;
  const { root: vertical } = createSeparator({ orientation });
  $$unsubscribe_vertical = subscribe(vertical, (value) => $vertical = value);
  const { root: horizontalSeparator } = createSeparator({
    orientation: "horizontal",
    decorative: true
  });
  $$unsubscribe_horizontalSeparator = subscribe(horizontalSeparator, (value) => $horizontalSeparator = value);
  const icecreams = ["Caramel", "Vanilla", "Napolitan"];
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0)
    $$bindings.orientation(orientation);
  $$unsubscribe_horizontalSeparator();
  $$unsubscribe_vertical();
  return `<h2 class="font-bold" data-svelte-h="svelte-1motaaq">Melt UI</h2> <p data-svelte-h="svelte-uujsbd">Flavors for everyone</p> <div${spread(
    [
      escape_object($horizontalSeparator),
      { class: "my-3.5 h-[1px] w-full bg-white" }
    ],
    {}
  )}></div> <div class="flex items-center space-x-3.5">${each(icecreams, (icecream, i) => {
    return `<p>${escape(icecream)}</p> ${i !== icecreams.length - 1 ? `<div${spread([escape_object($vertical), { class: "h-4 w-[1px] bg-white" }], {})}></div>` : ``}`;
  })}</div>`;
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
