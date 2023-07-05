import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createToggleGroup } from "../../../../../chunks/create15.js";
import { A as Align_left, a as Align_center, b as Align_right } from "../../../../../chunks/align-right.js";
const tw = `<script lang="ts">
	import { createToggleGroup } from '@melt-ui/svelte';
	import { AlignLeft, AlignCenter, AlignRight } from 'icons';

	const { root, item } = createToggleGroup();
<\/script>

<div
	{...$root}
	class="flex items-center data-[orientation='vertical']:flex-col"
	aria-label="Text alignment"
>
	<button class="toggle-item" {...$item('left')} use:item.action aria-label="Left aligned">
		<AlignLeft />
	</button>
	<button class="toggle-item" {...$item('center')} use:item.action aria-label="Center aligned">
		<AlignCenter />
	</button>
	<button class="toggle-item" {...$item('right')} use:item.action aria-label="Right aligned">
		<AlignRight />
	</button>
</div>

<style lang="postcss">
	.toggle-item {
		display: grid;
		place-items: center;
		align-items: center;

		background-color: theme('colors.white');
		color: theme('colors.magnum.800');
		font-size: theme('fontSize.base');
		line-height: theme('lineHeight.4');
		outline: none;

		height: theme('height.9');
		width: theme('width.9');

		&:hover {
			background-color: theme('colors.magnum.100');
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		@apply border-x border-l-transparent border-r-magnum-200;

		&:first-child {
			@apply rounded-l;
		}

		&:last-child {
			@apply rounded-r border-r-transparent;
		}
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		@apply border-x border-l-magnum-200 border-r-transparent;

		&:first-child {
			@apply rounded-r;
		}

		&:last-child {
			@apply rounded-l border-l-transparent;
		}
	}

	.toggle-item[data-orientation='vertical'] {
		@apply border-y border-b-magnum-200 border-t-transparent;

		&:first-child {
			@apply rounded-t;
		}

		&:last-child {
			@apply rounded-b border-b-transparent;
		}
	}

	.toggle-item[data-state='on'] {
		@apply bg-magnum-200 text-magnum-900;
	}
</style>
`;
const preview_svelte_svelte_type_style_lang = "";
const css = {
  code: ".toggle-item.svelte-jirp2q{display:grid;place-items:center;align-items:center;background-color:#fff;color:#964516;font-size:1rem;line-height:1rem;outline:none;height:2.25rem;width:2.25rem}.toggle-item.svelte-jirp2q:hover{background-color:#fef2d6}.toggle-item.svelte-jirp2q:focus{z-index:10}.toggle-item[data-disabled].svelte-jirp2q{cursor:not-allowed}.toggle-item[data-orientation='horizontal'].svelte-jirp2q{border-left-width:1px;border-right-width:1px;border-left-color:transparent;--tw-border-opacity:1;border-right-color:rgb(252 224 172 / var(--tw-border-opacity))}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:first-child{border-top-left-radius:0.25rem;border-bottom-left-radius:0.25rem}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:last-child{border-top-right-radius:0.25rem;border-bottom-right-radius:0.25rem;border-right-color:transparent}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:dir(rtl){border-left-width:1px;border-right-width:1px;--tw-border-opacity:1;border-left-color:rgb(252 224 172 / var(--tw-border-opacity));border-right-color:transparent}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:dir(rtl):first-child{border-top-right-radius:0.25rem;border-bottom-right-radius:0.25rem}.toggle-item[data-orientation='horizontal'].svelte-jirp2q:dir(rtl):last-child{border-top-left-radius:0.25rem;border-bottom-left-radius:0.25rem;border-left-color:transparent}.toggle-item[data-orientation='vertical'].svelte-jirp2q{border-top-width:1px;border-bottom-width:1px;--tw-border-opacity:1;border-bottom-color:rgb(252 224 172 / var(--tw-border-opacity));border-top-color:transparent}.toggle-item[data-orientation='vertical'].svelte-jirp2q:first-child{border-top-left-radius:0.25rem;border-top-right-radius:0.25rem}.toggle-item[data-orientation='vertical'].svelte-jirp2q:last-child{border-bottom-right-radius:0.25rem;border-bottom-left-radius:0.25rem;border-bottom-color:transparent}.toggle-item[data-state='on'].svelte-jirp2q{--tw-bg-opacity:1;background-color:rgb(252 224 172 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))}",
  map: null
};
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $item, $$unsubscribe_item;
  const { root, item } = createToggleGroup();
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$result.css.add(css);
  $$unsubscribe_root();
  $$unsubscribe_item();
  return `<div${spread(
    [
      escape_object($root),
      {
        class: "flex items-center data-[orientation='vertical']:flex-col"
      },
      { "aria-label": "Text alignment" }
    ],
    { classes: "svelte-jirp2q" }
  )}><button${spread(
    [
      { class: "toggle-item" },
      escape_object($item("left")),
      { "aria-label": "Left aligned" }
    ],
    { classes: "svelte-jirp2q" }
  )}>${validate_component(Align_left, "AlignLeft").$$render($$result, {}, {}, {})}</button> <button${spread(
    [
      { class: "toggle-item" },
      escape_object($item("center")),
      { "aria-label": "Center aligned" }
    ],
    { classes: "svelte-jirp2q" }
  )}>${validate_component(Align_center, "AlignCenter").$$render($$result, {}, {}, {})}</button> <button${spread(
    [
      { class: "toggle-item" },
      escape_object($item("right")),
      { "aria-label": "Right aligned" }
    ],
    { classes: "svelte-jirp2q" }
  )}>${validate_component(Align_right, "AlignRight").$$render($$result, {}, {}, {})}</button> </div>`;
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
