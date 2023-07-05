import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component } from "./ssr.js";
import { c as createCheckbox, M as Minus } from "./minus.js";
import "./clickOutside.js";
import { C as Check } from "./check.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $root, $$unsubscribe_root;
  let $isIndeterminate, $$unsubscribe_isIndeterminate;
  let $isChecked, $$unsubscribe_isChecked;
  let $input, $$unsubscribe_input;
  const { root, input, isChecked, isIndeterminate } = createCheckbox({ checked: "indeterminate" });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  $$unsubscribe_input = subscribe(input, (value) => $input = value);
  $$unsubscribe_isChecked = subscribe(isChecked, (value) => $isChecked = value);
  $$unsubscribe_isIndeterminate = subscribe(isIndeterminate, (value) => $isIndeterminate = value);
  $$unsubscribe_root();
  $$unsubscribe_isIndeterminate();
  $$unsubscribe_isChecked();
  $$unsubscribe_input();
  return `<form><div class="flex items-center justify-center"><button${spread(
    [
      escape_object($root),
      {
        class: "flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75"
      },
      { id: "checkbox" }
    ],
    {}
  )}>${$isIndeterminate ? `${validate_component(Minus, "Minus").$$render($$result, {}, {}, {})}` : `${$isChecked ? `${validate_component(Check, "Check").$$render($$result, {}, {}, {})}` : ``}`} <input${spread([escape_object($input)], {})}></button> <label class="pl-[15px] text-[15px] leading-none text-white" for="checkbox" data-svelte-h="svelte-1lkisay">Accept terms and conditions.</label></div></form>`;
});
export {
  Tailwind as default
};
