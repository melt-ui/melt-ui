import { s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, b as each, f as escape_attribute_value, d as escape } from "./ssr.js";
import { c as createAccordion } from "./create4.js";
import "./clickOutside.js";
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $item, $$unsubscribe_item;
  let $trigger, $$unsubscribe_trigger;
  let $isSelected, $$unsubscribe_isSelected;
  let $content, $$unsubscribe_content;
  const { content, item, trigger, isSelected, root } = createAccordion();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_isSelected = subscribe(isSelected, (value) => $isSelected = value);
  const items = [
    {
      id: "item-1",
      title: "Is it accessible?",
      description: "Yes. It adheres to the WAI-ARIA design pattern."
    },
    {
      id: "item-2",
      title: "Is it unstyled?",
      description: "Yes. It's unstyled by default, giving you freedom over the look & feel."
    },
    {
      id: "item-3",
      title: "Can it be animated?",
      description: "Yes! You can use the transition prop to configure the animation."
    }
  ];
  $$unsubscribe_item();
  $$unsubscribe_trigger();
  $$unsubscribe_isSelected();
  $$unsubscribe_content();
  return `<div${spread(
    [
      {
        class: "mx-auto w-full max-w-md rounded-md shadow-lg"
      },
      escape_object(root)
    ],
    {}
  )}>${each(items, ({ id, title, description }, i) => {
    return `<div${spread(
      [
        escape_object($item(id)),
        {
          class: "mt-px overflow-hidden transition-colors first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:ring focus-within:ring-magnum-400"
        }
      ],
      {}
    )}><h2 class="flex"><button${spread(
      [
        {
          id: escape_attribute_value(i === 0 ? "trigger" : void 0)
        },
        escape_object($trigger(id)),
        {
          class: "flex h-12 flex-1 cursor-pointer items-center justify-between bg-white px-5 text-base font-medium leading-none text-magnum-700 shadow-[0_1px_0] transition-colors hover:bg-opacity-95"
        }
      ],
      {}
    )}>${escape(title)} </button></h2> ${$isSelected(id) ? `<div${spread(
      [
        {
          class: "overflow-hidden bg-neutral-100 text-sm text-neutral-900"
        },
        escape_object($content(id))
      ],
      {}
    )}><div class="px-5 py-4">${escape(description)}</div> </div>` : ``} </div>`;
  })}</div>`;
});
export {
  Tailwind as default
};
