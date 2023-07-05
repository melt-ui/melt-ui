import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = "<script>\n	import { createCollapsible } from '@melt-ui/svelte';\n	const { open, root, content, trigger } = createCollapsible();\n<\/script>\n\n<div {...$root}>\n	<button {...$trigger} use:trigger.action>{$open ? 'Close' : 'Open'}</button>\n	<div {...$content}>Obi-Wan says: Hello there!</div>\n</div>\n";
const extensible = `<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import Button from '$components/button.svelte';
	const { open, root, content, trigger } = createCollapsible();
<\/script>

<!-- Using Svelte Scoped Styles -->
<div class="root" {...$root}>
	<!-- Using an external component -->
	<Button on:click={() => console.log('clicked')} {...$trigger} action={trigger.action}>
		{$open ? 'Close' : 'Open'}
	</Button>
	<!-- Using an utility class library, such as Tailwind -->
	<div class="rounded-md p-4 text-orange-500 shadow-sm" {...$content}>
		Obi-Wan says: Hello there!
	</div>
</div>


<style>
    .root {
        display: flex;
        flex-direction: column;
    }
</style>

<!-- Button.svelte -->

<script lang="ts">
	import type { Action } from 'svelte/action';
    export let action: Action
<\/script>

<button use:action>
    <slot />
</button>`;
const animation = `<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';

	const { root, content, trigger } = createCollapsible();
<\/script>

<div {...$root}>
	<button {...$trigger} use:trigger.action> Toggle </button>

	<div class="content" {...$content}>
		<p>sveltejs/svelte</p>
		<p>sveltejs/kit</p>
	</div>
</div>

<style>
	.content {
		display: block !important; /* Ignore the hidden attribute */
		transition: opacity 200ms ease;
	}

	.content[data-state='closed'] {
		opacity: 0;
	}
</style>
`;
const svelteTransitions = `<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { root, content, trigger, open } = createCollapsible();
<\/script>

<div {...$root}>
	<button {...$trigger} use:trigger.action> Toggle </button>

	{#if $open}
		<div class="content" {...$content} transition:slide|local>
			<p>sveltejs/svelte</p>
			<p>sveltejs/kit</p>
		</div>
	{/if}
</div>

<style>
	.content {
		display: block !important; /* Ignore the hidden attribute */
		transition: opacity 200ms ease;
	}

	.content[data-state='closed'] {
		opacity: 0;
	}
</style>
`;
const snippets = {
  builder,
  extensible,
  animation,
  svelteTransitions
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Getting Started`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `Just a few steps to start using MeltUI in your projects`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Installation`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, { class: "mb-2" }, {}, {
    default: () => {
      return `Alright, let&#39;s get started! To install Melt UI into your project, simply run this command in your
	terminal:`;
    }
  })} ${validate_component(Docs.Tabs, "Docs.Tabs").$$render($$result, { tabs: ["npm", "yarn", "pnpm"] }, {}, {
    default: ({ tab }) => {
      return `${tab === "npm" ? `${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: "npm install @melt-ui/svelte" }, {}, {})}` : `${tab === "yarn" ? `${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: "yarn add @melt-ui/svelte" }, {}, {})}` : `${tab === "pnpm" ? `${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: "pnpm install @melt-ui/svelte" }, {}, {})}` : ``}`}`}`;
    }
  })} ${validate_component(Docs.Callout, "Docs.Callout").$$render($$result, {}, {}, {
    default: () => {
      return `P.S. These tabs were built using Melt! Try using them with Arrow keys.`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Melt UI exposes a number of component builders. Say you want a Collapsible component:`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.builder }, {}, {})} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `You&#39;ll see that ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createCollapsible`;
        }
      })}
	exposes a number of stores.

	${validate_component(Docs.Callout, "Docs.Callout").$$render($$result, { type: "danger" }, {}, {
        default: () => {
          return `Be careful! That is not always the case. Sometimes stores also return functions, which may or
		may not expect an attribute. One such example is the ${validate_component(Docs.A, "Docs.A").$$render(
            $$result,
            {
              href: "/docs/builders/accordion",
              internal: true
            },
            {},
            {
              default: () => {
                return `Accordion`;
              }
            }
          )} builder.`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Styling`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Melt UI leaves the styles up to you. Whether you prefer scoped or global CSS, a utility framework
	like Tailwind, or third-party components (as long as you can pass in Melt&#39;s props), it&#39;s all good.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.extensible }, {}, {})} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Animating`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `By passing builder returned props to an element, certain data and aria attributes will
	automatically be altered for you. These changes can then be utilized for animation purposes,
	should you desire to do so.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.animation }, {}, {})} ${validate_component(Docs.Callout, "Docs.Callout").$$render($$result, {}, {}, {
    default: () => {
      return `Svelte transitions can also be utilized. However, it is important to note that this may interfere
	with default functionality in particular components, such as focus management, so proceed with
	caution.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.svelteTransitions }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Need help?`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `In case you&#39;ve run into a bug, an unexpected behaviour, or would like to request new features,
	feel free to ${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://github.com/melt-ui/melt-ui/issues/new/choose"
        },
        {},
        {
          default: () => {
            return `open an issue up on GitHub`;
          }
        }
      )}.`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `You can also reach out to us over on ${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://discord.com/invite/2QDjZkYunf"
        },
        {},
        {
          default: () => {
            return `Discord`;
          }
        }
      )}.`;
    }
  })}`;
});
export {
  Page as default
};
