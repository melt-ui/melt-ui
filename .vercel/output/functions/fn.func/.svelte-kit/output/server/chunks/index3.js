import { c as create_ssr_component, d as escape, a as spread, f as escape_attribute_value, e as escape_object, v as validate_component, b as each, k as add_classes, l as createEventDispatcher, g as add_attribute, s as setContext, h as getContext, m as missing_component } from "./ssr.js";
import { n as null_to_empty, c as compute_rest_props, s as subscribe } from "./utils.js";
import { c as cn } from "./helpers.js";
import { C as Copy } from "./copy.js";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import javascript from "highlight.js/lib/languages/javascript";
import css$6 from "highlight.js/lib/languages/css";
import { i as isSafari } from "./platform.js";
import { B as Balancer } from "./Balancer.js";
import { tv } from "tailwind-variants";
import { C as Check_circle } from "./check-circle.js";
import { E as External_link } from "./external-link.js";
import { w as writable } from "./index2.js";
import "./clickOutside.js";
import { c as createTabs } from "./create8.js";
import { C as Construction } from "./construction.js";
import { c as createSelect, C as Chevron_down } from "./chevron-down.js";
import { C as Check } from "./check.js";
import { c as createSwitch } from "./create3.js";
const kbd_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: "kbd.svelte-14s4ris{display:inline-block;padding:theme('spacing[0.5]') theme('spacing[1.5]');color:theme('colors.neutral.100');white-space:nowrap;margin-block:theme('spacing.1');background-color:theme('colors.neutral.800/0.8');border:solid 1px theme('colors.neutral.500');border-bottom-color:theme('colors.neutral.600');border-radius:theme('borderRadius.DEFAULT');box-shadow:inset 0 -1px 0 theme('colors.neutral.300/0.5');font-size:theme('fontSize.xs')}",
  map: null
};
const Kbd = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  $$result.css.add(css$5);
  return `<kbd class="${escape(null_to_empty(cn(className)), true) + " svelte-14s4ris"}">${slots.default ? slots.default({}) : ``}</kbd>`;
});
const Table_wrap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div class="w-full overflow-auto"><table${spread(
    [
      {
        class: escape_attribute_value(cn("w-full caption-bottom text-sm", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</table></div>`;
});
const Table_body = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<tbody${spread(
    [
      {
        class: escape_attribute_value(cn("[&_tr:last-child]:border-0", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</tbody>`;
});
const Table_cell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<td${spread(
    [
      {
        class: escape_attribute_value(cn("py-4 pr-4", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</td>`;
});
const Table_head = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<th${spread(
    [
      {
        class: escape_attribute_value(cn("h-12 pr-4 text-left font-medium text-neutral-400", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</th>`;
});
const Table_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<thead${spread(
    [
      {
        class: escape_attribute_value(cn("w-full border-b-neutral-600 [&_tr]:border-b", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</thead>`;
});
const Table_row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<tr${spread(
    [
      {
        class: escape_attribute_value(cn("w-full border-b border-b-neutral-600", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</tr>`;
});
const Table = {
  Wrapper: Table_wrap,
  Body: Table_body,
  Cell: Table_cell,
  Head: Table_head,
  Header: Table_header,
  Row: Table_row
};
const Api_table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { head } = $$props;
  let { data } = $$props;
  if ($$props.head === void 0 && $$bindings.head && head !== void 0)
    $$bindings.head(head);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Table.Wrapper, "Table.Wrapper").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Table.Header, "Table.Header").$$render($$result, { class: "table-header-group" }, {}, {
        default: () => {
          return `${validate_component(Table.Row, "Table.Row").$$render($$result, {}, {}, {
            default: () => {
              return `${each(head, (h, i) => {
                return `${validate_component(Table.Head, "Table.Head").$$render(
                  $$result,
                  {
                    class: cn(i === 0 && "w-[35%] pl-0", i === 1 && "w-[45%]", i === 2 && "w-[20%]")
                  },
                  {},
                  {
                    default: () => {
                      return `${escape(h)} `;
                    }
                  }
                )}`;
              })}`;
            }
          })}`;
        }
      })} ${validate_component(Table.Body, "Table.Body").$$render($$result, {}, {}, {
        default: () => {
          return `${each(data, (datum) => {
            return `${validate_component(Table.Row, "Table.Row").$$render($$result, {}, {}, {
              default: () => {
                return `${slots.row ? slots.row({ datum }) : ``} `;
              }
            })}`;
          })}`;
        }
      })}`;
    }
  })}`;
});
const Kbd_table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { head } = $$props;
  let { data } = $$props;
  if ($$props.head === void 0 && $$bindings.head && head !== void 0)
    $$bindings.head(head);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Table.Wrapper, "Table.Wrapper").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Table.Header, "Table.Header").$$render($$result, { class: "table-header-group" }, {}, {
        default: () => {
          return `${validate_component(Table.Row, "Table.Row").$$render($$result, {}, {}, {
            default: () => {
              return `${each(head, (h, i) => {
                return `${validate_component(Table.Head, "Table.Head").$$render(
                  $$result,
                  {
                    class: cn(i === 0 && "w-[20%] pl-0", i === 1 && "w-[80%]")
                  },
                  {},
                  {
                    default: () => {
                      return `${escape(h)} `;
                    }
                  }
                )}`;
              })}`;
            }
          })}`;
        }
      })} ${validate_component(Table.Body, "Table.Body").$$render($$result, {}, {}, {
        default: () => {
          return `${each(data, (datum) => {
            return `${validate_component(Table.Row, "Table.Row").$$render($$result, {}, {}, {
              default: () => {
                return `${slots.row ? slots.row({ datum }) : ``} `;
              }
            })}`;
          })}`;
        }
      })}`;
    }
  })}`;
});
const P = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "sidenote"]);
  let { class: className = void 0 } = $$props;
  let { sidenote = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.sidenote === void 0 && $$bindings.sidenote && sidenote !== void 0)
    $$bindings.sidenote(sidenote);
  return `<p${spread(
    [
      {
        class: escape_attribute_value(cn("my-5 leading-7", sidenote && "text-base italic [&:not(code)]:opacity-60", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</p>`;
});
const H3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<h3${spread(
    [
      {
        class: escape_attribute_value(cn("mt-9 scroll-m-20 text-xl font-semibold", className))
      },
      { "data-toc": true },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</h3>`;
});
const api_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: "code.svelte-c9vfaz{background-color:#27272a;color:#d4d4d8}code.colored.svelte-c9vfaz{background-color:rgb(121 58 21 / 0.5);color:#f9c978}",
  map: null
};
function parseContent(content, codeClass = "") {
  return content.replace(/`([^`]+)`/g, `<code class="${codeClass}">$1</code>`);
}
const Api = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let empty;
  let htmlDescription;
  let { schema } = $$props;
  if ($$props.schema === void 0 && $$bindings.schema && schema !== void 0)
    $$bindings.schema(schema);
  $$result.css.add(css$4);
  empty = !schema.args && !schema.props && !schema.events && !schema.dataAttributes && !schema.keyboardInteractions;
  htmlDescription = parseContent(schema.description);
  return `<div class="mb-12">${validate_component(H3, "H3").$$render($$result, { class: "text-xl font-bold" }, {}, {
    default: () => {
      return `${escape(schema.title)}`;
    }
  })} ${validate_component(P, "P").$$render($$result, { class: "mt-1.5 text-neutral-300/95" }, {}, {
    default: () => {
      return `<!-- HTML_TAG_START -->${htmlDescription}<!-- HTML_TAG_END -->`;
    }
  })} ${empty ? `<p class="mt-4 text-lg text-zinc-400" data-svelte-h="svelte-13lciv4">No props, events or data attributes are explicitly required.</p>` : `${schema.args ? `${validate_component(Api_table, "APITable").$$render(
    $$result,
    {
      head: ["Arg", "Type", "Default"],
      data: schema.args
    },
    {},
    {
      row: ({ datum: d }) => {
        return `${validate_component(Table.Cell, "Table.Cell").$$render($$result, { class: "pl-0" }, {}, {
          default: () => {
            return `<code class="colored svelte-c9vfaz">${escape(d.label)}${escape(d.required ? "*" : "")}</code>`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, { class: "" }, {}, {
          default: () => {
            return `${Array.isArray(d.type) ? `<code class="svelte-c9vfaz">${escape(d.type.join(" | ").replaceAll('"', "'"))}</code>` : `<code class="svelte-c9vfaz">${escape(d.type.replaceAll('"', "'"))}</code>`}`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, { class: "" }, {}, {
          default: () => {
            return `${d.default !== void 0 ? `<code class="svelte-c9vfaz">${escape(d.default)}</code>` : `<span data-svelte-h="svelte-1s4sarz">-</span>`}`;
          }
        })}`;
      }
    }
  )}` : ``} ${schema.props ? `${validate_component(Api_table, "APITable").$$render(
    $$result,
    {
      head: ["Prop", "Type", "Default"],
      data: schema.props
    },
    {},
    {
      row: ({ datum: d }) => {
        return `${validate_component(Table.Cell, "Table.Cell").$$render($$result, { class: "pl-0" }, {}, {
          default: () => {
            return `<code class="colored svelte-c9vfaz">${escape(d.label)}${escape(d.required ? "*" : "")}</code>`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, {}, {}, {
          default: () => {
            return `${Array.isArray(d.type) ? `<code class="svelte-c9vfaz">${escape(d.type.join(" | ").replaceAll('"', "'"))}</code>` : `<code class="svelte-c9vfaz">${escape(d.type.replaceAll('"', "'"))}</code>`} <code class="svelte-c9vfaz">${escape(d.type)}</code>`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, {}, {}, {
          default: () => {
            return `${d.default !== void 0 ? `<code class="svelte-c9vfaz">${escape(d.default)}</code>` : `<span data-svelte-h="svelte-1s4sarz">-</span>`}`;
          }
        })}`;
      }
    }
  )}` : ``}  ${schema.events ? `${schema.props ? `<hr class="col-span-3 h-4 opacity-0">` : ``} ${validate_component(Api_table, "APITable").$$render(
    $$result,
    {
      head: ["Event", "Payload"],
      data: schema.events
    },
    {},
    {
      row: ({ datum: d }) => {
        return `${validate_component(Table.Cell, "Table.Cell").$$render($$result, { class: "pl-0" }, {}, {
          default: () => {
            return `<code class="colored svelte-c9vfaz">${escape(d.label)}</code>`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, {}, {}, {
          default: () => {
            return `${Array.isArray(d.payload) ? `<code class="svelte-c9vfaz">${escape(d.payload.join(" | ").replaceAll('"', "'"))}</code>` : `<span>${escape(d.payload)}</span>`}`;
          }
        })}`;
      }
    }
  )}` : ``}  ${schema.dataAttributes ? `${schema.props || schema.events ? `<hr class="col-span-3 h-4 opacity-0">` : ``} ${validate_component(Api_table, "APITable").$$render(
    $$result,
    {
      head: ["Data Attribute", "Values"],
      data: schema.dataAttributes
    },
    {},
    {
      row: ({ datum: d }) => {
        return `${validate_component(Table.Cell, "Table.Cell").$$render($$result, { class: "pl-0" }, {}, {
          default: () => {
            return `<code class="colored svelte-c9vfaz">${escape(d.label)}</code>`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, {}, {}, {
          default: () => {
            return `${Array.isArray(d.value) ? `<code class="svelte-c9vfaz">${escape(d.value.join(" | ").replaceAll('"', "'"))}</code>` : `${validate_component(P, "P").$$render($$result, { class: "my-0" }, {}, {
              default: () => {
                return `<!-- HTML_TAG_START -->${parseContent(d.value, "neutral")}<!-- HTML_TAG_END -->`;
              }
            })}`}`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, {}, {}, {})}`;
      }
    }
  )}` : ``} ${schema.keyboardInteractions ? `${schema.props || schema.events ? `<hr class="col-span-3 h-4 opacity-0">` : ``} ${validate_component(Kbd_table, "KBDTable").$$render(
    $$result,
    {
      head: ["Key", "Description"],
      data: schema.keyboardInteractions
    },
    {},
    {
      row: ({ datum: d }) => {
        return `${validate_component(Table.Cell, "Table.Cell").$$render($$result, { class: "pl-0" }, {}, {
          default: () => {
            return `${validate_component(Kbd, "Kbd").$$render($$result, {}, {}, {
              default: () => {
                return `${escape(d.key)}`;
              }
            })}`;
          }
        })} ${validate_component(Table.Cell, "Table.Cell").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(P, "P").$$render($$result, { class: "my-0" }, {}, {
              default: () => {
                return `<!-- HTML_TAG_START -->${parseContent(d.description)}<!-- HTML_TAG_END -->`;
              }
            })}`;
          }
        })}`;
      }
    }
  )}` : ``}`} </div>`;
});
const LangTag_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".langtag.svelte-11sh29b{position:relative}.langtag.svelte-11sh29b::after{content:attr(data-language);position:absolute;top:0;right:0;padding:1em;display:flex;align-items:center;justify-content:center;background:var(--langtag-background, inherit);color:var(--langtag-color, inherit);border-radius:var(--langtag-border-radius)}",
  map: null
};
const LangTag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["langtag", "highlighted", "code", "languageName"]);
  let { langtag = false } = $$props;
  let { highlighted } = $$props;
  let { code } = $$props;
  let { languageName = "plaintext" } = $$props;
  if ($$props.langtag === void 0 && $$bindings.langtag && langtag !== void 0)
    $$bindings.langtag(langtag);
  if ($$props.highlighted === void 0 && $$bindings.highlighted && highlighted !== void 0)
    $$bindings.highlighted(highlighted);
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.languageName === void 0 && $$bindings.languageName && languageName !== void 0)
    $$bindings.languageName(languageName);
  $$result.css.add(css$3);
  return `<pre${spread(
    [
      {
        "data-language": escape_attribute_value(languageName)
      },
      escape_object($$restProps)
    ],
    {
      classes: (langtag ? "langtag" : "") + " svelte-11sh29b"
    }
  )}><code${add_classes("hljs".trim())}>${highlighted ? `<!-- HTML_TAG_START -->${highlighted}<!-- HTML_TAG_END -->` : `${escape(code)}`}</code></pre>`;
});
const LangTag$1 = LangTag;
const HighlightSvelte = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let highlighted;
  let $$restProps = compute_rest_props($$props, ["code", "langtag"]);
  let { code } = $$props;
  let { langtag = false } = $$props;
  createEventDispatcher();
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("css", css$6);
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.langtag === void 0 && $$bindings.langtag && langtag !== void 0)
    $$bindings.langtag(langtag);
  highlighted = hljs.highlightAuto(code).value;
  return `${slots.default ? slots.default({ highlighted }) : ` ${validate_component(LangTag$1, "LangTag").$$render($$result, Object.assign({}, $$restProps, { languageName: "svelte" }, { langtag }, { highlighted }, { code }), {}, {})} `}`;
});
const HighlightSvelte$1 = HighlightSvelte;
const codeBlock_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".code-block.svelte-1ugycxs{background:theme('colors.neutral.900/0.9')}.code-block.svelte-1ugycxs .hljs{background:transparent !important;overflow:unset !important}",
  map: null
};
const Code_block = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { code } = $$props;
  let { inline = false } = $$props;
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  $$result.css.add(css$2);
  return `<div class="${escape(null_to_empty(cn("code-block relative rounded-lg", "border border-neutral-300/30", inline ? "inline-block overflow-hidden pr-12" : "my-2")), true) + " svelte-1ugycxs"}"><button class="absolute right-3 top-3 z-10" aria-label="copy">${`<div>${validate_component(Copy, "Copy").$$render($$result, { class: "hover:text-magnum-500" }, {}, {})}</div>`}</button> <div class="${escape(
    null_to_empty(cn("max-h-[17rem] lg:max-h-[25rem]", inline ? "inline-block overflow-hidden" : "overflow-auto")),
    true
  ) + " svelte-1ugycxs"}">${validate_component(HighlightSvelte$1, "HighlightSvelte").$$render($$result, { code, class: "text-sm" }, {}, {})}</div> </div>`;
});
const Description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<p${add_attribute("class", cn("mb-4 mt-2 text-xl text-neutral-400", className), 0)}> ${isSafari() ? `${slots.default ? slots.default({}) : ``}` : `${validate_component(Balancer, "Balancer").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`}</p>`;
});
const previewWrapper_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".comp-preview.svelte-1a06kum{display:flex;align-items:center;background:linear-gradient(315deg, #e47312, #bd5711);border-radius:0.5rem}@media(min-width: 768px){.comp-preview.svelte-1a06kum{padding:3rem\n	}}",
  map: null
};
const Preview_wrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { fullwidth = false } = $$props;
  if ($$props.fullwidth === void 0 && $$bindings.fullwidth && fullwidth !== void 0)
    $$bindings.fullwidth(fullwidth);
  $$result.css.add(css$1);
  return `<div class="comp-preview h-[20rem] overflow-x-auto lg:h-[28rem] lg:overflow-x-hidden svelte-1a06kum"><div class="${escape(null_to_empty(cn("mx-auto max-w-md px-4", fullwidth && "w-full max-w-none")), true) + " svelte-1a06kum"}">${slots.default ? slots.default({}) : ``}</div> </div>`;
});
const H1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<h1${spread(
    [
      {
        class: escape_attribute_value(cn("scroll-m-20 text-4xl font-bold", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</h1>`;
});
const H2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<h2${spread(
    [
      {
        class: escape_attribute_value(cn("mt-11 scroll-m-20 border-b border-b-neutral-600 pb-2 text-2xl font-bold first:mt-0", className))
      },
      { "data-toc": "" },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</h2>`;
});
const Code = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<code>${slots.default ? slots.default({}) : ``}</code>`;
});
const Ul = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "type"]);
  const ulVariants = tv({
    base: "",
    variants: {
      type: {
        icon: "my-5 list-none",
        default: "my-5 ml-6 list-disc"
      }
    },
    defaultVariants: { type: "default" }
  });
  let { class: className = void 0 } = $$props;
  let { type = "default" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `<ul${spread(
    [
      {
        class: escape_attribute_value(cn(ulVariants({ type, className })))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</ul>`;
});
const Li = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "type"]);
  const liVariants = tv({
    base: "mt-2.5",
    variants: {
      type: {
        checked: "flex items-center gap-3",
        default: ""
      }
    },
    defaultVariants: { type: "default" }
  });
  let { class: className = void 0 } = $$props;
  let { type = "default" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `<li${spread(
    [
      {
        class: escape_attribute_value(cn(liVariants({ type, className })))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${type === "checked" ? `${validate_component(Check_circle, "CheckCircle").$$render($$result, { class: "h-6 w-6 text-green-400" }, {}, {})}` : ``} ${slots.default ? slots.default({}) : ``}</li>`;
});
const A = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href } = $$props;
  let { internal = false } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.internal === void 0 && $$bindings.internal && internal !== void 0)
    $$bindings.internal(internal);
  return `<a class="inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:text-neutral-100/80"${add_attribute("href", href, 0)}${add_attribute("target", internal ? void 0 : "_blank", 0)}>${slots.default ? slots.default({}) : ``} ${!internal ? `${validate_component(External_link, "External").$$render($$result, { class: "h-4 w-4" }, {}, {})}` : ``}</a>`;
});
const Hr = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<hr${spread(
    [
      {
        class: escape_attribute_value(cn("my-4 border-neutral-600 md:my-8", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>`;
});
const setTabsContext = (context) => {
  setContext("tabs", context);
};
const getTabsContext = () => getContext("tabs");
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $value, $$unsubscribe_value;
  let { tabs = [] } = $$props;
  const { root, content, list, trigger, value } = createTabs({ value: tabs[0] });
  $$unsubscribe_root = subscribe(root, (value2) => $root = value2);
  $$unsubscribe_value = subscribe(value, (value2) => $value = value2);
  const tabsStore = writable(tabs);
  setTabsContext({ content, list, trigger, tabs: tabsStore });
  if ($$props.tabs === void 0 && $$bindings.tabs && tabs !== void 0)
    $$bindings.tabs(tabs);
  {
    value.set(tabs[0]);
  }
  {
    tabsStore.update(() => tabs);
  }
  $$unsubscribe_root();
  $$unsubscribe_value();
  return `<div${spread([escape_object($root)], {})}>${slots.default ? slots.default({ tab: $value }) : ``}</div>`;
});
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tabs, $$unsubscribe_tabs;
  let $trigger, $$unsubscribe_trigger;
  const { list, trigger, tabs } = getTabsContext();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_tabs = subscribe(tabs, (value) => $tabs = value);
  $$unsubscribe_tabs();
  $$unsubscribe_trigger();
  return `<div${spread([{ class: "flex items-center gap-2" }, escape_object(list)], {})}>${each($tabs, (tab) => {
    return `<button${spread(
      [
        escape_object($trigger(tab)),
        {
          class: "rounded-md border border-transparent bg-neutral-800 px-3 py-1 text-neutral-500 opacity-75 transition hover:opacity-100 focus:!border-magnum-400 focus:!text-magnum-400 data-[state=active]:border-magnum-700 data-[state=active]:text-magnum-600 data-[state=active]:opacity-100"
        }
      ],
      {}
    )}>${escape(tab)} </button>`;
  })}</div>`;
});
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tabs = [] } = $$props;
  if ($$props.tabs === void 0 && $$bindings.tabs && tabs !== void 0)
    $$bindings.tabs(tabs);
  return `${validate_component(Root, "Root").$$render($$result, { tabs }, {}, {
    default: ({ tab }) => {
      return `${validate_component(List, "List").$$render($$result, {}, {}, {})} <div>${slots.default ? slots.default({ tab }) : ``}</div>`;
    }
  })}`;
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
const select_svelte_svelte_type_style_lang = "";
const css = {
  code: ".check.svelte-1stxko5{position:absolute;left:0.5rem;top:50%;translate:0 calc(-50% + 1px)\n}",
  map: null
};
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let $label, $$unsubscribe_label;
  let $menu, $$unsubscribe_menu;
  let $option, $$unsubscribe_option;
  let $isSelected, $$unsubscribe_isSelected;
  let { options = [] } = $$props;
  let { value = options[0].value } = $$props;
  const { label, trigger, menu, option, isSelected, value: localValue } = createSelect({ value });
  $$unsubscribe_label = subscribe(label, (value2) => $label = value2);
  $$unsubscribe_trigger = subscribe(trigger, (value2) => $trigger = value2);
  $$unsubscribe_menu = subscribe(menu, (value2) => $menu = value2);
  $$unsubscribe_option = subscribe(option, (value2) => $option = value2);
  $$unsubscribe_isSelected = subscribe(isSelected, (value2) => $isSelected = value2);
  localValue.subscribe((v) => {
    typeof v === "string" && (value = v);
  });
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  $$result.css.add(css);
  {
    localValue.set(value);
  }
  $$unsubscribe_trigger();
  $$unsubscribe_label();
  $$unsubscribe_menu();
  $$unsubscribe_option();
  $$unsubscribe_isSelected();
  return `<button${spread(
    [
      {
        class: "flex w-[140px] items-center justify-between rounded-md border border-magnum-700 bg-neutral-800 px-3 py-1 text-magnum-600 outline-none transition-opacity hover:opacity-75 focus:!border-magnum-400 focus:!text-magnum-400"
      },
      escape_object($trigger),
      { "aria-label": "Select" }
    ],
    { classes: "svelte-1stxko5" }
  )}>${escape($label || "Select an option")} ${validate_component(Chevron_down, "ChevronDown").$$render($$result, {}, {}, {})}</button> <ul${spread(
    [
      {
        class: "0 z-10 flex max-h-[360px] flex-col overflow-y-auto rounded-md bg-neutral-800 p-1 shadow-md focus:!ring-0"
      },
      escape_object($menu)
    ],
    { classes: "svelte-1stxko5" }
  )}>${each(options, (o) => {
    return `<li${spread(
      [
        {
          class: "relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-500 outline-none focus:!text-magnum-400 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[selected]:text-magnum-600 data-[disabled]:line-through"
        },
        escape_object($option({ ...o }))
      ],
      { classes: "svelte-1stxko5" }
    )}>${$isSelected(o.value) ? `<div class="check svelte-1stxko5">${validate_component(Check, "Check").$$render($$result, {}, {}, {})} </div>` : ``} ${escape(o.label)} </li>`;
  })} </ul>`;
});
const Switch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $isChecked, $$unsubscribe_isChecked;
  let { checked = false } = $$props;
  const { root, isChecked } = createSwitch({ checked });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_isChecked = subscribe(isChecked, (value) => $isChecked = value);
  isChecked.subscribe((value) => {
    checked = value;
  });
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  $$unsubscribe_root();
  $$unsubscribe_isChecked();
  return `<div class="flex items-center justify-end gap-2"><label class="font-semibold text-white" for="code" data-svelte-h="svelte-1w56wgq">View code</label> <button${spread(
    [
      escape_object($root),
      {
        class: "relative h-6 w-11 cursor-default rounded-full bg-magnum-900 outline-none data-[state=checked]:bg-magnum-700"
      },
      { id: "code" }
    ],
    {}
  )}><div class="${"block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform " + escape($isChecked && "translate-x-[22px]", true)}"></div></button></div>`;
});
const Preview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let files;
  let codeOptions;
  let { component } = $$props;
  let { code } = $$props;
  let { fullwidth = false } = $$props;
  let codingStyle = Object.keys(code)[0] ? "Tailwind" : "CSS";
  let codingStyleObj = code[codingStyle];
  const { value } = createSelect({ value: codingStyle });
  value.subscribe((v) => {
    if (v === "Tailwind" || v === "CSS") {
      codingStyle = v;
    }
  });
  let viewCode = false;
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.fullwidth === void 0 && $$bindings.fullwidth && fullwidth !== void 0)
    $$bindings.fullwidth(fullwidth);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        codingStyleObj = code[codingStyle];
      }
    }
    files = codingStyleObj !== null ? Object.keys(codingStyleObj) : [];
    codeOptions = Object.entries(code).map(([key, value2]) => {
      return {
        value: key,
        label: key,
        disabled: value2 === null
      };
    });
    $$rendered = `<div class="mt-4 flex flex-row items-center justify-between"><div class="flex h-10 items-center lg:hidden">${viewCode ? `${validate_component(Select, "Select").$$render(
      $$result,
      { options: codeOptions, value: codingStyle },
      {
        value: ($$value) => {
          codingStyle = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``}</div> <div class="ml-auto">${validate_component(Switch, "Switch").$$render(
      $$result,
      { checked: viewCode },
      {
        checked: ($$value) => {
          viewCode = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div> <div class="relative mt-2 rounded-md">${viewCode ? `${validate_component(Root, "TabsRoot").$$render($$result, { tabs: files }, {}, {
      default: ({ tab }) => {
        return `<div class="flex h-10 flex-col-reverse gap-4 lg:flex-row lg:items-center"><div${add_attribute("class", cn(files.length === 1 && "lg:hidden"), 0)}>${validate_component(List, "TabsList").$$render($$result, {}, {}, {})}</div> <div class="ml-auto hidden lg:block">${validate_component(Select, "Select").$$render(
          $$result,
          { options: codeOptions, value: codingStyle },
          {
            value: ($$value) => {
              codingStyle = $$value;
              $$settled = false;
            }
          },
          {}
        )}</div></div> ${codingStyleObj && codingStyleObj[tab] ? `${validate_component(Code_block, "CodeBlock").$$render($$result, { code: codingStyleObj[tab] }, {}, {})}` : ``}`;
      }
    })}` : `${validate_component(Preview_wrapper, "PreviewWrapper").$$render($$result, { fullwidth }, {}, {
      default: () => {
        return `${validate_component(component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}`;
      }
    })}`}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const H4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<h4${spread(
    [
      {
        class: escape_attribute_value(cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</h4>`;
});
const H5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<h5${spread(
    [
      {
        class: escape_attribute_value(cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</h5>`;
});
const Ol = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<ol${spread(
    [
      {
        class: escape_attribute_value(cn("my-6 ml-6 list-decimal", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</ol>`;
});
const Features = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { features } = $$props;
  if ($$props.features === void 0 && $$bindings.features && features !== void 0)
    $$bindings.features(features);
  return `${validate_component(H3, "H3").$$render($$result, {}, {}, {
    default: () => {
      return `Features`;
    }
  })} ${validate_component(Ul, "Ul").$$render($$result, { type: "icon" }, {}, {
    default: () => {
      return `${each(features, (feature) => {
        return `${validate_component(Li, "Li").$$render($$result, { type: "checked" }, {}, {
          default: () => {
            return `${escape(feature)}`;
          }
        })}`;
      })}`;
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
const Docs = {
  API: Api,
  Callout,
  CodeBlock: Code_block,
  Construction: Construction_1,
  Description,
  Features,
  PreviewWrapper: Preview_wrapper,
  H1,
  H2,
  H3,
  Code,
  P,
  Ul,
  Li,
  Ol,
  H4,
  H5,
  A,
  Hr,
  Tabs,
  TabsRoot: Root,
  TabsList: List,
  Kbd,
  Preview,
  Switch,
  Select
};
export {
  Docs as D
};
