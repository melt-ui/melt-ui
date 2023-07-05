import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createPopover, S as Settings2 } from "../../../../../chunks/settings2.js";
import { X } from "../../../../../chunks/x.js";
const tw = `<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import { Settings2, X } from 'icons';

	const { trigger, content, open, arrow, close } = createPopover();
<\/script>

<button
	type="button"
	class="trigger"
	{...$trigger}
	use:trigger.action
	aria-label="Update dimensions"
>
	<Settings2 class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

{#if $open}
	<div {...$content} use:content.action transition:fade={{ duration: 100 }} class="content">
		<div {...$arrow} />
		<div class="flex flex-col gap-2.5">
			<p>Dimensions</p>
			<fieldset>
				<label for="width"> Width </label>
				<input id="width" value="100%" class="input" />
			</fieldset>
			<fieldset>
				<label for="maxWidth"> Max. width </label>
				<input id="maxWidth" value="300px" class="input" />
			</fieldset>
			<fieldset>
				<label for="height"> Height </label>
				<input id="height" value="25px" class="input" />
			</fieldset>
			<fieldset>
				<label for="maxHeight"> Max. height </label>
				<input id="maxHeight" class="input" />
			</fieldset>
		</div>
		<button class="close" {...close} use:close.action>
			<X class="h-4 w-4 " />
		</button>
	</div>
{/if}

<style lang="postcss">
	fieldset {
		@apply flex items-center gap-5;
	}

	label {
		@apply w-[75px] text-sm text-neutral-700;
	}

	p {
		@apply mb-2 font-medium text-neutral-900;
	}

	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}

	.content {
		@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}
</style>
`;
const preview_svelte_svelte_type_style_lang = "";
const css = {
  code: "fieldset.svelte-8whtbw{display:flex;align-items:center;gap:1.25rem\n}label.svelte-8whtbw{width:75px;font-size:0.875rem;line-height:1.25rem;--tw-text-opacity:1;color:rgb(64 64 64 / var(--tw-text-opacity))\n}p.svelte-8whtbw{margin-bottom:0.5rem;font-weight:500;--tw-text-opacity:1;color:rgb(23 23 23 / var(--tw-text-opacity))\n}.input.svelte-8whtbw{display:flex;height:2rem;width:100%;border-radius:0.375rem;border-width:1px;--tw-border-opacity:1;border-color:rgb(150 69 22 / var(--tw-border-opacity));background-color:transparent;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;--tw-ring-offset-color:#f9c978\n}.input.svelte-8whtbw:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:1px\n}.input.svelte-8whtbw{flex:1 1 0%;align-items:center;justify-content:center;padding-left:0.625rem;padding-right:0.625rem;font-size:0.875rem;line-height:1.25rem;line-height:1;--tw-text-opacity:1;color:rgb(189 87 17 / var(--tw-text-opacity))\n}.trigger.svelte-8whtbw{display:inline-flex;height:2.25rem;width:2.25rem;align-items:center;justify-content:center;border-radius:9999px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0px;font-size:0.875rem;line-height:1.25rem;font-weight:500;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.trigger.svelte-8whtbw:hover{background-color:rgb(255 255 255 / 0.9)\n}.trigger.svelte-8whtbw:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:2px\n}.close.svelte-8whtbw{position:absolute;right:0.375rem;top:0.375rem;display:flex;height:1.75rem;width:1.75rem;align-items:center;justify-content:center;border-radius:9999px;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.close.svelte-8whtbw:hover{background-color:rgb(243 141 28 / 0.1)\n}.close.svelte-8whtbw:focus-visible{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity));--tw-ring-offset-width:2px\n}.close.svelte-8whtbw{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0px;font-size:0.875rem;line-height:1.25rem;font-weight:500\n}.content.svelte-8whtbw{z-index:10;width:15rem;border-radius:4px;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:1.25rem;--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)\n}",
  map: null
};
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let $arrow, $$unsubscribe_arrow;
  const { trigger, content, open, arrow, close } = createPopover();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  $$unsubscribe_arrow = subscribe(arrow, (value) => $arrow = value);
  $$result.css.add(css);
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  $$unsubscribe_content();
  $$unsubscribe_arrow();
  return `<button${spread(
    [
      { type: "button" },
      { class: "trigger" },
      escape_object($trigger),
      { "aria-label": "Update dimensions" }
    ],
    { classes: "svelte-8whtbw" }
  )}>${validate_component(Settings2, "Settings2").$$render($$result, { class: "h-4 w-4" }, {}, {})} <span class="sr-only" data-svelte-h="svelte-joms16">Open Popover</span></button> ${$open ? `<div${spread([escape_object($content), { class: "content" }], { classes: "svelte-8whtbw" })}><div${spread([escape_object($arrow)], { classes: "svelte-8whtbw" })}></div> <div class="flex flex-col gap-2.5" data-svelte-h="svelte-14r694b"><p class="svelte-8whtbw">Dimensions</p> <fieldset class="svelte-8whtbw"><label for="width" class="svelte-8whtbw">Width</label> <input id="width" value="100%" class="input svelte-8whtbw"></fieldset> <fieldset class="svelte-8whtbw"><label for="maxWidth" class="svelte-8whtbw">Max. width</label> <input id="maxWidth" value="300px" class="input svelte-8whtbw"></fieldset> <fieldset class="svelte-8whtbw"><label for="height" class="svelte-8whtbw">Height</label> <input id="height" value="25px" class="input svelte-8whtbw"></fieldset> <fieldset class="svelte-8whtbw"><label for="maxHeight" class="svelte-8whtbw">Max. height</label> <input id="maxHeight" class="input svelte-8whtbw"></fieldset></div> <button${spread([{ class: "close" }, escape_object(close)], { classes: "svelte-8whtbw" })}>${validate_component(X, "X").$$render($$result, { class: "h-4 w-4 " }, {}, {})}</button></div>` : ``}`;
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
