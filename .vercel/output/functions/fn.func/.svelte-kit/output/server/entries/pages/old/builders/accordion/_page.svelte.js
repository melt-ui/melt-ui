import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const disable = `<div class="accordion-item" {...$item({ value: 'item-3', disabled: true })}>
    Item 3
</div>
`;
const controlled = "<script lang=\"ts\">\n	import { createAccordion } from '@melt-ui/svelte';\n\n	let value: string | string[] | undefined = 'item-1';\n	let disabled = false;\n\n	const {\n		content,\n		item,\n		trigger,\n		root,\n		value: valueStore,\n		options,\n	} = createAccordion({\n		value,\n		disabled,\n	});\n\n	$: valueStore.set(value);\n	valueStore.subscribe((v) => (value = v));\n	$: options.update((o) => ({ ...o, disabled }));\n<\/script>\n\n<button\n	on:click={() => {\n		const randPick = Math.floor(Math.random() * 3) + 1;\n		value = `item-${randPick}`;\n	}}\n>\n	Trigger randomly\n</button>\n\n<p>Value: {value} Value Store: {$valueStore}</p>\n\n<div {...root}>\n	<div {...$item('item-1')}>\n		<button {...$trigger('item-1')} use:trigger.action>Is it accessible?</button>\n		<div {...$content('item-1')}>\n			<div>Yes. It adheres to the WAI-ARIA design pattern.</div>\n		</div>\n	</div>\n\n	<div {...$item('item-2')}>\n		<button {...$trigger('item-2')} use:trigger.action>Is it accessible?</button>\n		<div {...$content('item-2')}>\n			<div>Yes. It adheres to the WAI-ARIA design pattern.</div>\n		</div>\n	</div>\n\n	<div {...$item('item-3')}>\n		<button {...$trigger('item-3')} use:trigger.action>Is it accessible?</button>\n		<div {...$content('item-3')}>\n			<div>Yes. It adheres to the WAI-ARIA design pattern.</div>\n		</div>\n	</div>\n</div>\n";
const snippets = {
  disable,
  controlled
};
const builder = {
  title: "CreateAccordionArgs",
  description: "The configuration object passed to the `createAccordion` builder function.",
  args: [
    {
      label: "type",
      type: ["'single'", "'multiple'"],
      default: "'single'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "value",
      type: ["string", "string[]", "undefined"]
    }
  ]
};
const root = {
  title: "Root",
  description: "Contains all the parts of an accordion.",
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    }
  ]
};
const item = {
  title: "Item",
  description: "Contains all the parts of a collapsible section.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-disabled]",
      value: ["true", "undefined"]
    }
  ]
};
const trigger = {
  title: "Trigger",
  description: "Toggles the collapsed state of an item. It should be nested inside of its associated `item`.",
  args: [
    {
      label: "type",
      type: ['"single"', '"multiple"'],
      default: "'single'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "value",
      type: ["string", "string[]", "undefined"]
    }
  ],
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ["trigger"]
    },
    {
      label: "[data-disabled]",
      value: ["true", "undefined"]
    },
    {
      label: "[data-value]",
      value: "The value of the associated item."
    }
  ]
};
const content = {
  title: "Content",
  description: "Contains the collapsible content for an accordion item.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-disabled]",
      value: ["true", "undefined"]
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When the `trigger` of a collapsed section is focused, expands the section."
    },
    {
      key: "Enter",
      description: "When the `trigger` of a collapsed section is focused, expands the section."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element"
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next `trigger` element."
    },
    {
      key: "ArrowUp",
      description: "Moves focus to the previous `trigger` element."
    },
    {
      key: "Home",
      description: "When focus is on a `trigger`, moves focus to the first `trigger`."
    },
    {
      key: "End",
      description: "When focus is on a `trigger`, moves focus to the last `trigger`."
    }
  ]
};
const schemas = {
  builder,
  content,
  root,
  item,
  trigger,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Full keyboard navigation",
    "Can expand one or multiple items",
    "Can be controlled or uncontrolled"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Accordion`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A vertically stacked set of interactive headings that each reveal an associated section of
	content.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview, { fullwidth: true }), {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the accordion`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1je5gc7">Item:</b> The container for each accordion item
		${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
                default: () => {
                  return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The trigger for the accordion item`;
                }
              })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
                default: () => {
                  return `<b data-svelte-h="svelte-tk2yx7">Content:</b> The content area that is revealed when the trigger is clicked`;
                }
              })}`;
            }
          })}`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To create an accordion, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createAccordion`;
        }
      })} builder function. Follow the
	anatomy or the example above to create your accordion.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Disabling a single item`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To disable a single item, you can pass in an object instead of a string to the function.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.disable }, {}, {})} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Opening multiple items at once`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Pass in the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `type`;
        }
      })} arg to ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createAccordion`;
        }
      })} with a value
	of ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `&#39;multiple&#39;`;
        }
      })}.`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Controlled access`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `To programatically control the Accordion, you can directly set the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `value`;
        }
      })} store.
	You can also update the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `options`;
        }
      })} store with new arguments.`;
    }
  })} ${validate_component(Docs.CodeBlock, "Docs.CodeBlock").$$render($$result, { code: snippets.controlled }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.root }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.item }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.trigger }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.content }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
        },
        {},
        {
          default: () => {
            return `Accordion WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
