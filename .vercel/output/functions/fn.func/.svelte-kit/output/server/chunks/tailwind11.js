import { g as get_store_value, s as subscribe } from "./utils.js";
import { c as create_ssr_component, a as spread, e as escape_object, v as validate_component, b as each, d as escape } from "./ssr.js";
import { w as writable } from "./index2.js";
import "./clickOutside.js";
import { c as createMenuBuilder, F as FIRST_LAST_KEYS, h as handleMenuNavigation, a as handleTabNavigation, g as getMenuItems, b as applyAttrsIfDisabled, S as SELECTION_KEYS } from "./create9.js";
import { b as builder, c as createElHelpers, e as effect } from "./builder.js";
import { a as isBrowser, b as isHTMLElement } from "./is.js";
import { a as addEventListener } from "./event.js";
import { s as styleToString } from "./style.js";
import { g as generateId } from "./id.js";
import { k as kbd } from "./keyboard.js";
import { n as noop, e as executeCallbacks } from "./callbacks.js";
import { g as getNextFocusable, a as getPreviousFocusable, h as handleRovingFocus } from "./rovingFocus.js";
import { t as tick } from "./portal.js";
import { u as usePopper } from "./popper.js";
import { C as Chevron_right } from "./chevron-right.js";
import { C as Check } from "./check.js";
const MENUBAR_NAV_KEYS = [kbd.ARROW_LEFT, kbd.ARROW_RIGHT, kbd.HOME, kbd.END];
const { name } = createElHelpers("menubar");
const defaults = {
  loop: true
};
function createMenubar(args) {
  ({ ...defaults, ...args });
  const activeMenu = writable("");
  const scopedMenus = writable([]);
  const nextFocusable = writable(null);
  const prevFocusable = writable(null);
  const rootIds = {
    menubar: generateId()
  };
  const menubar = builder(name(), {
    returned() {
      return {
        role: "menubar",
        "data-melt-menubar": "",
        "data-orientation": "horizontal",
        id: rootIds.menubar
      };
    },
    action: (node) => {
      const menuTriggers = node.querySelectorAll(
        "[data-melt-menubar-trigger]"
      );
      if (menuTriggers.length === 0)
        return;
      menuTriggers[0].tabIndex = 0;
      const menus = Array.from(node.querySelectorAll("[data-melt-menubar-menu]"));
      scopedMenus.set(menus);
      return {
        destroy: noop
      };
    }
  });
  const menuDefaults = {
    positioning: {
      placement: "bottom-start"
    },
    preventScroll: true
  };
  const createMenu = (args2) => {
    const withDefaults2 = { ...menuDefaults, ...args2 };
    const rootOptions = writable(withDefaults2);
    const rootOpen = writable(false);
    const rootActiveTrigger = writable(null);
    const m = createMenuBuilder({
      rootOptions,
      rootOpen,
      rootActiveTrigger,
      disableTriggerRefocus: true,
      disableFocusFirstItem: true,
      nextFocusable,
      prevFocusable,
      selector: "menubar-menu"
    });
    const menu = builder(name("menu"), {
      stores: [rootOpen],
      returned: ([$rootOpen]) => {
        return {
          role: "menu",
          hidden: $rootOpen ? void 0 : true,
          style: styleToString({
            display: $rootOpen ? void 0 : "none"
          }),
          id: m.rootIds.menu,
          "aria-labelledby": m.rootIds.trigger,
          "data-state": $rootOpen ? "open" : "closed",
          "data-melt-scope": rootIds.menubar,
          tabindex: -1
        };
      },
      action: (node) => {
        let unsubPopper = noop;
        const unsubDerived = effect(
          [rootOpen, rootActiveTrigger, rootOptions],
          ([$rootOpen, $rootActiveTrigger, $rootOptions]) => {
            unsubPopper();
            if ($rootOpen && $rootActiveTrigger) {
              tick().then(() => {
                const popper = usePopper(node, {
                  anchorElement: $rootActiveTrigger,
                  open: rootOpen,
                  options: {
                    floating: $rootOptions.positioning
                  }
                });
                if (popper && popper.destroy) {
                  unsubPopper = popper.destroy;
                }
              });
            }
          }
        );
        const unsubEvents = executeCallbacks(
          addEventListener(node, "keydown", (e) => {
            const target = e.target;
            if (!isHTMLElement(target))
              return;
            const menuElement = e.currentTarget;
            if (!isHTMLElement(menuElement))
              return;
            const isKeyDownInside = target.closest("[data-melt-menubar-menu]") === menuElement;
            if (!isKeyDownInside)
              return;
            if (FIRST_LAST_KEYS.includes(e.key)) {
              handleMenuNavigation(e);
            }
            if (MENUBAR_NAV_KEYS.includes(e.key)) {
              handleCrossMenuNavigation(e, activeMenu);
            }
            if (e.key === kbd.TAB) {
              e.preventDefault();
              rootActiveTrigger.set(null);
              rootOpen.set(false);
              handleTabNavigation(e, nextFocusable, prevFocusable);
            }
            const isCharacterKey = e.key.length === 1;
            const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
            if (!isModifierKey && isCharacterKey) {
              m.handleTypeaheadSearch(e.key, getMenuItems(menuElement));
            }
          })
        );
        return {
          destroy() {
            unsubDerived();
            unsubEvents();
            unsubPopper();
          }
        };
      }
    });
    const trigger = builder(name("trigger"), {
      stores: [rootOpen],
      returned: ([$rootOpen]) => {
        return {
          "aria-controls": m.rootIds.menu,
          "aria-expanded": $rootOpen,
          "data-state": $rootOpen ? "open" : "closed",
          id: m.rootIds.trigger,
          "aria-haspopup": "menu",
          "data-orientation": "horizontal",
          role: "menuitem"
        };
      },
      action: (node) => {
        applyAttrsIfDisabled(node);
        const menubarElement = document.getElementById(rootIds.menubar);
        if (!menubarElement)
          return;
        const menubarTriggers = Array.from(
          menubarElement.querySelectorAll("[data-melt-menubar-trigger]")
        );
        if (!menubarTriggers.length)
          return;
        if (menubarTriggers[0] === node) {
          node.tabIndex = 0;
        } else {
          node.tabIndex = -1;
        }
        const unsub = executeCallbacks(
          addEventListener(node, "pointerdown", (e) => {
            if (e.button !== 0 || e.ctrlKey === true)
              return;
            const $rootOpen = get_store_value(rootOpen);
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            rootOpen.update((prev) => {
              const isOpen = !prev;
              if (isOpen) {
                nextFocusable.set(getNextFocusable(triggerElement));
                prevFocusable.set(getPreviousFocusable(triggerElement));
                rootActiveTrigger.set(triggerElement);
                activeMenu.set(m.rootIds.menu);
              } else {
                rootActiveTrigger.set(null);
                activeMenu.set("");
              }
              return isOpen;
            });
            if (!$rootOpen)
              e.preventDefault();
          }),
          addEventListener(node, "keydown", (e) => {
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            if (SELECTION_KEYS.includes(e.key) || e.key === kbd.ARROW_DOWN) {
              if (e.key === kbd.ARROW_DOWN) {
                e.preventDefault();
              }
              rootOpen.update((prev) => {
                const isOpen = !prev;
                if (isOpen) {
                  nextFocusable.set(getNextFocusable(triggerElement));
                  prevFocusable.set(getPreviousFocusable(triggerElement));
                  rootActiveTrigger.set(triggerElement);
                  activeMenu.set(m.rootIds.menu);
                } else {
                  rootActiveTrigger.set(null);
                  activeMenu.set("");
                }
                return isOpen;
              });
              const menuId = triggerElement.getAttribute("aria-controls");
              if (!menuId)
                return;
              const menu2 = document.getElementById(menuId);
              if (!isHTMLElement(menu2))
                return;
              const menuItems = getMenuItems(menu2);
              if (!menuItems.length)
                return;
              const nextFocusedElement = menuItems[0];
              if (!isHTMLElement(nextFocusedElement))
                return;
              handleRovingFocus(nextFocusedElement);
            }
          }),
          addEventListener(node, "pointerenter", (e) => {
            const triggerElement = e.currentTarget;
            if (!isHTMLElement(triggerElement))
              return;
            const $activeMenu = get_store_value(activeMenu);
            const $rootOpen = get_store_value(rootOpen);
            if ($activeMenu && !$rootOpen) {
              rootOpen.set(true);
              activeMenu.set(m.rootIds.menu);
              rootActiveTrigger.set(triggerElement);
            }
          })
        );
        return {
          destroy: unsub
        };
      }
    });
    effect([activeMenu], ([$activeMenu]) => {
      if (!isBrowser)
        return;
      if ($activeMenu === m.rootIds.menu) {
        if (get_store_value(rootOpen))
          return;
        const triggerElement = document.getElementById(m.rootIds.trigger);
        if (!isHTMLElement(triggerElement))
          return;
        rootActiveTrigger.set(triggerElement);
        triggerElement.setAttribute("data-highlighted", "");
        rootOpen.set(true);
        return;
      }
      if ($activeMenu !== m.rootIds.menu) {
        if (!isBrowser)
          return;
        if (get_store_value(rootOpen)) {
          const triggerElement = document.getElementById(m.rootIds.trigger);
          if (!isHTMLElement(triggerElement))
            return;
          triggerElement.removeAttribute("data-highlighted");
          rootActiveTrigger.set(null);
          rootOpen.set(false);
        }
        return;
      }
    });
    effect([rootOpen], ([$rootOpen]) => {
      if (!isBrowser)
        return;
      const triggerElement = document.getElementById(m.rootIds.trigger);
      if (!$rootOpen && get_store_value(activeMenu) === m.rootIds.menu) {
        activeMenu.set("");
        triggerElement?.removeAttribute("data-highlighted");
        return;
      }
      if ($rootOpen) {
        triggerElement?.setAttribute("data-highlighted", "");
      }
    });
    return {
      menu,
      trigger,
      item: m.item,
      checkboxItem: m.checkboxItem,
      arrow: m.arrow,
      createSubmenu: m.createSubMenu,
      createMenuRadioGroup: m.createMenuRadioGroup,
      separator: m.separator
    };
  };
  function handleCrossMenuNavigation(e, activeMenu2) {
    if (!isBrowser)
      return;
    e.preventDefault();
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget))
      return;
    const target = e.target;
    if (!isHTMLElement(target))
      return;
    const targetIsSubTrigger = target.hasAttribute("data-melt-menubar-menu-subtrigger");
    const isKeyDownInsideSubMenu = target.closest('[role="menu"]') !== currentTarget;
    const prevMenuKey = kbd.ARROW_LEFT;
    const isPrevKey = e.key === prevMenuKey;
    const isNextKey = !isPrevKey;
    if (isNextKey && targetIsSubTrigger)
      return;
    if (isPrevKey && isKeyDownInsideSubMenu)
      return;
    const childMenus = get_store_value(scopedMenus);
    if (!childMenus.length)
      return;
    const currentIndex = childMenus.indexOf(currentTarget);
    let nextIndex;
    switch (e.key) {
      case kbd.ARROW_RIGHT:
        nextIndex = currentIndex < childMenus.length - 1 ? currentIndex + 1 : 0;
        break;
      case kbd.ARROW_LEFT:
        nextIndex = currentIndex > 0 ? currentIndex - 1 : childMenus.length - 1;
        break;
      case kbd.HOME:
        nextIndex = 0;
        break;
      case kbd.END:
        nextIndex = childMenus.length - 1;
        break;
      default:
        return;
    }
    const nextFocusedItem = childMenus[nextIndex];
    activeMenu2.set(nextFocusedItem.id);
  }
  return {
    menubar,
    createMenu
  };
}
const tailwind_svelte_svelte_type_style_lang = "";
const css = {
  code: ".menu.svelte-omw0hb{z-index:10;display:flex;max-height:300px;min-width:220px;flex-direction:column;--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);--tw-shadow-color:rgb(23 23 23 / 0.3);--tw-shadow:var(--tw-shadow-colored);border-radius:0.375rem;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding:0.25rem\n}@media(min-width: 1024px){.menu.svelte-omw0hb{max-height:none\n		}}.menu.svelte-omw0hb{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important\n}.subMenu.svelte-omw0hb{min-width:220px;--tw-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);--tw-shadow-color:rgb(23 23 23 / 0.3);--tw-shadow:var(--tw-shadow-colored)\n}.item.svelte-omw0hb{position:relative;height:25px;min-height:25px;-webkit-user-select:none;-moz-user-select:none;user-select:none;border-radius:0.125rem;padding-left:1.5rem;padding-right:0.25rem;z-index:20;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));outline:2px solid transparent;outline-offset:2px\n}.item[data-highlighted].svelte-omw0hb{--tw-bg-opacity:1;background-color:rgb(252 224 172 / var(--tw-bg-opacity));--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity))\n}.item[data-disabled].svelte-omw0hb{--tw-text-opacity:1;color:rgb(212 212 212 / var(--tw-text-opacity))\n}.item.svelte-omw0hb{display:flex;align-items:center;font-size:0.875rem;line-height:1.25rem;line-height:1;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important\n}.trigger.svelte-omw0hb{display:inline-flex;align-items:center;justify-content:center;border-radius:0.375rem;--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));padding-left:0.75rem;padding-right:0.75rem;padding-top:0.5rem;padding-bottom:0.5rem;font-size:0.875rem;line-height:1.25rem;font-weight:500;line-height:1;--tw-text-opacity:1;color:rgb(121 58 21 / var(--tw-text-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms\n}.trigger.svelte-omw0hb:hover{background-color:rgb(255 255 255 / 0.9)\n}.trigger[data-highlighted].svelte-omw0hb{outline:2px solid transparent;outline-offset:2px\n}.trigger.svelte-omw0hb{overflow:visible !important\n}.trigger[data-highlighted].svelte-omw0hb{--tw-bg-opacity:1 !important;background-color:rgb(252 224 172 / var(--tw-bg-opacity)) !important;--tw-ring-opacity:1 !important;--tw-ring-color:rgb(247 177 85 / var(--tw-ring-opacity)) !important\n}.trigger.svelte-omw0hb:focus{z-index:30;--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)\n}.check.svelte-omw0hb{position:absolute;left:0.5rem;top:50%;--tw-text-opacity:1;color:rgb(243 141 28 / var(--tw-text-opacity));translate:0 calc(-50% + 1px)\n}.dot.svelte-omw0hb{height:4.75px;width:4.75px;border-radius:9999px;--tw-bg-opacity:1;background-color:rgb(121 58 21 / var(--tw-bg-opacity))\n}.separator.svelte-omw0hb{margin:5px;height:1px;--tw-bg-opacity:1;background-color:rgb(252 224 172 / var(--tw-bg-opacity))\n}.rightSlot.svelte-omw0hb{margin-left:auto;padding-left:1.25rem\n}.icon.svelte-omw0hb{height:13px;width:13px\n}.check.svelte-omw0hb{position:absolute;left:0px;display:inline-flex;width:25px;align-items:center;justify-content:center\n}.text.svelte-omw0hb{padding-left:1.5rem;font-size:0.75rem;line-height:1.5rem;--tw-text-opacity:1;color:rgb(82 82 82 / var(--tw-text-opacity))\n}",
  map: null
};
const Tailwind = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $menubar, $$unsubscribe_menubar;
  let $trigger, $$unsubscribe_trigger;
  let $menu, $$unsubscribe_menu;
  let $item, $$unsubscribe_item;
  let $separator, $$unsubscribe_separator;
  let $subTrigger, $$unsubscribe_subTrigger;
  let $subMenu, $$unsubscribe_subMenu;
  let $radioGroup, $$unsubscribe_radioGroup;
  let $radioItem, $$unsubscribe_radioItem;
  let $isChecked, $$unsubscribe_isChecked;
  let $triggerA, $$unsubscribe_triggerA;
  let $menuA, $$unsubscribe_menuA;
  let $itemA, $$unsubscribe_itemA;
  let $separatorA, $$unsubscribe_separatorA;
  let $triggerB, $$unsubscribe_triggerB;
  let $menuB, $$unsubscribe_menuB;
  let $itemB, $$unsubscribe_itemB;
  let $separatorB, $$unsubscribe_separatorB;
  let $subTriggerB, $$unsubscribe_subTriggerB;
  let $subMenuB, $$unsubscribe_subMenuB;
  let $checkboxItemB, $$unsubscribe_checkboxItemB;
  let $wordWrap, $$unsubscribe_wordWrap;
  let $stickyScroll, $$unsubscribe_stickyScroll;
  let $triggerC, $$unsubscribe_triggerC;
  let $menuC, $$unsubscribe_menuC;
  let $itemC, $$unsubscribe_itemC;
  let $separatorC, $$unsubscribe_separatorC;
  let $checkboxItemC, $$unsubscribe_checkboxItemC;
  let $tipsAndTricks, $$unsubscribe_tipsAndTricks;
  let $hideMeltUI, $$unsubscribe_hideMeltUI;
  const { menubar, createMenu } = createMenubar();
  $$unsubscribe_menubar = subscribe(menubar, (value) => $menubar = value);
  const { trigger, menu, item, separator, createSubmenu, createMenuRadioGroup } = createMenu();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_menu = subscribe(menu, (value) => $menu = value);
  $$unsubscribe_item = subscribe(item, (value) => $item = value);
  $$unsubscribe_separator = subscribe(separator, (value) => $separator = value);
  const { subMenu, subTrigger } = createSubmenu();
  $$unsubscribe_subMenu = subscribe(subMenu, (value) => $subMenu = value);
  $$unsubscribe_subTrigger = subscribe(subTrigger, (value) => $subTrigger = value);
  const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({ value: "Nord" });
  $$unsubscribe_radioGroup = subscribe(radioGroup, (value) => $radioGroup = value);
  $$unsubscribe_radioItem = subscribe(radioItem, (value) => $radioItem = value);
  $$unsubscribe_isChecked = subscribe(isChecked, (value) => $isChecked = value);
  const { trigger: triggerA, menu: menuA, item: itemA, separator: separatorA } = createMenu();
  $$unsubscribe_triggerA = subscribe(triggerA, (value) => $triggerA = value);
  $$unsubscribe_menuA = subscribe(menuA, (value) => $menuA = value);
  $$unsubscribe_itemA = subscribe(itemA, (value) => $itemA = value);
  $$unsubscribe_separatorA = subscribe(separatorA, (value) => $separatorA = value);
  const { trigger: triggerB, menu: menuB, item: itemB, checkboxItem: checkboxItemB, separator: separatorB, createSubmenu: createSubmenuB } = createMenu();
  $$unsubscribe_triggerB = subscribe(triggerB, (value) => $triggerB = value);
  $$unsubscribe_menuB = subscribe(menuB, (value) => $menuB = value);
  $$unsubscribe_itemB = subscribe(itemB, (value) => $itemB = value);
  $$unsubscribe_checkboxItemB = subscribe(checkboxItemB, (value) => $checkboxItemB = value);
  $$unsubscribe_separatorB = subscribe(separatorB, (value) => $separatorB = value);
  const { subMenu: subMenuB, subTrigger: subTriggerB } = createSubmenuB();
  $$unsubscribe_subMenuB = subscribe(subMenuB, (value) => $subMenuB = value);
  $$unsubscribe_subTriggerB = subscribe(subTriggerB, (value) => $subTriggerB = value);
  const { trigger: triggerC, menu: menuC, item: itemC, checkboxItem: checkboxItemC, separator: separatorC } = createMenu();
  $$unsubscribe_triggerC = subscribe(triggerC, (value) => $triggerC = value);
  $$unsubscribe_menuC = subscribe(menuC, (value) => $menuC = value);
  $$unsubscribe_itemC = subscribe(itemC, (value) => $itemC = value);
  $$unsubscribe_checkboxItemC = subscribe(checkboxItemC, (value) => $checkboxItemC = value);
  $$unsubscribe_separatorC = subscribe(separatorC, (value) => $separatorC = value);
  const themesArr = ["Nord", "GitHub Dark", "Moonlight"];
  const tipsAndTricks = writable(true);
  $$unsubscribe_tipsAndTricks = subscribe(tipsAndTricks, (value) => $tipsAndTricks = value);
  const hideMeltUI = writable(false);
  $$unsubscribe_hideMeltUI = subscribe(hideMeltUI, (value) => $hideMeltUI = value);
  const wordWrap = writable(true);
  $$unsubscribe_wordWrap = subscribe(wordWrap, (value) => $wordWrap = value);
  const stickyScroll = writable(false);
  $$unsubscribe_stickyScroll = subscribe(stickyScroll, (value) => $stickyScroll = value);
  $$result.css.add(css);
  $$unsubscribe_menubar();
  $$unsubscribe_trigger();
  $$unsubscribe_menu();
  $$unsubscribe_item();
  $$unsubscribe_separator();
  $$unsubscribe_subTrigger();
  $$unsubscribe_subMenu();
  $$unsubscribe_radioGroup();
  $$unsubscribe_radioItem();
  $$unsubscribe_isChecked();
  $$unsubscribe_triggerA();
  $$unsubscribe_menuA();
  $$unsubscribe_itemA();
  $$unsubscribe_separatorA();
  $$unsubscribe_triggerB();
  $$unsubscribe_menuB();
  $$unsubscribe_itemB();
  $$unsubscribe_separatorB();
  $$unsubscribe_subTriggerB();
  $$unsubscribe_subMenuB();
  $$unsubscribe_checkboxItemB();
  $$unsubscribe_wordWrap();
  $$unsubscribe_stickyScroll();
  $$unsubscribe_triggerC();
  $$unsubscribe_menuC();
  $$unsubscribe_itemC();
  $$unsubscribe_separatorC();
  $$unsubscribe_checkboxItemC();
  $$unsubscribe_tipsAndTricks();
  $$unsubscribe_hideMeltUI();
  return `<div class="flex w-full items-center justify-center"><div${spread(
    [
      {
        class: "flex rounded-md bg-white p-1 shadow-md"
      },
      escape_object($menubar)
    ],
    { classes: "svelte-omw0hb" }
  )}>   <button${spread(
    [
      { type: "button" },
      { class: "trigger" },
      escape_object($trigger),
      { "aria-label": "Update dimensions" }
    ],
    { classes: "svelte-omw0hb" }
  )}>File</button> <div${spread([{ class: "menu" }, escape_object($menu)], { classes: "svelte-omw0hb" })}><div${spread([{ class: "item" }, escape_object($item)], { classes: "svelte-omw0hb" })}>New Text File</div> <div${spread([{ class: "item" }, escape_object($item)], { classes: "svelte-omw0hb" })}>New File...
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-14lv85f">⌘T</div></div> <div${spread([{ class: "item" }, escape_object($item), { "aria-disabled": "true" }], { classes: "svelte-omw0hb" })}>New Window...
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-18wx8r0">⇧⌘T</div></div> <div${spread([{ class: "separator" }, escape_object($separator)], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($subTrigger)], { classes: "svelte-omw0hb" })}>Select theme
				<div class="rightSlot svelte-omw0hb">${validate_component(Chevron_right, "ChevronRight").$$render($$result, { class: "icon" }, {}, {})}</div></div> <div${spread([{ class: "menu subMenu" }, escape_object($subMenu)], { classes: "svelte-omw0hb" })}><div${spread([escape_object($radioGroup)], { classes: "svelte-omw0hb" })}>${each(themesArr, (theme) => {
    return `<div${spread([{ class: "item" }, escape_object($radioItem({ value: theme }))], { classes: "svelte-omw0hb" })}><div class="check svelte-omw0hb">${$isChecked(theme) ? `<div class="dot svelte-omw0hb"></div>` : ``}</div> ${escape(theme)} </div>`;
  })}</div></div> <div${spread([escape_object($separator), { class: "separator" }], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($item)], { classes: "svelte-omw0hb" })}>Quit Melt UI
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-cnmoo2">⌘Q</div></div></div>    <button${spread(
    [
      { type: "button" },
      { class: "trigger" },
      escape_object($triggerA),
      { "aria-label": "Update dimensions" }
    ],
    { classes: "svelte-omw0hb" }
  )}>Edit</button> <div${spread([{ class: "menu" }, escape_object($menuA)], { classes: "svelte-omw0hb" })}><div${spread([{ class: "item" }, escape_object($itemA)], { classes: "svelte-omw0hb" })}>Undo
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-67wqv9">⌘Z</div></div> <div${spread([{ class: "item" }, escape_object($itemA)], { classes: "svelte-omw0hb" })}>Redo
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-1q9d5am">⇧⌘Z</div></div> <div${spread([{ class: "separator" }, escape_object($separatorA)], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($itemA)], { classes: "svelte-omw0hb" })}>Cut
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-n8j413">⌘X</div></div> <div${spread([{ class: "item" }, escape_object($itemA)], { classes: "svelte-omw0hb" })}>Copy
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-g8a1yo">⌘C</div></div> <div${spread([{ class: "item" }, escape_object($itemA)], { classes: "svelte-omw0hb" })}>Paste
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-13mpxsx">⌘V</div></div> <div${spread([escape_object($separatorA), { class: "separator" }], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($itemA)], { classes: "svelte-omw0hb" })}>Find
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-adobqp">⌘F</div></div> <div${spread([{ class: "item" }, escape_object($itemA)], { classes: "svelte-omw0hb" })}>Replace
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-70j9h8">⌥⌘F</div></div></div>    <button${spread(
    [
      { type: "button" },
      { class: "trigger" },
      escape_object($triggerB),
      { "aria-label": "Update dimensions" }
    ],
    { classes: "svelte-omw0hb" }
  )}>View</button> <div${spread([{ class: "menu" }, escape_object($menuB)], { classes: "svelte-omw0hb" })}><div${spread([{ class: "item" }, escape_object($itemB)], { classes: "svelte-omw0hb" })}>Command Palette..
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-lbjuaw">⇧⌘P</div></div> <div${spread([{ class: "item" }, escape_object($itemB)], { classes: "svelte-omw0hb" })}>Open View...</div> <div${spread([{ class: "separator" }, escape_object($separatorB)], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($subTriggerB)], { classes: "svelte-omw0hb" })}>Appearance
				<div class="rightSlot svelte-omw0hb">${validate_component(Chevron_right, "ChevronRight").$$render($$result, { class: "icon" }, {}, {})}</div></div> <div${spread([{ class: "menu subMenu" }, escape_object($subMenuB)], { classes: "svelte-omw0hb" })}><div${spread([escape_object($radioGroup)], { classes: "svelte-omw0hb" })}><div${spread([{ class: "item" }, escape_object($itemB)], { classes: "svelte-omw0hb" })}>Full Screen</div> <div${spread([{ class: "item" }, escape_object($itemB)], { classes: "svelte-omw0hb" })}>Zen Mode</div></div></div> <div${spread([{ class: "separator" }, escape_object($separatorB)], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($checkboxItemB)], { classes: "svelte-omw0hb" })}><div class="check svelte-omw0hb">${$wordWrap ? `${validate_component(Check, "Check").$$render($$result, { class: "icon" }, {}, {})}` : ``}</div>
				Word Wrap
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-o3yf3r">⌘H</div></div> <div${spread([{ class: "item" }, escape_object($checkboxItemB)], { classes: "svelte-omw0hb" })}><div class="check svelte-omw0hb">${$stickyScroll ? `${validate_component(Check, "Check").$$render($$result, { class: "icon" }, {}, {})}` : ``}</div>
				Sticky Scroll</div></div>    <button${spread(
    [
      { type: "button" },
      { class: "trigger" },
      escape_object($triggerC),
      { "aria-label": "Update dimensions" }
    ],
    { classes: "svelte-omw0hb" }
  )}>Help</button> <div${spread([{ class: "menu" }, escape_object($menuC)], { classes: "svelte-omw0hb" })}><div${spread([{ class: "item" }, escape_object($itemC)], { classes: "svelte-omw0hb" })}>About Melt UI</div> <div${spread([{ class: "item" }, escape_object($itemC)], { classes: "svelte-omw0hb" })}>Check for Updates...</div> <div${spread([{ class: "separator" }, escape_object($separatorC)], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($checkboxItemC)], { classes: "svelte-omw0hb" })}><div class="check svelte-omw0hb">${$tipsAndTricks ? `${validate_component(Check, "Check").$$render($$result, { class: "icon" }, {}, {})}` : ``}</div>
				Tips &amp; Tricks</div> <div${spread([escape_object($separatorC), { class: "separator" }], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($checkboxItemC)], { classes: "svelte-omw0hb" })}><div class="check svelte-omw0hb">${$hideMeltUI ? `${validate_component(Check, "Check").$$render($$result, { class: "icon" }, {}, {})}` : ``}</div>
				Documentation</div> <div${spread([{ class: "item" }, escape_object($itemC), { "aria-disabled": "true" }], { classes: "svelte-omw0hb" })}>Show All Components
				<div class="rightSlot svelte-omw0hb" data-svelte-h="svelte-adhnky">⇧⌘N</div></div> <div${spread([escape_object($separatorC), { class: "separator" }], { classes: "svelte-omw0hb" })}></div> <div${spread([{ class: "item" }, escape_object($itemC)], { classes: "svelte-omw0hb" })}>Report a bug...</div></div></div> </div>`;
});
export {
  Tailwind as default
};
