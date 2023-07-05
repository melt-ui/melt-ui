import { c as compute_rest_props, s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, s as setContext, h as getContext, v as validate_component, d as escape, b as each } from "./ssr.js";
import { w as writable } from "./index2.js";
import "./clickOutside.js";
import { c as createTabs } from "./create8.js";
const Npm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `<svg${spread([{ viewBox: "0 0 24 24" }, escape_object($$restProps)], {})}><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" fill="currentColor"></path></svg>`;
});
const Pnpm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `<svg${spread([{ viewBox: "0 0 24 24" }, escape_object($$restProps)], {})}><path d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z" fill="currentColor"></path></svg>`;
});
const Yarn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `<svg${spread([{ viewBox: "0 0 24 24" }, escape_object($$restProps)], {})}><path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z" fill="currentColor"></path></svg>`;
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
const Tab = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $trigger, $$unsubscribe_trigger;
  let { tab } = $$props;
  const { trigger } = getTabsContext();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  if ($$props.tab === void 0 && $$bindings.tab && tab !== void 0)
    $$bindings.tab(tab);
  $$unsubscribe_trigger();
  return `<button${spread(
    [
      escape_object($trigger(tab)),
      {
        class: "rounded-md border border-transparent bg-neutral-800 px-3 py-2 text-neutral-400 transition hover:opacity-100 focus:!border-magnum-400 focus:!text-magnum-400 data-[state=active]:border-magnum-700 data-[state=active]:py-2 data-[state=active]:text-magnum-600 data-[state=active]:opacity-100"
      }
    ],
    {}
  )}><div class="flex items-center gap-2 px-1">${tab === "npm" ? `${validate_component(Npm, "Npm").$$render($$result, { class: "h-4 w-4" }, {}, {})}` : `${tab === "yarn" ? `${validate_component(Yarn, "Yarn").$$render($$result, { class: "h-4 w-4" }, {}, {})}` : `${tab === "pnpm" ? `${validate_component(Pnpm, "Pnpm").$$render($$result, { class: "h-4 w-4" }, {}, {})}` : ``}`}`} <span class="font-mono text-sm font-semibold">${escape(tab)}</span></div></button>`;
});
const List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $tabs, $$unsubscribe_tabs;
  const { list, tabs } = getTabsContext();
  $$unsubscribe_tabs = subscribe(tabs, (value) => $tabs = value);
  $$unsubscribe_tabs();
  return `<div${spread([{ class: "flex items-center gap-3" }, escape_object(list)], {})}>${each($tabs, (tab) => {
    return `${validate_component(Tab, "Tab").$$render($$result, { tab }, {}, {})}`;
  })}</div>`;
});
export {
  List as L,
  Root as R
};
