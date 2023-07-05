import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateDialogArgs",
  description: "The configuration object passed to the `createDialog` builder function.",
  args: [
    {
      label: "role",
      type: "'dialog' | 'alert-dialog'",
      default: "'dialog'"
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    },
    {
      label: "closeOnEscape",
      type: "boolean",
      default: true
    },
    {
      label: "closeOnOutsideClick",
      type: "boolean",
      default: true
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Opens/closes the dialog."
    },
    {
      key: "Enter",
      description: "Opens/closes the dialog."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element within the dialog."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element within the dialog."
    },
    {
      key: "Esc",
      description: "Closes the dialog and moves focus to the trigger element."
    }
  ]
};
const schemas = {
  builder,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Fully managed focus",
    "Can be controlled or uncontrolled",
    "Esc closes the component automaticlaly"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Dialog`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `A window overlaid on either the primary window or another dialog window, rendering the content
	underneath inert.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Construction, "Docs.Construction").$$render($$result, {}, {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1igo93q">Trigger:</b> The button(s) that open the dialog`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1x7v8oq">Overlay:</b> The dim background that is typically behind a dialog element.`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-tk2yx7">Content:</b> Container for the content within the dialog.
		${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
                default: () => {
                  return `<b data-svelte-h="svelte-14vc8l4">Title:</b>The title of the dialog`;
                }
              })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
                default: () => {
                  return `<b data-svelte-h="svelte-m97jtc">Description:</b> The description which supports the title`;
                }
              })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
                default: () => {
                  return `<b data-svelte-h="svelte-dgc5fa">Close:</b> The button(s) that close the dialog`;
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
      return `To create a dialog, use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createDialog`;
        }
      })} builder function. You can then reference
	the anatomy or example above to create your dialog.`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Example Components`;
    }
  })} ${validate_component(Docs.H3, "Docs.H3").$$render($$result, {}, {}, {
    default: () => {
      return `Drawer`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, { class: "text-base" }, {}, {
    default: () => {
      return `This overlay window can be used to display a variety of content, including dialogs, drawers,
	sidebars, and more. As an example, here&#39;s a drawer component that slides in from the left.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.drawer), {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Adheres to the
	${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog/"
        },
        {},
        {
          default: () => {
            return `Dialog WAI-ARIA design pattern`;
          }
        }
      )} &amp; ${validate_component(Docs.A, "Docs.A").$$render(
        $$result,
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/"
        },
        {},
        {
          default: () => {
            return `Alert Dialog WAI-ARIA design pattern`;
          }
        }
      )}`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
