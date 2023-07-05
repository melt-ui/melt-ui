import { c as create_ssr_component, a as spread, f as escape_attribute_value, e as escape_object, v as validate_component } from "./ssr.js";
import { L as Layout } from "./layout.js";
import { A, P, H as H3, a as Pre } from "./pre.js";
import "clsx";
import "shiki-es";
import { H as H2 } from "./h2.js";
/* empty css          */import { c as compute_rest_props } from "./utils.js";
import { c as cn } from "./utils2.js";
import "./clickOutside.js";
import "./select.svelte_svelte_type_style_lang.js";
import { C as Construction } from "./construction.js";
const Li = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<li${spread(
    [
      {
        class: escape_attribute_value(cn("mt-2", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</li>`;
});
const Ul = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<ul${spread(
    [
      {
        class: escape_attribute_value(cn("my-6 ml-6 list-disc", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</ul>`;
});
const Construction_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="my-4 flex flex-col items-start gap-2 rounded-md border border-magnum-500 bg-magnum-500/10 p-4 lg:flex-row lg:items-center">${validate_component(Construction, "Construction").$$render(
    $$result,
    {
      class: "shrink-0 text-magnum-300 square-8 lg:square-6"
    },
    {},
    {}
  )} <p><span class="font-bold" data-svelte-h="svelte-k325yo">In Construction:</span> ${slots.default ? slots.default({}) : `
			This page is still a WIP. Please check back later, or help us by contributing to
			${validate_component(A, "A").$$render(
    $$result,
    {
      href: "https://github.com/melt-ui/melt-ui"
    },
    {},
    {
      default: () => {
        return `Melt UI`;
      }
    }
  )}.
		`}</p></div>`;
});
const metadata = {
  "title": "Introduction",
  "description": "An open-source collection of accessible & customizable component builders for creating user interfaces with Svelte."
};
const Introduction = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Melt UI empowers developers to create accessible UIs that embody their unique
style. With a strong focus on accessibility, limitless customization options,
and an overall delightful developer experience, Melt UI strives to be the
de-facto headless UI library for Svelte.`;
        }
      })} ${validate_component(Construction_1, "Construction").$$render($$result, {}, {}, {
        default: () => {
          return `Melt UI is in its early stages. Expect breaking changes! And lots of new stuff! 🚀`;
        }
      })} ${validate_component(H2, "Components.h2").$$render($$result, {}, {}, {
        default: () => {
          return `Features`;
        }
      })} ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `Builder API`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Unlike a traditional component library, Melt UI provides access to builders
instead of components. Builders are just functions that generate a collection of
properties that can be assigned to any element or component.`;
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
<span class="line--highlighted" data-line="" data-highlighted-line=""><span style="color: #E1E4E8">  </span><span style="color: #F97583">const</span><span style="color: #E1E4E8"> { </span><span style="color: #79B8FF">open</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">root</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">content</span><span style="color: #E1E4E8">, </span><span style="color: #79B8FF">trigger</span><span style="color: #E1E4E8"> } </span><span style="color: #F97583">=</span><span style="color: #E1E4E8"> </span><span style="color: #B392F0">createCollapsible</span><span style="color: #E1E4E8">();</span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">script</span><span style="color: #E1E4E8">></span></span>
<span data-line=""> </span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span data-highlighted-chars-wrapper="" data-highlighted-chars="" data-chars-id="hi"><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$root</span><span style="color: #B392F0">}</span></span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8"> </span><span data-highlighted-chars-wrapper="" data-highlighted-chars="" data-chars-id="hi"><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$trigger</span><span style="color: #B392F0">}</span></span><span style="color: #E1E4E8"> </span><span data-highlighted-chars-wrapper="" data-highlighted-chars="" data-chars-id="hi"><span style="color: #F97583">use</span><span style="color: #E1E4E8">:</span><span style="color: #FFAB70">trigger</span><span style="color: #E1E4E8">.</span><span style="color: #B392F0">action</span></span><span style="color: #E1E4E8">>{$open </span><span style="color: #F97583">?</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'Close'</span><span style="color: #E1E4E8"> </span><span style="color: #F97583">:</span><span style="color: #E1E4E8"> </span><span style="color: #9ECBFF">'Open'</span><span style="color: #E1E4E8">}&#x3C;/</span><span style="color: #85E89D">button</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">  &#x3C;</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8"> </span><span data-highlighted-chars-wrapper="" data-highlighted-chars="" data-chars-id="hi"><span style="color: #B392F0">{</span><span style="color: #F97583">...</span><span style="color: #E1E4E8">$content</span><span style="color: #B392F0">}</span></span><span style="color: #E1E4E8">>Obi-Wan says: Hello there!&#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span>
<span data-line=""><span style="color: #E1E4E8">&#x3C;/</span><span style="color: #85E89D">div</span><span style="color: #E1E4E8">></span></span></code>`}<!-- HTML_TAG_END -->`;
          }
        }
      )}</div> ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `This is all you need to have a working Collapsible component in your
application. The builders automatically apply the necessary attributes and event
handlers to your element or component.`;
        }
      })} ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `Accessible by Design`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Melt UI puts accessibility front and center, making sure your UI components are
inclusive and user-friendly. We follow
${validate_component(A, "Components.a").$$render(
            $$result,
            {
              href: "https://www.w3.org/WAI/ARIA/apg/",
              rel: "nofollow"
            },
            {},
            {
              default: () => {
                return `WAI-ARIA design patterns`;
              }
            }
          )} and take care of
all the nitty-gritty details like aria attributes, role management, focus
handling, and keyboard navigation. Each builder&#39;s page includes a section on
accessibility, with references to relevant WAI-ARIA guidelines &amp; instructions
for using the builder in an accessible manner.`;
        }
      })} ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `Bring Your Own Styles`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `The builders ship with zero predefined styles, allowing you to customize them to
seamlessly integrate with your application&#39;s design system. Whether you prefer
vanilla CSS, CSS preprocessors, or CSS-in-JS libraries, our components work
harmoniously with your preferred styling solution.`;
        }
      })} ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `Open &amp; Extensible`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Melt UI embraces your desire for customization. The builder architecture is open
and flexible, allowing you to tinker with every aspect of the components. Wrap
them, extend their functionality, or add event listener and props to tailor them
to your exact needs.`;
        }
      })} ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `Simplified DX`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `We want to simplify your development workflow. By default, Melt UI components
are uncontrolled, freeing you from the burden of managing local states. However,
if you prefer greater control, you can switch to controlled components. We
handle the behind-the-scenes complexity, ensuring a smooth developer experience.`;
        }
      })} ${validate_component(H3, "Components.h3").$$render($$result, {}, {}, {
        default: () => {
          return `TypeScript &amp; SvelteKit Support`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Melt UI offers a fully-typed API, safeguarding your code while providing
autocompletion superpowers in your preferred code editor. All our components
share a consistent API, promoting familiarity and minimizing surprises. The
components are also build with SSR in mind, making them a perfect fit for
SvelteKit.`;
        }
      })} ${validate_component(H2, "Components.h2").$$render($$result, {}, {}, {
        default: () => {
          return `Inspiration &amp; Credits`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `We&#39;re big fans of open source and love working collaboratively. Over time, we&#39;ve
taken cues &amp; inspiration from some really amazing projects and people that have
motivated us to continuously improve our ideas.`;
        }
      })} ${validate_component(P, "Components.p").$$render($$result, {}, {}, {
        default: () => {
          return `Some of the project&#39;s we&#39;ve been inspired by in no particular order:`;
        }
      })} ${validate_component(Ul, "Components.ul").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Li, "Components.li").$$render($$result, {}, {}, {
            default: () => {
              return `Zag - ${validate_component(A, "Components.a").$$render(
                $$result,
                {
                  href: "https://zagjs.com",
                  rel: "nofollow"
                },
                {},
                {
                  default: () => {
                    return `https://zagjs.com`;
                  }
                }
              )}`;
            }
          })} ${validate_component(Li, "Components.li").$$render($$result, {}, {}, {
            default: () => {
              return `Radix UI - ${validate_component(A, "Components.a").$$render(
                $$result,
                {
                  href: "https://radix-ui.com",
                  rel: "nofollow"
                },
                {},
                {
                  default: () => {
                    return `https://radix-ui.com`;
                  }
                }
              )}`;
            }
          })} ${validate_component(Li, "Components.li").$$render($$result, {}, {}, {
            default: () => {
              return `Grail UI - ${validate_component(A, "Components.a").$$render(
                $$result,
                {
                  href: "https://grail-ui.com",
                  rel: "nofollow"
                },
                {},
                {
                  default: () => {
                    return `https://grail-ui.com`;
                  }
                }
              )}`;
            }
          })} ${validate_component(Li, "Components.li").$$render($$result, {}, {}, {
            default: () => {
              return `Skeleton - ${validate_component(A, "Components.a").$$render(
                $$result,
                {
                  href: "https://skeleton.dev",
                  rel: "nofollow"
                },
                {},
                {
                  default: () => {
                    return `https://skeleton.dev`;
                  }
                }
              )}`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
export {
  Introduction as default,
  metadata
};
