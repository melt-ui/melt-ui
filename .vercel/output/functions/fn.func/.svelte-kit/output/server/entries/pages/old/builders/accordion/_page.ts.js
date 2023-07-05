import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, f as escape_attribute_value, d as escape } from "../../../../../chunks/ssr.js";
import { c as createAccordion } from "../../../../../chunks/create4.js";
import "../../../../../chunks/clickOutside.js";
import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { G as GlobalReset } from "../../../../../chunks/globals_raw.js";
const Tailwind$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $item, $$unsubscribe_item;
  let $trigger, $$unsubscribe_trigger;
  let $isSelected, $$unsubscribe_isSelected;
  let $content, $$unsubscribe_content;
  const { content, item, trigger, isSelected, root } = createAccordion();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_isSelected = subscribe(isSelected, (value) => $isSelected = value);
  const items = [
    {
      id: "item-1",
      title: "Is it accessible?",
      description: "Yes. It adheres to the WAI-ARIA design pattern."
    },
    {
      id: "item-2",
      title: "Is it unstyled?",
      description: "Yes. It's unstyled by default, giving you freedom over the look and feel."
    },
    {
      id: "item-3",
      title: "Can it be animated?",
      description: "Yes! You can use the transition prop to configure the animation."
    }
  ];
  $$unsubscribe_item();
  $$unsubscribe_trigger();
  $$unsubscribe_isSelected();
  $$unsubscribe_content();
  return `<div${spread(
    [
      {
        class: "mx-auto w-full max-w-md rounded-md shadow-lg"
      },
      escape_object(root)
    ],
    {}
  )}>${each(items, ({ id, title, description }, i) => {
    return `<div${spread(
      [
        escape_object($item(id)),
        {
          class: "mt-px overflow-hidden transition-colors first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:ring focus-within:ring-magnum-400"
        }
      ],
      {}
    )}><h2 class="flex"><button${spread(
      [
        {
          id: escape_attribute_value(i === 0 ? "trigger" : void 0)
        },
        escape_object($trigger(id)),
        {
          class: "flex h-12 flex-1 cursor-pointer items-center justify-between bg-white px-5 text-base font-medium leading-none text-magnum-700 shadow-[0_1px_0] transition-colors hover:bg-opacity-95"
        }
      ],
      {}
    )}>${escape(title)} </button></h2> ${$isSelected(id) ? `<div${spread(
      [
        {
          class: "overflow-hidden bg-neutral-100 text-sm text-neutral-900"
        },
        escape_object($content(id))
      ],
      {}
    )}><div class="px-5 py-4">${escape(description)}</div> </div>` : ``} </div>`;
  })}</div>`;
});
const tw = `<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description: 'Yes! You can use the transition prop to configure the animation.',
		},
	];
<\/script>

<div class="mx-auto w-full max-w-md rounded-md shadow-lg" {...root}>
	{#each items as { id, title, description }, i}
		<div
			{...$item(id)}
			class="mt-px overflow-hidden transition-colors
			first:mt-0 first:rounded-t last:rounded-b focus-within:relative
			focus-within:z-10 focus-within:ring focus-within:ring-magnum-400"
		>
			<h2 class="flex">
				<button
					id={i === 0 ? 'trigger' : undefined}
					{...$trigger(id)}
					use:trigger
					class="flex h-12 flex-1 cursor-pointer items-center justify-between
				bg-white px-5 text-base font-medium leading-none text-magnum-700
					shadow-[0_1px_0] transition-colors hover:bg-opacity-95"
				>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class="overflow-hidden bg-neutral-100 text-sm text-neutral-900"
					{...$content(id)}
					transition:slide
				>
					<div class="px-5 py-4">{description}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
`;
const css = `<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description: 'Yes! You can use the transition prop to configure the animation.',
		},
	];
<\/script>

<div class="root" {...root}>
	{#each items as { id, title, description }, i}
		<div {...$item(id)} class="item">
			<h2>
				<button id={i === 0 ? 'trigger' : undefined} {...$trigger(id)} use:trigger class="trigger">
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div class="content" {...$content(id)} transition:slide>
					<div>{description}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.root {
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		max-width: var(--tw-width-md);
		border-radius: var(--tw-border-radius-md);
		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
	}

	.item {
		margin-top: var(--tw-size-px);
		overflow: hidden;
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.item:first-child {
		margin-top: var(--tw-size-0);
		border-top-left-radius: var(--tw-border-radius-default);
		border-top-right-radius: var(--tw-border-radius-default);
	}

	.item:last-child {
		border-bottom-right-radius: var(--tw-border-radius-default);
		border-bottom-left-radius: var(--tw-border-radius-default);
	}

	.item:focus-within {
		position: relative;
		z-index: 10;
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
			var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
			var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
		--tw-ring-opacity: 1;
		--tw-ring-color: rgb(var(--tw-color-magnum-400) / var(--tw-ring-opacity));
	}

	.item > h2 {
		display: flex;
	}

	.trigger {
		display: flex;
		height: var(--tw-size-12);
		flex: 1 1 0%;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-white) / var(--tw-bg-opacity));
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		font-size: var(--tw-font-size-base);
		line-height: var(--tw-line-height-6);
		font-weight: var(--tw-font-weight-medium);
		line-height: var(--tw-line-height-none);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-magnum-700) / var(--tw-text-opacity));
		--tw-shadow: 0 1px 0;
		--tw-shadow-colored: 0 1px 0 var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.trigger:hover {
		--tw-bg-opacity: 0.95;
	}

	.content {
		overflow: hidden;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-neutral-100) / var(--tw-bg-opacity));
		font-size: var(--tw-font-size-sm);
		line-height: var(--tw-line-height-5);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-neutral-900) / var(--tw-text-opacity));
	}

	.content > div {
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		padding-top: var(--tw-size-4);
		padding-bottom: var(--tw-size-4);
	}
</style>
`;
const Tailwind = {
  "index.svelte": tw,
  "tailwind.config.ts": TwConfig
};
const CSS = {
  "index.svelte": css,
  "globals.css": GlobalReset
};
const preview = {
  component: Tailwind$1,
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
