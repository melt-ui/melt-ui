import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const usage2 = '<script lang="ts">\n    import { createContextMenu } from "@melt-ui/svelte";\n    const { menu, item, trigger, arrow } = createContextMenu()\n<\/script>\n\n<span {...$trigger} use:trigger.action>Right click here.</span>\n<div {...$menu} use:menu.action>\n    <div {...item} use:item.action>...</div>\n    <div {...item} use:item.action>...</div>\n    <div {...item} use:item.action>...</div>\n    <div {...arrow} />\n</div>';
const usage3 = `<a href="/1" {...item} use:item.action>Item 1</a>
<div {...item} use:item.action={{ onSelect: (e) => console.log('Item 2!')}}>Item 2</div>
<div {...item} use:item.action={{ onSelect: (e) => console.log('Item 3!')}}>Item 3</div>`;
const usage4 = "<div\n    {...item}\n    use:item.action={{\n        onSelect: (e) => {\n            e.preventDefault();\n            console.log('Item 2!')\n        }\n    }}\n>\nItem 2\n</div>";
const usage = '<script lang="ts">\n    import { createContextMenu } from "@melt-ui/svelte";\n    const { menu, item, trigger, arrow } = createContextMenu()\n<\/script>';
const snippets = {
  usage,
  usage2,
  usage3,
  usage4
};
const builder = {
  title: "CreateContextMenuArgs",
  description: "The configuration object passed to the `createContextMenu` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig",
      default: "placement: 'bottom'"
    },
    {
      label: "arrowSize",
      type: "number",
      default: 8
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    }
  ]
};
const menu = {
  title: "Menu",
  description: "The element which wraps the entire dropdown menu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"menu"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-melt-menu]",
      value: "Present on the menu element."
    }
  ]
};
const trigger = {
  title: "Trigger",
  description: "The element which when right clicked inside, opens the context menu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"trigger"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    }
  ]
};
const arrow = {
  title: "Arrow",
  description: "An optional arrow element which points to the trigger.",
  dataAttributes: [
    {
      label: "[data-arrow]",
      value: "`true`"
    },
    {
      label: "[data-melt-part]",
      value: ['"arrow"']
    }
  ]
};
const item = {
  title: "Item",
  description: "A basic menu item.",
  args: [
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const checkboxItem = {
  title: "Checkbox Item",
  description: "A checkbox menu item.",
  args: [
    {
      label: "checked",
      type: "Writable<boolean>"
    },
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const radioGroupBuilder = {
  title: "CreateMenuRadioGroupArgs",
  description: "The configuration object passed to the `createMenuRadioGroup` builder function.",
  args: [
    {
      label: "value",
      type: "string"
    }
  ]
};
const radioGroup = {
  title: "Menu Radio Group",
  description: "A group of radio menu items.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"radio-group"']
    }
  ]
};
const radioItem = {
  title: "Radio Group Item",
  description: "A radiogroup menu item.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    },
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const separator = {
  title: "Separator",
  description: "A horizontal line which separates menu items.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"separator"']
    }
  ]
};
const submenuBuilder = {
  title: "CreateDropdownSubMenuArgs",
  description: "The configuration object passed to the `createDropdownSubMenu` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig",
      default: "placement: 'right'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    }
  ]
};
const submenu = {
  title: "Submenu",
  description: "A submenu element displayed when its trigger is selected.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"submenu"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-melt-menu]",
      value: "Present on the submenu element."
    }
  ]
};
const subTrigger = {
  title: "Sub Trigger",
  description: "A button which opens its associated submenu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"subtrigger"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-disabled]",
      value: "Present if the element is disabled"
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item."
    },
    {
      key: "Enter",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item."
    },
    {
      key: "ArrowDown",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, shifts focus to the next item."
    },
    {
      key: "ArrowUp",
      description: "When focused on an `item`, shifts focus to the next item.."
    },
    {
      key: "ArrowRight",
      description: "When focused on a `subTrigger`, opens the `subMenu` and focuses the first item."
    },
    {
      key: "ArrowLeft",
      description: "When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`."
    },
    {
      key: "Esc",
      description: "Closes the dropdown menu and focuses the `trigger`."
    }
  ]
};
const schemas = {
  builder,
  radioGroup,
  radioItem,
  radioGroupBuilder,
  checkboxItem,
  menu,
  arrow,
  item,
  trigger,
  keyboard,
  subTrigger,
  submenu,
  submenuBuilder,
  separator
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Can be controlled or uncontrolled.",
    "Supports submenus with configurable reading direction.",
    "Customize menu positioning.",
    "Optionally render a pointing arrow.",
    "Fully managed focus.",
    "Full keyboard navigation.",
    "Typeahead support"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Context Menu`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `Displays a menu at the pointer&#39;s position when the trigger is right-clicked or long-pressed.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {
    default: () => {
      return `More examples and documentation coming soon!`;
    }
  })} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The element which when right clicked, opens the context menu.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-fgsx7z">Menu:</b> The root container for the popover menu`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1je5gc7">Item:</b> A menuitem which can be a link or a function.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-muyy4u">Checkbox Item:</b> A menu item which can be checked or unchecked.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-5hjjd6">Radio Group:</b> A group of radio items.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-6uw1no">Radio Item:</b> A menu item which can be selected from a group of items.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-123ot74">Sub Trigger:</b> A button which toggles the submenu&#39;s open state.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-o9bbtx">Sub Menu:</b> A menu which is nested inside another menu.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1vq4ljh">Separator:</b> A visual divider between menu items.`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `The first thing you need to do is create a dropdown menu using the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createDropdownMenu`;
        }
      })} function.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.usage }, {}, {})} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Then you can use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `menu`;
        }
      })}, ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `item`;
        }
      })}, and ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `trigger`;
        }
      })} to construct a dropdown menu. A high level example of how to structure the menu is shown below.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.usage2 }, {}, {})} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `The ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `trigger`;
        }
      })} sits outside of the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `menu`;
        }
      })} and is used to
	toggle the menu&#39;s open state. The ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `item`;
        }
      })} elements go inside the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `menu`;
        }
      })} element. The ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `arrow`;
        }
      })} element is optional and can be used to render an arrow
	which points to the trigger.`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `At this point, our menu doesn&#39;t really do much except open and close. To add functionality, we
	could turn the \`item\` elements into links, or we could pass a custom ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `onSelect`;
        }
      })}
	function to the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `item.action`;
        }
      })}, which will be called when that item is
	selected.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.usage3 }, {}, {})} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `If you wanted to prevent the default behavior that occurs when you select an item, you can call
	${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `e.preventDefault()`;
        }
      })}
	in your
	${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `onSelect`;
        }
      })}
	function, which will prevent the default behavior from occurring.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.usage4 }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.menu }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.trigger }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.item }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.checkboxItem }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.radioGroupBuilder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.radioGroup }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.radioItem }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.submenuBuilder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.submenu }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.subTrigger }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.separator }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"
        },
        {},
        {
          default: () => {
            return `Menu WAI-ARIA design pattern`;
          }
        }
      )} &amp; ${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/"
        },
        {},
        {
          default: () => {
            return `Menu Button WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
