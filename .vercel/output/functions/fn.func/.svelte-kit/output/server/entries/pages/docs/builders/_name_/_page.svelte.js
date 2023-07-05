import { c as compute_rest_props, n as null_to_empty, s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component, d as escape, b as each, g as add_attribute, m as missing_component } from "../../../../../chunks/ssr.js";
import { c as cn$1 } from "../../../../../chunks/utils2.js";
/* empty css                              */import "../../../../../chunks/clickOutside.js";
import { c as createSeparator } from "../../../../../chunks/create2.js";
import "../../../../../chunks/select.svelte_svelte_type_style_lang.js";
import { p as page } from "../../../../../chunks/stores.js";
import { D as Description, T as Table_of_contents } from "../../../../../chunks/description.js";
import { c as createSelect, C as Chevron_down } from "../../../../../chunks/chevron-down.js";
import { c as cn } from "../../../../../chunks/helpers.js";
import { C as Copy } from "../../../../../chunks/copy.js";
import { C as Check } from "../../../../../chunks/check.js";
import { c as createSwitch } from "../../../../../chunks/create3.js";
import { R as Root, L as List } from "../../../../../chunks/list.js";
import { C as Check_circle } from "../../../../../chunks/check-circle.js";
import "clsx";
import "shiki-es";
import { H as H2 } from "../../../../../chunks/h2.js";
const Code_block = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `<div${spread([escape_object($$restProps), { "data-rehype-pretty-code-fragment": true }], {})}>${slots.default ? slots.default({}) : ``}</div> <button class="absolute right-5 top-16 z-10" aria-label="copy" data-code-copy>${`<div>${validate_component(Copy, "Copy").$$render($$result, { class: "hover:text-magnum-500" }, {}, {})}</div>`}</button>`;
});
const css$1 = {
  code: ".comp-preview.svelte-1a06kum{display:flex;align-items:center;background:linear-gradient(315deg, #e47312, #bd5711);border-radius:0.5rem}@media(min-width: 768px){.comp-preview.svelte-1a06kum{padding:3rem\n	}}",
  map: null
};
const Preview_wrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="comp-preview h-[20rem] overflow-x-auto lg:h-[28rem] lg:overflow-x-hidden svelte-1a06kum"><div class="${escape(null_to_empty(cn("mx-auto w-full px-4")), true) + " svelte-1a06kum"}">${slots.default ? slots.default({}) : ``}</div> </div>`;
});
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
  )}>${$label === "css" ? `CSS` : `${$label === "tailwind" ? `Tailwind` : `Select an option`}`} ${validate_component(Chevron_down, "ChevronDown").$$render($$result, {}, {}, {})}</button> <ul${spread(
    [
      {
        class: "0 z-10 flex max-h-[360px] flex-col overflow-y-auto rounded-md bg-neutral-800 p-1 shadow-md"
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
    )}>${$isSelected(o.value) ? `<div class="check svelte-1stxko5">${validate_component(Check, "Check").$$render($$result, {}, {}, {})} </div>` : ``} ${o.label === "css" ? `CSS` : `${o.label === "tailwind" ? `Tailwind` : ``}`} </li>`;
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
  let { code } = $$props;
  let codingStyle = Object.keys(code)[0] ? "tailwind" : "css";
  let codingStyleObj = code[codingStyle];
  const { value } = createSelect({ value: codingStyle });
  value.subscribe((v) => {
    if (v === "tailwind" || v === "css") {
      codingStyle = v;
    }
  });
  let viewCode = false;
  const fileList = ["index.svelte", "tailwind.config.ts", "globals.css"];
  function isFileName(key) {
    return fileList.includes(key);
  }
  if ($$props.code === void 0 && $$bindings.code && code !== void 0)
    $$bindings.code(code);
  if ($$props.isFileName === void 0 && $$bindings.isFileName && isFileName !== void 0)
    $$bindings.isFileName(isFileName);
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
        return `<div class="flex h-10 flex-col-reverse gap-4 lg:flex-row lg:items-center"><div${add_attribute("class", cn(files.length === 1 && "lg:hidden"), 0)}>${validate_component(List, "TabsList").$$render($$result, {}, {}, {})}</div> <div class="ml-auto hidden lg:block">${codeOptions.length > 1 ? `${validate_component(Select, "Select").$$render(
          $$result,
          { options: codeOptions, value: codingStyle },
          {
            value: ($$value) => {
              codingStyle = $$value;
              $$settled = false;
            }
          },
          {}
        )}` : ``}</div></div> ${isFileName(tab) ? `${codingStyleObj && codingStyleObj[tab] ? `${validate_component(Code_block, "CodeBlock").$$render($$result, {}, {}, {
          default: () => {
            return `<!-- HTML_TAG_START -->${codingStyleObj[tab]}<!-- HTML_TAG_END -->`;
          }
        })}` : ``}` : ``}`;
      }
    })}` : `${validate_component(Preview_wrapper, "PreviewWrapper").$$render($$result, {}, {}, {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    })}`}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const Features = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["features"]);
  let { features } = $$props;
  if ($$props.features === void 0 && $$bindings.features && features !== void 0)
    $$bindings.features(features);
  return `${validate_component(H2, "H2").$$render($$result, {}, {}, {
    default: () => {
      return `Features`;
    }
  })} <ul class="my-5 list-none">${each(features, (feature) => {
    return `<li${spread([{ class: "mt-2.5 flex items-center gap-3" }, escape_object($$restProps)], {})}>${validate_component(Check_circle, "CheckCircle").$$render($$result, { class: "h-6 w-6 text-green-400" }, {}, {})} ${escape(feature)} </li>`;
  })}</ul>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let component;
  let doc;
  let snippets;
  let mainPreview;
  let builderData;
  let $separator, $$unsubscribe_separator;
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  const { root: separator } = createSeparator();
  $$unsubscribe_separator = subscribe(separator, (value) => $separator = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  component = data.component;
  doc = data.metadata;
  snippets = data.snippets;
  mainPreview = data.mainPreview;
  builderData = data.builderData;
  $$unsubscribe_separator();
  $$unsubscribe_page();
  return `<main class="relative px-2 py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_240px]"><div class="mx-auto w-full min-w-0"><div class="space-y-2"><h1${add_attribute("class", cn$1("scroll-m-20 text-4xl font-bold tracking-tight"), 0)}>${escape(doc.title)}</h1> ${doc.description ? `${validate_component(Description, "Description").$$render($$result, {}, {}, {
    default: () => {
      return `${escape(doc.description)}`;
    }
  })}` : ``}</div> <div${spread([escape_object($separator), { class: "my-4 md:my-6" }], {})}></div> <div class="mdsvex" id="mdsvex">${validate_component(Preview, "Preview").$$render($$result, { code: snippets.main, fullwidth: true }, {}, {
    default: () => {
      return `${validate_component(mainPreview || missing_component, "svelte:component").$$render($$result, {}, {}, {})}`;
    }
  })} ${validate_component(Features, "Features").$$render($$result, { features: builderData.features }, {}, {})} ${validate_component(component || missing_component, "svelte:component").$$render($$result, { snippets }, {}, {})}</div> <div${spread([escape_object($separator), { class: "my-4 md:my-6" }], {})}></div> </div> <div class="hidden text-sm xl:block"><div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">${validate_component(Table_of_contents, "TOC").$$render($$result, {}, {}, {})}</div></div></main>`;
});
export {
  Page as default
};
