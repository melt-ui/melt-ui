import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, d as escape, v as validate_component, b as each } from "../../../../../chunks/ssr.js";
import { c as createPagination, C as Chevron_left } from "../../../../../chunks/chevron-left.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
const tw = `<script lang="ts">
	import { createPagination } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight } from 'icons';

	const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
		count: 100,
		perPage: 10,
		page: 1,
		siblingCount: 1,
	});
<\/script>

<nav class="flex flex-col items-center gap-4" aria-label="pagination" {...root}>
	<p class="text-center">Showing items {$range.start} - {$range.end}</p>
	<div class="flex items-center gap-2">
		<button {...$prevButton} use:prevButton.action><ChevronLeft /></button>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button {...$pageTrigger(page)} use:pageTrigger.action>{page.value}</button>
			{/if}
		{/each}
		<button {...$nextButton} use:nextButton.action><ChevronRight /></button>
	</div>
</nav>

<style lang="postcss">
	button {
		display: grid;
		place-items: center;
		border-radius: theme('borderRadius.sm');
		background-color: theme('colors.white');
		color: theme('colors.magnum.700');
		box-shadow: theme('boxShadow.sm');

		font-size: theme('fontSize.sm');

		padding-inline: theme('spacing.3');
		height: theme('spacing.8');

		&:hover {
			opacity: 0.75;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		&[data-selected] {
			background-color: theme('colors.magnum.900');
			color: theme('colors.white');
		}
	}
</style>
`;
const preview_svelte_svelte_type_style_lang = "";
const css = {
  code: "button.svelte-btbvw9{display:grid;place-items:center;border-radius:0.125rem;background-color:#fff;color:#bd5711;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);font-size:0.875rem;padding-inline:0.75rem;height:2rem}button.svelte-btbvw9:hover{opacity:0.75}button.svelte-btbvw9:disabled{cursor:not-allowed;opacity:0.5}button[data-selected].svelte-btbvw9{background-color:#793a15;color:#fff}",
  map: null
};
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $range, $$unsubscribe_range;
  let $prevButton, $$unsubscribe_prevButton;
  let $pages, $$unsubscribe_pages;
  let $pageTrigger, $$unsubscribe_pageTrigger;
  let $nextButton, $$unsubscribe_nextButton;
  const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
    count: 100,
    perPage: 10,
    page: 1,
    siblingCount: 1
  });
  $$unsubscribe_prevButton = subscribe(prevButton, (value) => $prevButton = value);
  $$unsubscribe_nextButton = subscribe(nextButton, (value) => $nextButton = value);
  $$unsubscribe_pages = subscribe(pages, (value) => $pages = value);
  $$unsubscribe_pageTrigger = subscribe(pageTrigger, (value) => $pageTrigger = value);
  $$unsubscribe_range = subscribe(range, (value) => $range = value);
  $$result.css.add(css);
  $$unsubscribe_range();
  $$unsubscribe_prevButton();
  $$unsubscribe_pages();
  $$unsubscribe_pageTrigger();
  $$unsubscribe_nextButton();
  return `<nav${spread(
    [
      {
        class: "flex flex-col items-center gap-4"
      },
      { "aria-label": "pagination" },
      escape_object(root)
    ],
    {}
  )}><p class="text-center">Showing items ${escape($range.start)} - ${escape($range.end)}</p> <div class="flex items-center gap-2"><button${spread([escape_object($prevButton)], { classes: "svelte-btbvw9" })}>${validate_component(Chevron_left, "ChevronLeft").$$render($$result, {}, {}, {})}</button> ${each($pages, (page) => {
    return `${page.type === "ellipsis" ? `<span data-svelte-h="svelte-9cz974">...</span>` : `<button${spread([escape_object($pageTrigger(page))], { classes: "svelte-btbvw9" })}>${escape(page.value)}</button>`}`;
  })} <button${spread([escape_object($nextButton)], { classes: "svelte-btbvw9" })}>${validate_component(Chevron_right, "ChevronRight").$$render($$result, {}, {}, {})}</button></div> </nav>`;
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
