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
const snippets = {
  builder,
  extensible
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Introduction`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `An open-source collection of accessible, reusable, and composable component builders and utilities
	for crafting delightful user interfaces with
	${validate_component(Docs.A, "Docs.A").$$render($$result, { href: "https://svelte.dev/" }, {}, {
        default: () => {
          return `Svelte`;
        }
      })}`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Melt UI empowers developers to create accessible UI components that embody their unique style.
	With a strong focus on accessibility, complete styling control, limitless customization options,
	simplified development, and an overall delightful developer experience, Melt UI strives to be the
	ultimate toolkit for crafting exceptional user interfaces.`;
    }
  })} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {
    default: () => {
      return `Melt UI is in its early stages. Expect breaking changes! And lots of new features! 🔥`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Features`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Builder API`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Unlike a traditional component library, Melt UI provides access to builders instead of components.
	Builders are just functions that generate a collection of properties that can be assigned to any
	element or component.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.builder }, {}, {})} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `This is all you need to have a working Collapsible component in your application. The builders
	automatically apply the necessary attributes and event handlers to your element or component.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Accessible by Design`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Melt UI puts accessibility front and center, making sure your UI components are inclusive and
	user-friendly. We follow ${validate_component(Docs.A, "Docs.A").$$render($$result, { href: "https://www.w3.org/WAI/ARIA/apg/" }, {}, {
        default: () => {
          return `WAI-ARIA design patterns`;
        }
      })} and take care of all the nitty-gritty details like aria attributes, role management, focus handling,
	and keyboard navigation. Each builder&#39;s page includes a section on accessibility, with references to
	relevant WAI-ARIA guidelines &amp; instructions for using the builder in an accessible manner.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Bring Your Own Styles`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `The builders ship with zero predefined styles, allowing you to customize them to seamlessly
	integrate with your application&#39;s design system. Whether you prefer vanilla CSS, CSS
	preprocessors, or CSS-in-JS libraries, our components work harmoniously with your preferred
	styling solution.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Open &amp; Extensible`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Melt UI embraces your desire for customization. The builder architecture is open and flexible,
	allowing you to tinker with every aspect of the components. Wrap them, extend their functionality,
	or add event listener and props to tailor them to your exact needs. Consider it your personal UI
	workshop, empowering you to bring your unique vision to life.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Simplified DX`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `We&#39;re here to simplify your development journey. By default, Melt UI components are uncontrolled,
	freeing you from the burden of managing local states. However, if you prefer greater control, you
	can seamlessly switch to controlled components. We handle the behind-the-scenes complexity,
	ensuring a smooth and hassle-free setup. Enjoy a frictionless experience from the get-go.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Typescript &amp; ${validate_component(Docs.A, "Docs.A").$$render($$result, { href: "https://kit.svelte.dev/" }, {}, {
        default: () => {
          return `SvelteKit`;
        }
      })} Support`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Melt UI offers a fully-typed API, safeguarding your code while providing autocompletion
	superpowers in your preferred code editor. All our components share a consistent API, promoting
	familiarity and minimizing surprises. The components are also build with SSR in mind, making them
	a perfect fit for SvelteKit.`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Inspiration &amp; Credits`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `We&#39;re big fans of open source and love working collaboratively. Over time, we&#39;ve taken cues &amp;
	inspiration from some really amazing projects and people that have motivated us to continuously
	improve our ideas.`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Some of the project&#39;s we&#39;ve been inspired by in no particular order:`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `Radix UI - ${validate_component(Docs.A, "Docs.A").$$render($$result, { href: "https://radix-ui.com/" }, {}, {
            default: () => {
              return `Radix UI`;
            }
          })}`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `Skeleton - ${validate_component(Docs.A, "Docs.A").$$render($$result, { href: "https://skeleton.dev" }, {}, {
            default: () => {
              return `https://skeleton.dev`;
            }
          })}`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `Zag - ${validate_component(Docs.A, "Docs.A").$$render($$result, { href: "https://zagjs.com/" }, {}, {
            default: () => {
              return `https://zagjs.com`;
            }
          })}`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `Grail UI - ${validate_component(Docs.A, "Docs.A").$$render($$result, { href: "https://grail-ui.vercel.app/" }, {}, {
            default: () => {
              return `https://grail-ui.vercel.app`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
export {
  Page as default
};
