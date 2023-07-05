import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, f as escape_attribute_value, d as escape, g as add_attribute } from "./ssr.js";
import "./clickOutside.js";
import { c as createRadioGroup } from "./create11.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $item, $$unsubscribe_item;
  let $isChecked, $$unsubscribe_isChecked;
  const { root, item, isChecked } = createRadioGroup({ value: "default" });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$unsubscribe_isChecked = subscribe(isChecked, (value) => $isChecked = value);
  const optionsArr = ["default", "comfortable", "compact"];
  $$unsubscribe_root();
  $$unsubscribe_item();
  $$unsubscribe_isChecked();
  return `<div class="flex items-center justify-center"><div${spread(
    [
      escape_object($root),
      {
        class: "flex flex-col gap-3 data-[orientation=horizontal]:flex-row"
      },
      { "aria-label": "View density" }
    ],
    {}
  )}>${each(optionsArr, (option) => {
    return `<div class="flex items-center gap-3"><button${spread(
      [
        escape_object($item(option)),
        {
          class: "grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm hover:bg-magnum-100"
        },
        { id: escape_attribute_value(option) },
        {
          "aria-labelledby": escape(option, true) + "-label"
        }
      ],
      {}
    )}>${$isChecked(option) ? `<div class="h-3 w-3 rounded-full bg-magnum-500"></div>` : ``}</button> <label class="capitalize leading-none text-white"${add_attribute("for", option, 0)} id="${escape(option, true) + "-label"}">${escape(option)}</label> </div>`;
  })}</div></div>`;
});
export {
  Tailwind as default
};
