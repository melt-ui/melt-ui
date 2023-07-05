import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { D as Docs } from "../../../../../chunks/index3.js";
const builder = {
  title: "CreateTagsInputArgs",
  description: "The configuration object passed to the `createTagsInput` builder function.",
  args: [
    {
      label: "placeholder",
      type: "string",
      default: "Enter tags..."
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "selected",
      type: "{id: string, value: string}"
    },
    {
      label: "tags",
      type: "string[] | {id: string, value: string}[]",
      default: "[]"
    },
    {
      label: "blur",
      type: "nothing | add | clear",
      default: "nothing"
    },
    {
      label: "unique",
      type: "boolean",
      default: false
    },
    {
      label: "addOnPaste",
      type: "boolean",
      default: false
    },
    {
      label: "maxTags",
      type: "number"
    },
    {
      label: "allowed",
      type: "string[]",
      default: "[]"
    },
    {
      label: "denied",
      type: "string[]",
      default: "[]"
    },
    {
      label: "add",
      type: "(tag: string) => Promise<Tag | string>"
    },
    {
      label: "remove",
      type: "(tag: Tag) => Promise<boolean>"
    }
  ]
};
const root = {
  title: "root",
  description: "The root component.",
  dataAttributes: [
    {
      label: "data-melt-tags-input",
      value: ""
    },
    {
      label: "data-focus",
      value: "Present when the root is in focus"
    },
    {
      label: "data-disabled",
      value: "Present when the root is disabled"
    },
    {
      label: "data-invalid",
      value: "Present when the input data is invalid"
    }
  ]
};
const input = {
  title: "input",
  description: "The input component",
  dataAttributes: [
    {
      label: "data-melt-tags-input-input",
      value: ""
    },
    {
      label: "data-disabled",
      value: "Present when the input is disabled"
    },
    {
      label: "data-focus",
      value: "Present when the input is in focus"
    },
    {
      label: "data-invalid",
      value: "Present when the input data is invalid"
    }
  ]
};
const tag = {
  title: "tag",
  description: "The tag component.",
  args: [
    {
      label: "id",
      type: "string"
    },
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
      label: "data-melt-tags-input-tag",
      value: ""
    },
    {
      label: "data-tag-id",
      value: "Tag ID"
    },
    {
      label: "data-tag-value",
      value: "Tag value"
    },
    {
      label: "data-selected",
      value: "Present when selected"
    },
    {
      label: "data-disabled",
      value: "Present when disabled"
    }
  ]
};
const deleteTrigger = {
  title: "deleteTrigger",
  description: "The tag components.",
  args: [
    {
      label: "id",
      type: "string"
    },
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
      label: "data-melt-tags-input-delete-trigger",
      value: ""
    },
    {
      label: "data-tag-id",
      value: "Unique tag ID."
    },
    {
      label: "data-tag-value",
      value: "Tag value"
    },
    {
      label: "data-selected",
      value: "Present when selected"
    },
    {
      label: "data-disabled",
      value: "Present when disabled"
    }
  ]
};
const options = {
  title: "options",
  description: "The `$options` store can be used to override initial values set during creation."
};
const tags = {
  title: "tags",
  description: "The `$tags` store holds an object array of type `Tag`. Each `Tag` consists of an id and value."
};
const selected = {
  title: "selected",
  description: "The `$selected` store holds the currently selected `Tag`, if there is one."
};
const value = {
  title: "value",
  description: "`$value` is a readable store, which holds the input value."
};
const invalid = {
  title: "invalid",
  description: "`$invalid` is a readable store of type `boolean`. When `true`, the input valid is considered invalid."
};
const isSelected = {
  title: "isSelected",
  description: "`$isSelected` is a helper function to determine if a specific `Tag` is selected.",
  args: [
    {
      label: "Tag",
      type: "{id: string, value: string}"
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "ArrowRight",
      description: "Move to the next element of `tag` or `input`"
    },
    {
      key: "ArrowLeft",
      description: "Move to the previous `tag`, if one exists"
    },
    {
      key: "Home",
      description: "Jump to the first `tag`, if one exists"
    },
    {
      key: "End",
      description: "Jump to the `input`"
    },
    {
      key: "Delete",
      description: "Delete the selected `tag` and move to the next element of `tag` or `input`"
    },
    {
      key: "Backspace",
      description: "Delete the selected `tag` and move to the previous tag. If this is the first tag, delete and move to the next element of `tag` or `input`"
    }
  ]
};
const schemas = {
  builder,
  root,
  input,
  tag,
  deleteTrigger,
  options,
  tags,
  selected,
  value,
  invalid,
  isSelected,
  keyboard
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const features = [
    "Type in the input and press enter to add tags",
    "Keyboard navigation",
    "Delete tags",
    "Disable everything or disable specific tags",
    "Only allow unique tags",
    "Add a tag on paste",
    "Set a maximum number of tags allowed",
    "Support for allowed/denied lists",
    "Provide add/remove function to call before adding/removing a tag"
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Docs.H1, "Docs.H1").$$render($$result, {}, {}, {
    default: () => {
      return `Tags Input`;
    }
  })} ${validate_component(Docs.Description, "Docs.Description").$$render($$result, {}, {}, {
    default: () => {
      return `Render tags inside an input, followed by an actual text input.`;
    }
  })} ${validate_component(Docs.Preview, "Docs.Preview").$$render($$result, Object.assign({}, data.preview), {}, {})} ${validate_component(Docs.Features, "Docs.Features").$$render($$result, { features }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Anatomy`;
    }
  })} ${validate_component(Docs.Ul, "Docs.Ul").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-ss75j2">Root:</b> The root container for the tags input`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1gd2a4a">Tag:</b> A tag element`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1u4qs53">Delete Trigger:</b> A button element which deletes a tag`;
        }
      })} ${validate_component(Docs.Li, "Docs.Li").$$render($$result, {}, {}, {
        default: () => {
          return `<b data-svelte-h="svelte-1elel2u">Input:</b> The input textbox for adding new Tags`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Usage`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Use the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `createTagsInput`;
        }
      })} builder function.
	${validate_component(Docs.Callout, "Docs.Callout").$$render($$result, { type: "info" }, {}, {
        default: () => {
          return `See ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `API Reference`;
            }
          })} › ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `CreateTagsInputArgs`;
            }
          })} for available
		arguments`;
        }
      })}`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `Use the return values to construct a ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
        default: () => {
          return `tags-input`;
        }
      })}.`;
    }
  })} ${validate_component(Docs.H4, "Docs.H4").$$render($$result, {}, {}, {
    default: () => {
      return `Add`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `An asynchronous ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `add`;
            }
          })} function may be passed into the builder. It is called
		prior to adding the tag to the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `$tags`;
            }
          })} store.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `It grants you the ability to validate the input value, set a custom id, for example from a
		backend or 3rd-party API, or update the value to always be uppercase, lowercase, etc.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `The function definition is ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `(tag: string) =&gt; Promise&lt;Tag | string&gt;`;
            }
          })},
		whereby ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `tag`;
            }
          })} is the input value.`;
        }
      })} ${validate_component(Docs.Callout, "Docs.Callout").$$render($$result, { type: "info" }, {}, {
        default: () => {
          return `A ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `Tag`;
            }
          })} is an object that consists of an ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `id`;
            }
          })} and
		${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `value`;
            }
          })}.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `On ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `resolve`;
            }
          })}, if a ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `string`;
            }
          })} is returned, an id will be
		internally generated. The same happens when a ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `Tag`;
            }
          })} without an id is returned.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `On ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `reject`;
            }
          })} or ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `error`;
            }
          })}, the input is invalidated and
		not added to the store.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `The following example sets the id via a third-party API call and forces the tag to always be
		uppercase.`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H4, "Docs.H4").$$render($$result, {}, {}, {
    default: () => {
      return `Remove`;
    }
  })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `An asynchronous ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `remove`;
            }
          })} function may be passed into the builder. It is called
		prior to removing the tag from the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `$tags`;
            }
          })} store.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `It grants the ability do something before the tag is removed from ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `$tags`;
            }
          })} store,
		such as deleting the tag from a backend database.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `The function definition is ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `(tag: Tag) =&gt; Promise&lt;boolean&gt;`;
            }
          })}, whereby
		${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `tag`;
            }
          })} is the tag to be removed from the ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `$tags`;
            }
          })} store.`;
        }
      })} ${validate_component(Docs.Callout, "Docs.Callout").$$render($$result, { type: "info" }, {}, {
        default: () => {
          return `A ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `Tag`;
            }
          })} is an object that consists of an ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `id`;
            }
          })} and
		${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `value`;
            }
          })}.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `On ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `reject`;
            }
          })}, ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `error`;
            }
          })} or ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `false`;
            }
          })},
		the tag is not removed from the store.`;
        }
      })} ${validate_component(Docs.P, "Docs.P").$$render($$result, {}, {}, {
        default: () => {
          return `The following example disallowed the tag with the value ${validate_component(Docs.Code, "Docs.Code").$$render($$result, {}, {}, {
            default: () => {
              return `one`;
            }
          })} to be deleted.`;
        }
      })}`;
    }
  })} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `API Reference`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.builder }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.root }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.input }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.tag }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.deleteTrigger }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.options }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.tags }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.selected }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.value }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.invalid }, {}, {})} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.isSelected }, {}, {})} ${validate_component(Docs.H2, "Docs.H2").$$render($$result, {}, {}, {
    default: () => {
      return `Accessibility`;
    }
  })} ${validate_component(Docs.API, "Docs.API").$$render($$result, { schema: schemas.keyboard }, {}, {})}`;
});
export {
  Page as default
};
