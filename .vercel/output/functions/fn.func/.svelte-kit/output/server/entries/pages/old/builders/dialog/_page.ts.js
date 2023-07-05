import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createDialog } from "../../../../../chunks/create.js";
import "clsx";
import { X } from "../../../../../chunks/x.js";
import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
const Tailwind$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let $overlay, $$unsubscribe_overlay;
  let $content, $$unsubscribe_content;
  let $title, $$unsubscribe_title;
  let $description, $$unsubscribe_description;
  let $close, $$unsubscribe_close;
  const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_overlay = subscribe(overlay, (value) => $overlay = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_title = subscribe(title, (value) => $title = value);
  $$unsubscribe_description = subscribe(description, (value) => $description = value);
  $$unsubscribe_close = subscribe(close, (value) => $close = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  $$unsubscribe_overlay();
  $$unsubscribe_content();
  $$unsubscribe_title();
  $$unsubscribe_description();
  $$unsubscribe_close();
  return `<div><button${spread(
    [
      escape_object($trigger),
      {
        class: "inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75 "
      }
    ],
    {}
  )}>Open Dialog</button> <div>${$open ? `<div${spread([escape_object($overlay), { class: "fixed inset-0 z-40 bg-black/50" }], {})}></div> <div${spread(
    [
      {
        class: "fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-[25px] shadow-lg"
      },
      escape_object($content)
    ],
    {}
  )}><h2${spread(
    [
      escape_object($title),
      {
        class: "m-0 text-lg font-medium text-black"
      }
    ],
    {}
  )}>Edit profile</h2> <p${spread(
    [
      escape_object($description),
      {
        class: "mb-5 mt-[10px] leading-normal text-zinc-600"
      }
    ],
    {}
  )}>Make changes to your profile here. Click save when you&#39;re done.</p> <fieldset class="mb-4 flex items-center gap-5" data-svelte-h="svelte-iqng"><label class="w-[90px] text-right text-magnum-800" for="name">Name</label> <input class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border border-solid px-3 leading-none text-magnum-800" id="name" value="Thomas G. Lopes"></fieldset> <fieldset class="mb-4 flex items-center gap-5" data-svelte-h="svelte-4k2d99"><label class="w-[90px] text-right text-magnum-800" for="username">Username</label> <input class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border border-solid px-3 leading-none text-magnum-800" id="username" value="@thomasglopes"></fieldset> <div class="mt-[25px] flex justify-end gap-4"><button${spread(
    [
      escape_object($close),
      {
        class: "inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
      }
    ],
    {}
  )}>Cancel</button> <button${spread(
    [
      escape_object($close),
      {
        class: "inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
      }
    ],
    {}
  )}>Save changes</button></div> <button${spread(
    [
      escape_object($close),
      {
        class: "absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400"
      }
    ],
    {}
  )}>${validate_component(X, "X").$$render($$result, {}, {}, {})}</button></div>` : ``}</div></div>`;
});
const tw$1 = `<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	/** Internal helpers */
	import { flyAndScale } from '$routes/helpers';
	import X from '~icons/lucide/x';

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
<\/script>

<div>
	<button
		{...$trigger}
		use:trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
			font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75
			"
	>
		Open Dialog
	</button>
	<div use:portal>
		{#if $open}
			<div {...$overlay} class="fixed inset-0 z-40 bg-black/50" />
			<div
				class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px]
				translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-[25px]
				shadow-lg"
				transition:flyAndScale={{ duration: 150, y: 8, start: 0.96 }}
				{...$content}
				use:content
			>
				<h2 {...$title} class="m-0 text-lg font-medium text-black">Edit profile</h2>
				<p {...$description} class="mb-5 mt-[10px] leading-normal text-zinc-600">
					Make changes to your profile here. Click save when you're done.
				</p>

				<fieldset class="mb-4 flex items-center gap-5">
					<label class="w-[90px] text-right text-magnum-800" for="name"> Name </label>
					<input
						class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
						border-solid px-3 leading-none text-magnum-800"
						id="name"
						value="Thomas G. Lopes"
					/>
				</fieldset>
				<fieldset class="mb-4 flex items-center gap-5">
					<label class="w-[90px] text-right text-magnum-800" for="username"> Username </label>
					<input
						class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
						border-solid px-3 leading-none text-magnum-800"
						id="username"
						value="@thomasglopes"
					/>
				</fieldset>
				<div class="mt-[25px] flex justify-end gap-4">
					<button
						{...$close}
						use:close
						class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
					px-4 font-medium leading-none text-zinc-600"
					>
						Cancel
					</button>
					<button
						{...$close}
						use:close
						class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100
					px-4 font-medium leading-none text-magnum-900"
					>
						Save changes
					</button>
				</div>

				<button
					{...$close}
					use:close
					class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
				text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400"
				>
					<X />
				</button>
			</div>
		{/if}
	</div>
</div>
`;
const Tailwind$2 = {
  "index.svelte": tw$1,
  "tailwind.config.ts": TwConfig
};
const CSS$1 = null;
const preview = {
  component: Tailwind$3,
  code: {
    Tailwind: Tailwind$2,
    CSS: CSS$1
  }
};
const tw = `<script lang="ts">
	import { createDialog } from '$lib/builders/dialog';
	import { fade, fly } from 'svelte/transition';
	// Internal helpers
	import X from '~icons/lucide/x';

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
<\/script>

<div>
	<button
		{...$trigger}
		use:trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
			font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75
			focus:outline-none focus:ring focus:ring-magnum-400"
	>
		Open Drawer
	</button>
	<div use:portal>
		{#if $open}
			<div
				{...$overlay}
				class="fixed inset-0 z-20 bg-black/50"
				transition:fade={{ duration: 150 }}
			/>
			<div
				{...$content}
				use:content
				class="fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-white p-[25px] shadow-lg
				focus:outline-none"
				transition:fly={{ x: -350, duration: 300, opacity: 1 }}
			>
				<button
					{...$close}
					use:close
					class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
				text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400 focus:outline-none focus:ring-2 focus:ring-magnum-400"
				>
					<X />
				</button>
				<h2 {...$title} class="mb-0 text-lg font-medium text-black">Notifications</h2>
				<p {...$description} class="mb-5 mt-[10px] leading-normal text-zinc-600">
					Check out your latest updates.
				</p>
				<section>
					<div class="rounded-md bg-gray-100/80 p-4 text-zinc-800 shadow">
						<h3 class="mb-3 text-base font-semibold">New invitation</h3>
						<p class="text-sm">
							You have been invited to join the <strong>Designers</strong> team.
						</p>
						<div class="mt-[25px] flex justify-end gap-4">
							<button
								class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
            px-4 font-medium leading-none text-zinc-600 focus:outline-none focus:ring-2 focus:ring-magnum-400"
							>
								Reject
							</button>
							<button
								class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100
            px-4 font-medium leading-none text-magnum-900 focus:outline-none focus:ring-2 focus:ring-magnum-400"
							>
								Accept
							</button>
						</div>
					</div>
				</section>
			</div>
		{/if}
	</div>
</div>
`;
const Tailwind$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let $overlay, $$unsubscribe_overlay;
  let $content, $$unsubscribe_content;
  let $close, $$unsubscribe_close;
  let $title, $$unsubscribe_title;
  let $description, $$unsubscribe_description;
  const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_overlay = subscribe(overlay, (value) => $overlay = value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_title = subscribe(title, (value) => $title = value);
  $$unsubscribe_description = subscribe(description, (value) => $description = value);
  $$unsubscribe_close = subscribe(close, (value) => $close = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  $$unsubscribe_overlay();
  $$unsubscribe_content();
  $$unsubscribe_close();
  $$unsubscribe_title();
  $$unsubscribe_description();
  return `<div><button${spread(
    [
      escape_object($trigger),
      {
        class: "inline-flex items-center justify-center rounded-md bg-white px-4 py-2 font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75 focus:outline-none focus:ring focus:ring-magnum-400"
      }
    ],
    {}
  )}>Open Drawer</button> <div>${$open ? `<div${spread([escape_object($overlay), { class: "fixed inset-0 z-20 bg-black/50" }], {})}></div> <div${spread(
    [
      escape_object($content),
      {
        class: "fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-white p-[25px] shadow-lg focus:outline-none"
      }
    ],
    {}
  )}><button${spread(
    [
      escape_object($close),
      {
        class: "absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400 focus:outline-none focus:ring-2 focus:ring-magnum-400"
      }
    ],
    {}
  )}>${validate_component(X, "X").$$render($$result, {}, {}, {})}</button> <h2${spread(
    [
      escape_object($title),
      {
        class: "mb-0 text-lg font-medium text-black"
      }
    ],
    {}
  )}>Notifications</h2> <p${spread(
    [
      escape_object($description),
      {
        class: "mb-5 mt-[10px] leading-normal text-zinc-600"
      }
    ],
    {}
  )}>Check out your latest updates.</p> <section data-svelte-h="svelte-16syslf"><div class="rounded-md bg-gray-100/80 p-4 text-zinc-800 shadow"><h3 class="mb-3 text-base font-semibold">New invitation</h3> <p class="text-sm">You have been invited to join the <strong>Designers</strong> team.</p> <div class="mt-[25px] flex justify-end gap-4"><button class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100 px-4 font-medium leading-none text-zinc-600 focus:outline-none focus:ring-2 focus:ring-magnum-400">Reject</button> <button class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100 px-4 font-medium leading-none text-magnum-900 focus:outline-none focus:ring-2 focus:ring-magnum-400">Accept</button></div></div></section></div>` : ``}</div></div>`;
});
const Tailwind = {
  "index.svelte": tw,
  "tailwind.config.ts": TwConfig
};
const CSS = null;
const drawer = {
  component: Tailwind$1,
  code: {
    Tailwind,
    CSS
  }
};
async function load() {
  return {
    preview,
    drawer
  };
}
export {
  load
};
