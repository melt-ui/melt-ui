import { T as TwConfig } from "../../../../../chunks/tailwind.config.js";
import { c as create_ssr_component } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/clickOutside.js";
import { c as createLabel } from "../../../../../chunks/create7.js";
const tw = `<script lang="ts">
	import { createLabel } from '@melt-ui/svelte';

	const { root } = createLabel();
<\/script>

<form>
	<div class="flex flex-col gap-0.5">
		<label use:root.action for="email" class="font-medium">
			<span>Email</span>
		</label>
		<input
			type="email"
			id="email"
			class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700"
			placeholder="vanilla@melt-ui.com"
		/>
	</div>
</form>
`;
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createLabel();
  return `<form><div class="flex flex-col items-start justify-center"><label for="email" class="mb-0.5 font-medium" data-melt-part="root" data-svelte-h="svelte-1l654ai"><span>Email</span></label> <input type="text" id="email" class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-900" placeholder="vanilla@melt-ui.com"></div></form>`;
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
