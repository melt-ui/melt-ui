import { g as getElementByMeltId, b as builder, e as effect, c as createElHelpers } from "./builder.js";
import { a as addEventListener } from "./event.js";
import { o as omit } from "./object.js";
import { g as generateId } from "./id.js";
import { k as kbd } from "./keyboard.js";
import { e as executeCallbacks } from "./callbacks.js";
import { w as writable, d as derived } from "./index2.js";
import { g as get_store_value } from "./utils.js";
function focusInput(id, pos = "default") {
  const inputEl = getElementByMeltId(id);
  if (!inputEl)
    return;
  inputEl.focus();
  if (pos === "start")
    inputEl.setSelectionRange(0, 0);
  else if (pos === "end")
    inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
}
function setSelectedFromEl(el, selected) {
  if (el) {
    selected.set({
      id: el.getAttribute("data-tag-id") ?? "",
      value: el.getAttribute("data-tag-value") ?? ""
    });
  } else {
    selected.set(null);
  }
}
function setDataInvalid(ids, inputStore) {
  getElementByMeltId(ids.root)?.setAttribute("data-invalid", "");
  getElementByMeltId(ids.input)?.setAttribute("data-invalid", "");
  inputStore.set(true);
}
function clearDataInvalid(ids, inputStore) {
  getElementByMeltId(ids.root)?.removeAttribute("data-invalid");
  getElementByMeltId(ids.input)?.removeAttribute("data-invalid");
  inputStore.set(false);
}
const defaults = {
  placeholder: "Enter tags...",
  disabled: false,
  tags: [],
  unique: false,
  blur: "nothing",
  addOnPaste: false,
  allowed: [],
  denied: []
};
const { name, selector } = createElHelpers("tags-input");
function createTagsInput(args) {
  const withDefaults = { ...defaults, ...args };
  const options = writable(omit(withDefaults, "tags", "selected"));
  const inputValue = writable("");
  const invalid = writable(false);
  const tags = writable(
    withDefaults.tags && withDefaults.tags.length > 0 ? typeof withDefaults.tags[0] === "string" ? withDefaults.tags.map((tag2) => ({ id: generateId(), value: tag2 })) : withDefaults.tags : []
    // if undefined
  );
  const isInputValid = (v) => {
    const $options = get_store_value(options);
    const $tags = get_store_value(tags);
    if ($options.unique) {
      const index = $tags.findIndex((tag2) => tag2.value === v);
      if (index >= 0)
        return false;
    }
    if ($options.allowed && $options.allowed.length > 0 && !$options.allowed.includes(v))
      return false;
    if ($options.denied && $options.denied.length > 0 && $options.denied.includes(v))
      return false;
    if ($options.maxTags && $options.maxTags > 0 && $tags.length >= $options.maxTags)
      return false;
    return true;
  };
  const selected = writable(withDefaults.selected ?? null);
  const addTag = async (v) => {
    const $options = get_store_value(options);
    let t;
    if ($options.add) {
      try {
        const res = await $options.add(v);
        if (typeof res === "string") {
          t = { id: generateId(), value: res };
        } else {
          t = res;
          if (!t.id)
            t.id = generateId();
        }
      } catch {
        setDataInvalid(ids, invalid);
        return false;
      }
    } else {
      t = { id: generateId(), value: v };
    }
    tags.update((currentTags) => [...currentTags, t]);
    return true;
  };
  const removeTag = async (t) => {
    const $options = get_store_value(options);
    if ($options.remove) {
      try {
        if (!await $options.remove(t))
          return false;
      } catch {
        setDataInvalid(ids, invalid);
        return false;
      }
    }
    const $tags = get_store_value(tags);
    const index = $tags.findIndex((tag2) => tag2.id === t.id);
    tags.update((t2) => {
      t2.splice(index, 1);
      return t2;
    });
    return true;
  };
  const ids = {
    root: generateId(),
    input: generateId()
  };
  const root = builder(name(""), {
    stores: options,
    returned: ($options) => {
      return {
        "data-disabled": $options.disabled ? true : void 0,
        "data-melt-id": ids.root,
        disabled: $options.disabled
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(
        addEventListener(node, "mousedown", (e) => {
          focusInput(ids.input);
          const targetEL = e.target.closest(selector("tag"));
          if (targetEL) {
            e.preventDefault();
            setSelectedFromEl(targetEL, selected);
          }
        }),
        addEventListener(node, "click", (e) => {
          focusInput(ids.input);
          const targetEL = e.target.closest(selector("tag"));
          setSelectedFromEl(targetEL, selected);
        })
      );
      return {
        destroy: unsub
      };
    }
  });
  const input = builder(name("input"), {
    stores: options,
    returned: ($options) => {
      return {
        "data-melt-id": ids.input,
        "data-disabled": $options.disabled ? "" : void 0,
        disabled: $options.disabled,
        placeholder: $options.placeholder
      };
    },
    action: (node) => {
      const getTagsInfo = (id) => {
        const rootEl = getElementByMeltId(ids.root);
        let tagsEl = [];
        let selectedIndex = -1;
        let prevIndex = -1;
        let nextIndex = -1;
        if (rootEl) {
          tagsEl = Array.from(rootEl.querySelectorAll(selector("tag")));
          selectedIndex = tagsEl.findIndex((element) => element.getAttribute("data-tag-id") === id);
          prevIndex = selectedIndex - 1;
          nextIndex = selectedIndex + 1;
        }
        return {
          tagsEl,
          selectedIndex,
          prevIndex,
          nextIndex
        };
      };
      const unsub = executeCallbacks(
        addEventListener(node, "focus", () => {
          const rootEl = getElementByMeltId(ids.root);
          if (rootEl)
            rootEl.setAttribute("data-focus", "");
          node.setAttribute("data-focus", "");
        }),
        addEventListener(node, "blur", async () => {
          const rootEl = getElementByMeltId(ids.root);
          if (rootEl)
            rootEl.removeAttribute("data-focus");
          node.removeAttribute("data-focus");
          selected.set(null);
          const value = node.value;
          if (!value)
            return;
          const $options = get_store_value(options);
          if ($options.blur === "clear") {
            node.value = "";
          } else if ($options.blur === "add") {
            if (isInputValid(value) && await addTag(value)) {
              node.value = "";
              inputValue.set("");
            } else {
              setDataInvalid(ids, invalid);
            }
          }
        }),
        addEventListener(node, "paste", async (e) => {
          if (!e.clipboardData)
            return;
          const pastedText = e.clipboardData.getData("text");
          if (!pastedText)
            return;
          const $options = get_store_value(options);
          if (!$options.addOnPaste) {
            return;
          }
          if (isInputValid(pastedText)) {
            e.preventDefault();
            if (await addTag(pastedText)) {
              node.value = "";
            } else {
              node.value = pastedText;
            }
          } else {
            setDataInvalid(ids, invalid);
          }
        }),
        addEventListener(node, "keydown", async (e) => {
          const $selected = get_store_value(selected);
          if ($selected) {
            if (e.key.length === 1) {
              selected.set(null);
            } else if (e.key === kbd.ARROW_LEFT) {
              e.preventDefault();
              const { tagsEl, prevIndex } = getTagsInfo($selected.id);
              if (prevIndex >= 0) {
                setSelectedFromEl(tagsEl[prevIndex], selected);
              }
            } else if (e.key === kbd.ARROW_RIGHT) {
              e.preventDefault();
              const { tagsEl, nextIndex } = getTagsInfo($selected.id);
              if (nextIndex === -1 || nextIndex >= tagsEl.length) {
                selected.set(null);
                focusInput(ids.input, "start");
              } else {
                setSelectedFromEl(tagsEl[nextIndex], selected);
              }
            } else if (e.key === kbd.HOME) {
              e.preventDefault();
              const { tagsEl } = getTagsInfo($selected.id);
              if (tagsEl.length > 0)
                setSelectedFromEl(tagsEl[0], selected);
            } else if (e.key === kbd.END) {
              e.preventDefault();
              selected.set(null);
              focusInput(ids.input);
            } else if (e.key === kbd.DELETE) {
              e.preventDefault();
              const prevSelected = $selected;
              const { tagsEl, nextIndex } = getTagsInfo($selected.id);
              if (nextIndex === -1 || nextIndex >= tagsEl.length) {
                selected.set(null);
                focusInput(ids.input);
              } else {
                setSelectedFromEl(tagsEl[nextIndex], selected);
              }
              if (!await removeTag(prevSelected)) {
                selected.set(prevSelected);
              }
            } else if (e.key === kbd.BACKSPACE) {
              e.preventDefault();
              const prevSelected = $selected;
              const { tagsEl, nextIndex, prevIndex } = getTagsInfo($selected.id);
              if (prevIndex >= 0) {
                setSelectedFromEl(tagsEl[prevIndex], selected);
              } else {
                if (nextIndex === -1 || nextIndex >= tagsEl.length) {
                  selected.set(null);
                  focusInput(ids.input, "start");
                } else {
                  setSelectedFromEl(tagsEl[nextIndex], selected);
                }
              }
              if (!await removeTag(prevSelected)) {
                selected.set(prevSelected);
              }
            }
          } else {
            if (e.key === kbd.ENTER) {
              e.preventDefault();
              const value = node.value;
              if (!value)
                return;
              if (isInputValid(value)) {
                if (await addTag(value)) {
                  node.value = "";
                  inputValue.set("");
                }
              } else {
                setDataInvalid(ids, invalid);
              }
            } else if (node.selectionStart === 0 && node.selectionEnd === 0 && (e.key === kbd.ARROW_LEFT || e.key === kbd.BACKSPACE)) {
              e.preventDefault();
              const { tagsEl } = getTagsInfo("");
              const lastTag = tagsEl.at(-1);
              setSelectedFromEl(lastTag, selected);
            }
          }
        }),
        addEventListener(node, "input", (e) => {
          inputValue.set(e.target.value);
        })
      );
      return {
        destroy: unsub
      };
    }
  });
  const tag = builder(name("tag"), {
    stores: [selected, options],
    returned: ([$selected, $options]) => {
      return (tag2) => {
        const disabled = $options.disabled || tag2.disabled;
        const selected2 = disabled ? void 0 : $selected?.id === tag2?.id;
        return {
          "aria-selected": selected2,
          "data-selected": selected2 ? "" : void 0,
          "data-tag-value": tag2.value,
          "data-tag-id": tag2.id,
          "data-disabled": disabled ? "" : void 0,
          disabled,
          tabindex: -1
        };
      };
    }
  });
  const deleteTrigger = builder(name("delete-trigger"), {
    stores: [selected, options],
    returned: ([$selected, $options]) => {
      return (tag2) => {
        const disabled = $options.disabled || tag2.disabled;
        const selected2 = disabled ? void 0 : $selected?.id === tag2?.id;
        return {
          "aria-selected": selected2,
          "data-selected": selected2 ? "" : void 0,
          "data-tag-value": tag2.value,
          "data-tag-id": tag2.id,
          "data-disabled": disabled ? "" : void 0,
          disabled,
          tabindex: -1
        };
      };
    },
    action: (node) => {
      const getElArgs = () => {
        const value = node.getAttribute("data-tag-value") ?? "";
        const id = node.getAttribute("data-tag-id") ?? "";
        const disabled = node.hasAttribute("data-disabled");
        return {
          value,
          id,
          disabled
        };
      };
      const unsub = executeCallbacks(
        addEventListener(node, "click", (e) => {
          e.stopPropagation();
          const args2 = getElArgs();
          if (args2.disabled)
            return;
          removeTag({ id: args2.id, value: args2.value });
          const inputEl = getElementByMeltId(ids.input);
          if (inputEl)
            inputEl.focus();
        })
      );
      return {
        destroy: unsub
      };
    }
  });
  const isSelected = derived(selected, ($selected) => {
    return (tag2) => $selected?.id === tag2.id;
  });
  effect(inputValue, () => {
    clearDataInvalid(ids, invalid);
  });
  return {
    root,
    tag,
    deleteTrigger,
    input,
    options,
    tags,
    value: derived(inputValue, ($inputValue) => $inputValue),
    invalid: derived(invalid, ($invalid) => $invalid),
    selected,
    isSelected
  };
}
export {
  createTagsInput as c
};
