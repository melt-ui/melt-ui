import { c as create_ssr_component, v as validate_component, g as add_attribute } from "./ssr.js";
import { L as Layout } from "./layout.js";
import { P, a as Pre, H as H3, A } from "./pre.js";
import "clsx";
import "shiki-es";
import { H as H2 } from "./h2.js";
/* empty css          */import "./clickOutside.js";
import "./select.svelte_svelte_type_style_lang.js";
import { tv } from "tailwind-variants";
import { c as cn } from "./utils2.js";
import { R as Root, L as List } from "./list.js";
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tabs = [] } = $$props;
  if ($$props.tabs === void 0 && $$bindings.tabs && tabs !== void 0)
    $$bindings.tabs(tabs);
  return `${validate_component(Root, "Root").$$render($$result, { tabs }, {}, {
    default: ({ tab }) => {
      return `${validate_component(List, "List").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({ tab }) : ``}`;
    }
  })}`;
});
const Callout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const calloutVariants = tv({
    base: 'relative rounded-tr-md rounded-br-md px-5 py-3 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:content-[""] my-6 text-sm',
    variants: {
      type: {
        default: "before:bg-magnum-700 bg-magnum-700/10 text-white border-magnum-700",
        info: "before:bg-blue-500 bg-blue-500/10 text-white border-blue-500",
        warning: "before:bg-yellow-500 bg-yellow-500/10 text-white border-yellow-500",
        danger: "before:bg-red-500 bg-red-500/10 text-white border-red-500",
        success: "before:bg-green-500 bg-green-500/10 text-white border-green-500"
      }
    }
  });
  let { class: className = void 0 } = $$props;
  let { type = "default" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `<div${add_attribute("class", cn(calloutVariants({ type, className })), 0)}><p>${slots.default ? slots.default({}) : ``}</p></div>`;
});
const Install_tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Tabs, "Tabs").$$render($$result, { tabs: ["npm", "yarn", "pnpm"] }, {}, {
    default: ({ tab }) => {
      return `${tab === "npm" ? `${slots.npm ? slots.npm({}) : ``}` : `${tab === "yarn" ? `${slots.yarn ? slots.yarn({}) : ``}` : `${tab === "pnpm" ? `${slots.pnpm ? slots.pnpm({}) : ``}` : ``}`}`}`;
    }
  })}`;
});
const metadata = {
  "title": "Getting Started",
  "description": "It only takes a few lines of code to get started building components with Melt UI."
};
const Getting_started = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `${validate_component(H2, "Components.h2").$$render($$result, {}, {}, {
        default: () => {
          return `Installation`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Install Melt UI with your package manager of choice.`;
        }
      })} ${validate_component(Install_tabs, "InstallTabs").$$render($$result, {}, {}, {
        pnpm: () => {
          return `<span slot="pnpm"><div data-rehype-pretty-code-fragment>${validate_component(Pre, "Components.pre").$$render(
            $$result,
            {
              "data-language": "bash",
              "data-theme": "default"
            },
            {},
            {
              default: () => {
                return `<!-- HTML_TAG_START -->${`<code data-language="bash" data-theme="default"><span data-line=""><span style="color: #B392F0">pnpm</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">install</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF" data-highlighted-chars="" data-chars-id="melt">@melt-ui</span><span style="color: #9ECBFF">/</span><span style="color: #9ECBFF" data-highlighted-chars="" data-chars-id="melt">svelte</span></span></code>`}<!-- HTML_TAG_END -->`;
              }
            }
          )}</div></span>`;
        },
        yarn: () => {
          return `<span slot="yarn"><div data-rehype-pretty-code-fragment>${validate_component(Pre, "Components.pre").$$render(
            $$result,
            {
              "data-language": "bash",
              "data-theme": "default"
            },
            {},
            {
              default: () => {
                return `<!-- HTML_TAG_START -->${`<code data-language="bash" data-theme="default"><span data-line=""><span style="color: #B392F0">yarn</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">add</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF" data-highlighted-chars="" data-chars-id="melt">@melt-ui</span><span style="color: #9ECBFF">/</span><span style="color: #9ECBFF" data-highlighted-chars="" data-chars-id="melt">svelte</span></span></code>`}<!-- HTML_TAG_END -->`;
              }
            }
          )}</div></span>`;
        },
        npm: () => {
          return `<span slot="npm"><div data-rehype-pretty-code-fragment>${validate_component(Pre, "Components.pre").$$render(
            $$result,
            {
              "data-language": "bash",
              "data-theme": "default"
            },
            {},
            {
              default: () => {
                return `<!-- HTML_TAG_START -->${`<code data-language="bash" data-theme="default"><span data-line=""><span style="color: #B392F0">npm</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">install</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF" data-highlighted-chars="" data-chars-id="melt">@melt-ui</span><span style="color: #9ECBFF">/</span><span style="color: #9ECBFF" data-highlighted-chars="" data-chars-id="melt">svelte</span></span></code>`}<!-- HTML_TAG_END -->`;
              }
            }
          )}</div></span>`;
        }
      })} ${validate_component(Callout, "Callout").$$render($$result, {}, {}, {
        default: () => {
          return `P.S. These tabs were built using Melt! Try using them with the arrow keys.`;
        }
      })} ${validate_component(H2, "Components.h2").$$render($$result, {}, {}, {
        default: () => {
          return `Usage`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Melt UI exposes a number of component builders. Let&#39;s say you want a Collapsible
component:`;
        }
      })} <div data-rehype-pretty-code-fragment>${validate_component(Pre, "Components.pre").$$render(
        $$result,
        {
          "data-language": "svelte",
          "data-theme": "default"
        },
        {},
        {
          default: () => {
            return `<!-- HTML_TAG_START -->${`<code data-language="svelte" data-theme="default"><span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">import</span><span style="color: #E1E4E8"> { createCollapsible } </span><span style="color: #F97583">from</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'@melt-ui/svelte'</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">const</span><span style="color: #E1E4E8"> { </span><span style="color: #79B8FF">open</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">root</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">content</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">trigger</span><span style="color: #E1E4E8"> } </span><span style="color: #F97583">=</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">createCollapsible</span><span style="color: #E1E4E8">();</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$root</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$trigger</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">use</span><span style="color: #E1E4E8">:</span><span style="color: #FFAB70">trigger</span><span style="color: #E1E4E8">.</span><span style="color: #B392F0">action</span><span style="color: #E1E4E8">>{$open </span><span style="color: #F97583">?</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'Close'</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">:</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'Open'</span><span style="color: #E1E4E8">}&#x3C;/</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$content</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8">>Obi-Wan says: Hello there!&#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span></code>`}<!-- HTML_TAG_END -->`;
          }
        }
      )}</div> ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `You&#39;ll see that <code data-svelte-h="svelte-1exohvm">createCollapsible</code> returns an object with a couple of
properties. Some of these are stores, and others are stores that return
functions. The stores are used to manage the state of the component, and the
functions are used to pass arguments to the element.`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Each component is different, so be sure to check out the documentation before
attempting to use one.`;
        }
      })} ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `Styling`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Melt UI leaves the styling up to you. Whether you prefer scoped or global CSS, a
utility framework like ${validate_component(A, "Components.a").$$render(
            $$result,
            {
              href: "https://tailwindcss.com",
              rel: "nofollow"
            },
            {},
            {
              default: () => {
                return `TailwindCSS`;
              }
            }
          )}, or third-party
components, as long as you can pass in Melt&#39;s props, it&#39;s all good.`;
        }
      })} <div data-rehype-pretty-code-fragment>${validate_component(Pre, "Components.pre").$$render(
        $$result,
        {
          "data-language": "svelte",
          "data-theme": "default"
        },
        {},
        {
          default: () => {
            return `<!-- HTML_TAG_START -->${`<code data-language="svelte" data-theme="default"><span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">import</span><span style="color: #E1E4E8"> { createCollapsible } </span><span style="color: #F97583">from</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'@melt-ui/svelte'</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">import</span><span style="color: #E1E4E8"> Button </span><span style="color: #F97583">from</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'$components/button.svelte'</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">const</span><span style="color: #E1E4E8"> { </span><span style="color: #79B8FF">open</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">root</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">content</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">trigger</span><span style="color: #E1E4E8"> } </span><span style="color: #F97583">=</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">createCollapsible</span><span style="color: #E1E4E8">();</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #6A737D">&#x3C;!-- Using Svelte Scoped Styles --></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">class</span><span style="color: #E1E4E8">=</span><span style="color: #9ECBFF">"root"</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$root</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #6A737D">&#x3C;!-- Using an external component --></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #79B8FF">Button</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">on</span><span style="color: #E1E4E8">:</span><span style="color: #B392F0">click</span><span style="color: #E1E4E8">={() </span><span style="color: #F97583">=></span><span style="color: #E1E4E8"> console.</span><span style="color: #B392F0">log</span><span style="color: #E1E4E8">(</span><span style="color: #9ECBFF">'clicked'</span><span style="color: #E1E4E8">)} </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$trigger</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">action</span><span style="color: #E1E4E8">={trigger.action}></span></span>
<span data-line=""><span style="color: #E1E4E8">  {$open </span><span style="color: #F97583">?</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'Close'</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">:</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'Open'</span><span style="color: #E1E4E8">}</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #79B8FF">Button</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #6A737D">&#x3C;!-- Using an utility class library, such as Tailwind --></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">class</span><span style="color: #E1E4E8">=</span><span style="color: #9ECBFF">"rounded-md p-4 text-orange-500 shadow-sm"</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$content</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  Obi-Wan says: Hello there!</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">style</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #B392F0">.root</span><span style="color: #E1E4E8"> {</span></span>
<span data-line=""><span style="color: #E1E4E8">    </span><span style="color: #79B8FF">display</span><span style="color: #E1E4E8">: </span><span style="color: #79B8FF">flex</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">    </span><span style="color: #79B8FF">flex-direction</span><span style="color: #E1E4E8">: </span><span style="color: #79B8FF">column</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  }</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">style</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #6A737D">&#x3C;!-- Button.svelte --></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">import</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">type</span><span style="color: #E1E4E8"> { Action } </span><span style="color: #F97583">from</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'svelte/action'</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">export</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">let</span><span style="color: #E1E4E8"> action</span><span style="color: #F97583">:</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">Action</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">use</span><span style="color: #E1E4E8">:</span><span style="color: #FFAB70">action</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;</span><span style="color: #F97583">slot</span><span style="color: #E1E4E8"> /></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8">></span></span></code>`}<!-- HTML_TAG_END -->`;
          }
        }
      )}</div> ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `Animations`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `By passing the builder returned props to an element, certain data and aria
attributes will automatically be added/and or altered for you. These changes can
then be used for animation purposes, should you desire to do so.`;
        }
      })} <div data-rehype-pretty-code-fragment>${validate_component(Pre, "Components.pre").$$render(
        $$result,
        {
          "data-language": "svelte",
          "data-theme": "default"
        },
        {},
        {
          default: () => {
            return `<!-- HTML_TAG_START -->${`<code data-language="svelte" data-theme="default"><span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">import</span><span style="color: #E1E4E8"> { createCollapsible } </span><span style="color: #F97583">from</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'@melt-ui/svelte'</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">const</span><span style="color: #E1E4E8"> { </span><span style="color: #79B8FF">root</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">content</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">trigger</span><span style="color: #E1E4E8"> } </span><span style="color: #F97583">=</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">createCollapsible</span><span style="color: #E1E4E8">();</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$root</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$trigger</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">use</span><span style="color: #E1E4E8">:</span><span style="color: #FFAB70">trigger</span><span style="color: #E1E4E8">.</span><span style="color: #B392F0">action</span><span style="color: #E1E4E8">> Toggle &#x3C;/</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">class</span><span style="color: #E1E4E8">=</span><span style="color: #9ECBFF">"content"</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$content</span><span style="color: #B392F0">}</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">    &#x3C;</span><span style="color: #85E89D">p</span><span style="color: #E1E4E8">>sveltejs/svelte&#x3C;/</span><span style="color: #85E89D">p</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">    &#x3C;</span><span style="color: #85E89D">p</span><span style="color: #E1E4E8">>sveltejs/kit&#x3C;/</span><span style="color: #85E89D">p</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">style</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #B392F0">.content</span><span style="color: #E1E4E8"> {</span></span>
<span data-line=""><span style="color: #E1E4E8">    </span><span style="color: #79B8FF">display</span><span style="color: #E1E4E8">: </span><span style="color: #79B8FF">block</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">!important</span><span style="color: #E1E4E8">; </span><span style="color: #6A737D">/* Ignore the hidden attribute */</span></span>
<span data-line=""><span style="color: #E1E4E8">    </span><span style="color: #79B8FF">transition</span><span style="color: #E1E4E8">: opacity </span><span style="color: #79B8FF">200</span><span style="color: #F97583">ms</span><span style="color: #E1E4E8"> </span><span style="color: #79B8FF">ease</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  }</span></span>
<span data-line=""><span style="color: #E1E4E8">  </span><span style="color: #B392F0">.content</span><span style="color: #E1E4E8">[</span><span style="color: #B392F0">data-state</span><span style="color: #F97583">=</span><span style="color: #9ECBFF">'closed'</span><span style="color: #E1E4E8">] {</span></span>
<span data-line=""><span style="color: #E1E4E8">    </span><span style="color: #79B8FF">opacity</span><span style="color: #E1E4E8">: </span><span style="color: #79B8FF">0</span><span style="color: #E1E4E8">;</span></span>
<span data-line=""><span style="color: #E1E4E8">  }</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">style</span><span style="color: #E1E4E8">></span></span></code>`}<!-- HTML_TAG_END -->`;
          }
        }
      )}</div> ${validate_component(Callout, "Callout").$$render($$result, {}, {}, {
        default: () => {
          return `Svelte transitions can also be utilized. However, it is important to note that this may interfere with default functionality in particular components, such as focus management, so proceed with caution.`;
        }
      })} ${validate_component(H2, "Components.h2").$$render($$result, {}, {}, {
        default: () => {
          return `Need help?`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `If you run into any bugs, or would like to request a feature, please feel free
to ${validate_component(A, "Components.a").$$render(
            $$result,
            {
              href: "https://github.com/melt-ui/melt-ui/issues/new",
              rel: "nofollow"
            },
            {},
            {
              default: () => {
                return `open an issue`;
              }
            }
          )} on GitHub.`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `You can also reach out to us on ${validate_component(A, "Components.a").$$render(
            $$result,
            {
              href: "https://discord.gg/cee8gHrznd",
              rel: "nofollow"
            },
            {},
            {
              default: () => {
                return `Discord`;
              }
            }
          )} if you
have any questions or just want to chat.`;
        }
      })}`;
    }
  })}`;
});
export {
  Getting_started as default,
  metadata
};
