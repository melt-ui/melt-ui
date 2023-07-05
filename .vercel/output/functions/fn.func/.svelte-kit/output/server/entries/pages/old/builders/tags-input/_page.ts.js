import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, d as escape, v as validate_component } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createTagsInput } from "../../../../../chunks/create13.js";
import { X } from "../../../../../chunks/x.js";
const tw = `<script lang="ts">
	import { createTagsInput } from '@melt-ui/svelte';
	import X from '~icons/lucide/x';

	const { root, input, tags, tag, deleteTrigger } = createTagsInput({
		tags: ['Svelte', 'Typescript'],
	});
<\/script>

<div class="flex flex-col items-start justify-center gap-2">
	<div
		{...$root}
		use:root
		class="flex min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700
		focus-within:ring focus-within:ring-magnum-400"
	>
		{#each $tags as t}
			<div
				{...$tag(t)}
				class="flex items-center overflow-hidden rounded-md bg-magnum-200 text-magnum-900 [word-break:break-word]
			data-[disabled]:bg-magnum-300 data-[selected]:bg-magnum-400 data-[disabled]:hover:cursor-default
				data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
			>
				<span class="flex items-center border-r border-white/10 px-1.5">{t.value}</span>
				<button
					{...$deleteTrigger(t)}
					use:deleteTrigger
					class="flex h-full items-center px-1 enabled:hover:bg-magnum-300"
				>
					<X class="h-3 w-3" />
				</button>
			</div>
		{/each}

		<input
			{...$input}
			use:input
			type="text"
			class="min-w-[4.5rem] shrink grow basis-0 border-0 text-black outline-none focus:!ring-0 data-[invalid]:text-red-500"
		/>
	</div>
</div>
`;
const Tailwind$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $tags, $$unsubscribe_tags;
  let $tag, $$unsubscribe_tag;
  let $deleteTrigger, $$unsubscribe_deleteTrigger;
  let $input, $$unsubscribe_input;
  const { root, input, tags, tag, deleteTrigger } = createTagsInput({ tags: ["Svelte", "Typescript"] });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_input = subscribe(input, (value) => $input = value);
  $$unsubscribe_tags = subscribe(tags, (value) => $tags = value);
  $$unsubscribe_tag = subscribe(tag, (value) => $tag = value);
  $$unsubscribe_deleteTrigger = subscribe(deleteTrigger, (value) => $deleteTrigger = value);
  $$unsubscribe_root();
  $$unsubscribe_tags();
  $$unsubscribe_tag();
  $$unsubscribe_deleteTrigger();
  $$unsubscribe_input();
  return `<div class="flex flex-col items-start justify-center gap-2"><div${spread(
    [
      escape_object($root),
      {
        class: "flex min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700 focus-within:ring focus-within:ring-magnum-400"
      }
    ],
    {}
  )}>${each($tags, (t) => {
    return `<div${spread(
      [
        escape_object($tag(t)),
        {
          class: "flex items-center overflow-hidden rounded-md bg-magnum-200 text-magnum-900 [word-break:break-word] data-[disabled]:bg-magnum-300 data-[selected]:bg-magnum-400 data-[disabled]:hover:cursor-default data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0"
        }
      ],
      {}
    )}><span class="flex items-center border-r border-white/10 px-1.5">${escape(t.value)}</span> <button${spread(
      [
        escape_object($deleteTrigger(t)),
        {
          class: "flex h-full items-center px-1 enabled:hover:bg-magnum-300"
        }
      ],
      {}
    )}>${validate_component(X, "X").$$render($$result, { class: "h-3 w-3" }, {}, {})}</button> </div>`;
  })} <input${spread(
    [
      escape_object($input),
      { type: "text" },
      {
        class: "min-w-[4.5rem] shrink grow basis-0 border-0 text-black outline-none focus:!ring-0 data-[invalid]:text-red-500"
      }
    ],
    {}
  )}></div></div>`;
});
const Tailwind = {
  "index.svelte": tw,
  "tailwind.config.ts": TwConfig
};
const CSS = null;
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
