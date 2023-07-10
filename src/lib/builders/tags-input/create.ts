import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	isBrowser,
	kbd,
	omit,
	styleToString,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import { focusInput, highlightText, setSelectedFromEl } from './helpers';
import type { CreateTagsInputArgs, Tag, TagArgs } from './types';
import { tick } from 'svelte';

const defaults = {
	placeholder: '',
	disabled: false,
	editable: true,
	tags: [],
	unique: false,
	blur: 'nothing',
	addOnPaste: false,
	allowed: [],
	denied: [],
} satisfies Defaults<CreateTagsInputArgs>;

type TagsInputParts = '' | 'tag' | 'delete-trigger' | 'edit' | 'input';
const { name, attribute, selector } = createElHelpers<TagsInputParts>('tags-input');

export function createTagsInput(args?: CreateTagsInputArgs) {
	const withDefaults = { ...defaults, ...args } as CreateTagsInputArgs;

	// UUID for specific containers
	const ids = {
		root: generateId(),
		input: generateId(),
	};

	// Options store
	const options = writable(omit(withDefaults, 'tags', 'selected'));

	// A store representing the current input value. A readable version is exposed to the
	// user
	const inputValue = writable('');

	// True when the input is invalid
	const inputInvalid = writable(false);

	// A store representing the current edit value.
	const editValue = writable('');

	// Tags store of type Tag[]
	//
	// `withDefaults.tags` can be
	//   - undefined => set empty []
	//   - string[]  => generate Tag[] from string[]
	//   - Tag[]     => set Tag[]
	const tags = writable<Tag[]>(
		withDefaults.tags && withDefaults.tags.length > 0
			? typeof withDefaults.tags[0] === 'string'
				? (withDefaults.tags as string[]).map((tag) => ({ id: generateId(), value: tag }))
				: (withDefaults.tags as Tag[])
			: [] // if undefined
	);

	// Selected tag store. When `null`, no tag is selected
	const selected = writable<Tag | null>(withDefaults.selected ?? null);

	const editing = writable<Tag | null>(null);

	// Run validation checks and if a validation fails return false immediately
	const isInputValid = (v: string) => {
		const $options = get(options);
		const $tags = get(tags);
		const $editing = get(editing);

		// Tag uniqueness
		if ($options.unique && $editing?.value !== v) {
			const index = $tags.findIndex((tag) => tag.value === v);
			if (index >= 0) return false;
		}

		// Allowed list is populated and this value is not in it
		if ($options.allowed && $options.allowed.length > 0 && !$options.allowed.includes(v))
			return false;

		// Deny list is populated and this value is in it
		if ($options.denied && $options.denied.length > 0 && $options.denied.includes(v)) return false;

		if ($options.maxTags && $options.maxTags > 0 && $tags.length >= $options.maxTags) return false;

		return true;
	};

	// Add a tag to the $tags store. Calls `$options.add()` if set
	const addTag = async (v: string) => {
		const $options = get(options);

		let workingTag = { id: '', value: v };

		if ($options.add) {
			try {
				const res = await $options.add(v);

				if (typeof res === 'string') workingTag.value = res;
				else workingTag = res;

				if (!workingTag.id) workingTag.id = generateId();
			} catch {
				return false;
			}
		} else {
			workingTag.id = generateId();
		}

		tags.update((current) => [...current, workingTag]);
		return true;
	};

	// Update a tag in the $tags store. Calls `$options.update()` if set
	const updateTag = async (tag: Tag, select = false) => {
		const $options = get(options);

		// Store the id, incase it changes during the update
		const oldId = tag.id;

		let workingTag = tag;

		if ($options.update) {
			try {
				const res = await $options.update(workingTag);
				workingTag = res;

				// If the id was wiped, give it a new one
				if (!workingTag.id) workingTag.id = generateId();
			} catch {
				return false;
			}
		}

		// Update the tag matching the old id
		tags.update(($tags) => {
			return $tags.map((t) => {
				if (t.id === oldId) {
					return workingTag;
				}

				return t;
			});
		});

		if (select) selected.set(workingTag);

		return true;
	};

	// Remove a tag from the $tags store. Calls `$options.remove()` if set
	const removeTag = async (t: Tag) => {
		const $options = get(options);

		if ($options.remove) {
			try {
				if (!(await $options.remove(t))) return false;
			} catch {
				return false;
			}
		}

		const $tags = get(tags);
		const index = $tags.findIndex((tag) => tag.id === t.id);
		tags.update((t) => {
			t.splice(index, 1);
			return t;
		});

		return true;
	};

	const root = builder(name(''), {
		stores: options,
		returned: ($options) => {
			return {
				'data-melt-id': ids.root,
				'data-disabled': $options.disabled ? true : undefined,
				disabled: $options.disabled,
			} as const;
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'mousedown', (e) => {
					// Focus on input when root is the target
					if ((e.target as HTMLElement).hasAttribute(attribute())) {
						e.preventDefault();
						focusInput(ids.input);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const input = builder(name('input'), {
		stores: options,
		returned: ($options) => {
			return {
				'data-melt-id': ids.input,
				'data-disabled': $options.disabled ? '' : undefined,
				disabled: $options.disabled,
				placeholder: $options.placeholder,
			};
		},
		action: (node: HTMLInputElement) => {
			const getTagsInfo = (id: string) => {
				const rootEl = getElementByMeltId(ids.root);

				let tagsEl: Array<HTMLElement> = [];
				let selectedIndex = -1;
				let prevIndex = -1;
				let nextIndex = -1;

				if (rootEl) {
					tagsEl = Array.from(rootEl.querySelectorAll(selector('tag'))) as Array<HTMLElement>;

					selectedIndex = tagsEl.findIndex((element) => element.getAttribute('data-tag-id') === id);

					prevIndex = selectedIndex - 1;
					nextIndex = selectedIndex + 1;
				}

				return {
					tagsEl,
					selectedIndex,
					prevIndex,
					nextIndex,
				};
			};

			const unsub = executeCallbacks(
				addEventListener(node, 'focus', () => {
					// Set data-focus on root and input
					const rootEl = getElementByMeltId(ids.root);
					if (rootEl) rootEl.setAttribute('data-focus', '');
					node.setAttribute('data-focus', '');
				}),
				addEventListener(node, 'blur', async () => {
					// Clear data-focus from root and input
					const rootEl = getElementByMeltId(ids.root);
					if (rootEl) rootEl.removeAttribute('data-focus');
					node.removeAttribute('data-focus');

					// Clear selected tag
					selected.set(null);

					// Do nothing when input is empty
					const value = node.value;
					if (!value) return;

					// Handle clear or add (if set)
					const $options = get(options);

					if ($options.blur === 'clear') {
						node.value = '';
					} else if ($options.blur === 'add') {
						if (isInputValid(value) && (await addTag(value))) {
							node.value = '';
							inputValue.set('');
						} else {
							inputInvalid.set(true);
						}
					}
				}),
				addEventListener(node, 'paste', async (e) => {
					// Do nothing when there is nothing to paste
					if (!e.clipboardData) return;
					const pastedText = e.clipboardData.getData('text');
					if (!pastedText) return;

					// Do nothing when addOnPaste is false
					if (!get(options).addOnPaste) return;

					// Update value with the pasted text or set invalid
					if (isInputValid(pastedText) && (await addTag(pastedText))) {
						node.value = '';
					} else {
						inputInvalid.set(true);
					}
				}),
				addEventListener(node, 'keydown', async (e) => {
					const $selected = get(selected);

					if ($selected) {
						// Check if a character is entered into the input
						if (e.key.length === 1) {
							selected.set(null);
						} else if (e.key === kbd.ARROW_LEFT) {
							// Move to the previous tag
							e.preventDefault();
							const { tagsEl, prevIndex } = getTagsInfo($selected.id);
							if (prevIndex >= 0) {
								setSelectedFromEl(tagsEl[prevIndex], selected);
							}
						} else if (e.key === kbd.ARROW_RIGHT) {
							// Move to the next element of tag or input
							e.preventDefault();

							const { tagsEl, nextIndex } = getTagsInfo($selected.id);

							if (nextIndex === -1 || nextIndex >= tagsEl.length) {
								selected.set(null);
								focusInput(ids.input, 'start');
							} else {
								setSelectedFromEl(tagsEl[nextIndex], selected);
							}
						} else if (e.key === kbd.HOME) {
							// Jump to the first tag or do nothing
							e.preventDefault();
							const { tagsEl } = getTagsInfo($selected.id);
							if (tagsEl.length > 0) setSelectedFromEl(tagsEl[0], selected);
						} else if (e.key === kbd.END) {
							// Jump to the input
							e.preventDefault();
							selected.set(null);
							focusInput(ids.input);
						} else if (e.key === kbd.DELETE) {
							// Delete this tag and move to the next element of tag or input
							e.preventDefault();

							const prevSelected = $selected;
							const { tagsEl, nextIndex } = getTagsInfo($selected.id);

							if (nextIndex === -1 || nextIndex >= tagsEl.length) {
								selected.set(null);
								focusInput(ids.input);
							} else {
								setSelectedFromEl(tagsEl[nextIndex], selected);
							}

							// Delete the previously selected tag
							if (!(await removeTag(prevSelected))) selected.set(prevSelected);
						} else if (e.key === kbd.BACKSPACE) {
							// Delete this tag and move to the previous tag. If this is the
							// first tag, delete and move to the next element of tag or input
							e.preventDefault();
							const prevSelected = $selected;

							const { tagsEl, nextIndex, prevIndex } = getTagsInfo($selected.id);

							if (prevIndex >= 0) {
								setSelectedFromEl(tagsEl[prevIndex], selected);
							} else {
								if (nextIndex === -1 || nextIndex >= tagsEl.length) {
									selected.set(null);
									focusInput(ids.input, 'start');
								} else {
									setSelectedFromEl(tagsEl[nextIndex], selected);
								}
							}

							// Delete the previously selected tag
							if (!(await removeTag(prevSelected))) selected.set(prevSelected);
						} else if (e.key === kbd.ENTER) {
							// Start editing this selected tag
							e.preventDefault();

							// Do nothing when there is no edit container
							const editEl = document.querySelector(
								selector('edit') + `[data-tag-id="${$selected.id}"]`
							);
							if (!editEl) return;

							editing.set({ id: $selected.id, value: $selected.value });

							editEl.textContent = $selected.value;

							// Let it become visible then select all
							await tick();
							highlightText(selector('edit') + `[data-tag-id="${$selected.id}"]`);
						}
					} else {
						if (e.key === kbd.ENTER) {
							// Add a new tag (if valid)
							e.preventDefault();
							const value = node.value;
							if (!value) return;

							if (isInputValid(value) && (await addTag(value))) {
								node.value = '';
								inputValue.set('');
							} else {
								inputInvalid.set(true);
							}
						} else if (
							node.selectionStart === 0 &&
							node.selectionEnd === 0 &&
							(e.key === kbd.ARROW_LEFT || e.key === kbd.BACKSPACE)
						) {
							// At the start of the input. Move the the last tag (if there is one)
							e.preventDefault();
							const { tagsEl } = getTagsInfo('');
							const lastTag = tagsEl.at(-1) as HTMLElement;
							setSelectedFromEl(lastTag, selected);
						}
					}
				}),
				addEventListener(node, 'input', () => {
					inputValue.set(node.value);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const tag = builder(name('tag'), {
		stores: [selected, editing, options],
		returned: ([$selected, $editing, $options]) => {
			return (tag: TagArgs) => {
				const disabled = $options.disabled || tag.disabled;
				const editable = $options.editable && tag.editable !== false;
				const selected = disabled ? undefined : $selected?.id === tag?.id;
				const editing = editable ? $editing?.id === tag?.id : undefined;

				return {
					'aria-hidden': editing,
					'aria-selected': selected,
					'data-tag-id': tag.id,
					'data-tag-value': tag.value,
					'data-selected': selected ? '' : undefined,
					'data-editable': editable ? '' : undefined,
					'data-editing': editing ? '' : undefined,
					'data-disabled': disabled ? '' : undefined,
					disabled: disabled,
					hidden: editing,
					tabindex: -1,
					style: editing
						? styleToString({
								position: 'absolute',
								opacity: 0,
								'pointer-events': 'none',
								margin: 0,
						  })
						: undefined,
				};
			};
		},
		action: (node: HTMLDivElement) => {
			const getElArgs = () => {
				const id = node.getAttribute('data-tag-id') ?? '';

				return {
					id,
				};
			};

			const unsub = executeCallbacks(
				addEventListener(node, 'mousedown', (e) => {
					// Do nothing when editing any tag
					const $editing = get(editing);
					if ($editing && $editing.id !== getElArgs().id) return;

					// Focus on the input and set this as the selected tag
					focusInput(ids.input);
					e.preventDefault();
					setSelectedFromEl(node, selected);
					editing.set(null);
				}),
				addEventListener(node, 'click', (e) => {
					// Do nothing when editing any tag
					const $editing = get(editing);
					if ($editing && $editing.id === getElArgs().id) return;

					// Focus on the input and set this as the selected tag
					focusInput(ids.input);
					e.preventDefault();
					setSelectedFromEl(node, selected);
					editing.set(null);
				}),
				addEventListener(node, 'dblclick', async () => {
					if (!isBrowser) return;

					// Do nothing when it is not editable
					if (!node.hasAttribute('data-editable')) return;

					// Do nothing when there is no edit container
					const editEl = document.querySelector(
						selector('edit') + `[data-tag-id="${getElArgs().id}"]`
					);
					if (!editEl) return;

					// Start editing this tag
					const value = node.getAttribute('data-tag-value') ?? '';
					editing.set({
						id: node.getAttribute('data-tag-id') ?? '',
						value,
					});

					editEl.textContent = value;

					// Let it become visible then select all text
					await tick();
					highlightText(selector('edit') + `[data-tag-id="${getElArgs().id}"]`);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const deleteTrigger = builder(name('delete-trigger'), {
		stores: [selected, editing, options],
		returned: ([$selected, $editing, $options]) => {
			return (tag: TagArgs) => {
				const disabled = $options.disabled || tag.disabled;
				const editable = $options.editable && tag.editable !== false;
				const selected = disabled ? undefined : $selected?.id === tag?.id;
				const editing = editable ? $editing?.id === tag?.id : undefined;

				return {
					'aria-selected': selected,
					'data-tag-id': tag.id,
					'data-tag-value': tag.value,
					'data-selected': selected ? '' : undefined,
					'data-editing': editing ? '' : undefined,
					'data-disabled': disabled ? '' : undefined,
					disabled: disabled,
					tabindex: -1,
				};
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'click', (e) => {
					// Do nothing when disabled
					e.stopPropagation();
					if (node.hasAttribute('data-disabled')) return;

					// Remove the tag and put focus on the input
					const value = node.getAttribute('data-tag-value') ?? '';
					const id = node.getAttribute('data-tag-id') ?? '';

					removeTag({ id, value });
					focusInput(ids.input);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const edit = builder(name('edit'), {
		stores: [editing, options],
		returned: ([$editing, $options]) => {
			return (tag: Tag) => {
				const editable = $options.editable;
				const editing = editable ? $editing?.id === tag.id : undefined;

				return {
					'aria-hidden': !editing,
					'data-tag-id': tag.id,
					'data-tag-value': tag.value,
					hidden: !editing ? true : undefined,
					contenteditable: editing,
					tabindex: -1,
					style: !editing
						? styleToString({
								position: 'absolute',
								opacity: 0,
								'pointer-events': 'none',
								margin: 0,
						  })
						: undefined,
				};
			};
		},
		action: (node: HTMLDivElement) => {
			const getElArgs = () => {
				const id = node.getAttribute('data-tag-id') ?? '';
				const value = node.getAttribute('data-tag-value') ?? '';

				return {
					id,
					value,
				};
			};

			const unsub = executeCallbacks(
				addEventListener(node, 'blur', () => {
					if (node.hasAttribute('hidden')) return;

					// Stop editing, reset the value to the original and clear an invalid state
					editing.set(null);
					(node as HTMLElement).textContent = getElArgs().value;
					getElementByMeltId(ids.root)?.removeAttribute('data-invalid-edit');
					node.removeAttribute('data-invalid-edit');
				}),
				addEventListener(node, 'keydown', async (e) => {
					if (node.hasAttribute('hidden')) return;

					if (e.key === kbd.ENTER) {
						// Capture the edit value, validate and then update
						e.preventDefault();

						// Do nothing when the value is empty
						const value = node.textContent;
						if (!value) return;

						const t = { id: getElArgs().id, value };

						if (isInputValid(value) && (await updateTag(t, true))) {
							(node as HTMLElement).textContent = t.value;
							editValue.set('');
							focusInput(ids.input);
						} else {
							getElementByMeltId(ids.root)?.setAttribute('data-invalid-edit', '');
							node.setAttribute('data-invalid-edit', '');
						}
					} else if (e.key === kbd.ESCAPE) {
						// Reset the value, clear the edit value store, set this tag as
						// selected and focus on input
						e.preventDefault();
						(node as HTMLElement).textContent = getElArgs().value;
						editValue.set('');
						setSelectedFromEl(node, selected);
						focusInput(ids.input);
					}
				}),
				addEventListener(node, 'input', () => {
					if (node.hasAttribute('hidden')) return;

					// Update the edit value store
					editValue.set(node.textContent || '');
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	// Used to determine if a tag is selected
	const isSelected = derived(selected, ($selected) => {
		return (tag: Tag) => $selected?.id === tag.id;
	});

	// When the input value changes, set inputInvalid to false
	effect(inputValue, () => {
		inputInvalid.set(false);
	});

	// Flip the data-invalid attribute based upon the inputInvalid store
	effect(inputInvalid, ($inputInvalid) => {
		if ($inputInvalid) {
			getElementByMeltId(ids.root)?.setAttribute('data-invalid', '');
			getElementByMeltId(ids.input)?.setAttribute('data-invalid', '');
		} else {
			getElementByMeltId(ids.root)?.removeAttribute('data-invalid');
			getElementByMeltId(ids.input)?.removeAttribute('data-invalid');
		}
	});

	// When the input valid changes, clear any potential invalid states
	effect(editValue, () => {
		if (!isBrowser) return;
		getElementByMeltId(ids.root)?.removeAttribute('data-invalid-edit');

		const invalidEl = Array.from(
			document.querySelectorAll(selector('edit') + '[data-invalid-edit]')
		) as Array<HTMLElement>;
		invalidEl.forEach((e) => {
			e.removeAttribute('data-invalid-edit');
		});
	});

	return {
		root,
		input,
		tag,
		deleteTrigger,
		edit,
		options,
		tags,
		selected,
		inputValue: derived(inputValue, ($inputValue) => $inputValue),
		inputInvalid: derived(inputInvalid, ($inputInvalid) => $inputInvalid),
		isSelected,
	};
}
