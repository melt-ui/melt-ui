import {
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	isBrowser,
	isHTMLElement,
	kbd,
	omit,
	overridable,
	styleToString,
	toWritableStores,
	addMeltEventListener,
	disabledAttr,
} from '$lib/internal/helpers/index.js';
import type { Defaults, MeltActionReturn } from '$lib/internal/types.js';
import { derived, get, readonly, writable } from 'svelte/store';
import { focusInput, highlightText, setSelectedFromEl } from './helpers.js';
import type { CreateTagsInputProps, Tag, TagProps } from './types.js';
import { tick } from 'svelte';
import type { TagsInputEvents } from './events.js';
import { generateIds } from '../../internal/helpers/id';

const defaults = {
	placeholder: '',
	disabled: false,
	editable: true,
	defaultTags: [],
	unique: false,
	trim: true,
	blur: 'nothing',
	addOnPaste: false,
	maxTags: undefined,
	allowed: [],
	denied: [],
	add: undefined,
	remove: undefined,
	update: undefined,
} satisfies Defaults<CreateTagsInputProps>;

type TagsInputParts = '' | 'tag' | 'delete-trigger' | 'edit' | 'input';
const { name, attribute, selector } = createElHelpers<TagsInputParts>('tags-input');

export function createTagsInput(props?: CreateTagsInputProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateTagsInputProps;

	const meltIds = generateIds(['root', 'input']);

	const options = toWritableStores(omit(withDefaults, 'tags'));
	const {
		placeholder,
		disabled,
		editable,
		unique,
		trim,
		blur,
		addOnPaste,
		allowed,
		denied,
		add,
		remove,
		update,
		maxTags,
	} = options;

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

	const tagsWritable =
		withDefaults.tags ??
		writable<Tag[]>(
			withDefaults.defaultTags && withDefaults.defaultTags.length > 0
				? typeof withDefaults.defaultTags[0] === 'string'
					? (withDefaults.defaultTags as string[]).map((tag) => ({ id: generateId(), value: tag }))
					: (withDefaults.defaultTags as Tag[])
				: [] // if undefined)
		);
	const tags = overridable<Tag[]>(tagsWritable, withDefaults?.onTagsChange);

	// Selected tag store. When `null`, no tag is selected
	const selected = writable<Tag | null>(withDefaults.selected ?? null);

	const editing = writable<Tag | null>(null);

	// Run validation checks and if a validation fails return false immediately
	const isInputValid = (v: string) => {
		const $tags = get(tags);
		const $editing = get(editing);
		const $allowed = get(allowed);
		const $denied = get(denied);
		const $maxTags = get(maxTags);

		// Trim the validation value before validations
		if (get(trim)) v = v.trim();

		// Tag uniqueness
		if (get(unique) && $editing?.value !== v) {
			const index = $tags.findIndex((tag) => tag.value === v);
			if (index >= 0) return false;
		}

		// Allowed list is populated and this value is not in it
		if ($allowed && $allowed.length > 0 && !$allowed.includes(v)) return false;

		// Deny list is populated and this value is in it
		if ($denied && $denied.length > 0 && $denied.includes(v)) return false;

		if ($maxTags && $maxTags > 0 && $tags.length >= $maxTags) return false;

		return true;
	};

	// Add a tag to the $tags store. Calls `$options.add()` if set
	const addTag = async (v: string) => {
		const $add = get(add);

		let workingTag = { id: '', value: v };

		if ($add) {
			try {
				const res = await $add(v);

				if (typeof res === 'string') workingTag.value = res;
				else workingTag = res;

				if (!workingTag.id) workingTag.id = generateId();
			} catch {
				return false;
			}
		} else {
			workingTag.id = generateId();
		}

		// Trim the value, only after the user defined add function
		if (get(trim)) workingTag.value = workingTag.value.trim();

		// if it's not valid we don't add it to the tags list
		if (!isInputValid(workingTag.value)) return false;

		tags.update((current) => {
			current.push(workingTag);
			return current;
		});
		return true;
	};

	// Update a tag in the $tags store. Calls `$options.update()` if set
	async function updateTag(tag: Tag, select = false) {
		const $update = get(update);

		// Store the id, incase it changes during the update
		const oldId = tag.id;

		let workingTag = tag;

		if ($update) {
			try {
				const res = await $update(workingTag);
				workingTag = res;

				// If the id was wiped, give it a new one
				if (!workingTag.id) workingTag.id = generateId();
			} catch {
				return false;
			}
		}

		// Trim the value, only after the user defined update function
		if (get(trim)) workingTag.value = workingTag.value.trim();

		// if it's not valid we don't add it to the tags list
		if (!isInputValid(workingTag.value)) return false;

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
	}

	// Remove a tag from the $tags store. Calls `$options.remove()` if set
	async function removeTag(t: Tag) {
		const $remove = get(remove);

		if ($remove) {
			try {
				if (!(await $remove(t))) return false;
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
	}

	const root = builder(name(''), {
		stores: [disabled],
		returned: ([$disabled]) => {
			return {
				'data-melt-id': meltIds.root,
				'data-disabled': disabledAttr($disabled),
				disabled: disabledAttr($disabled),
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<TagsInputEvents['root']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'mousedown', (e) => {
					// Focus on input when root is the target
					const target = e.target;
					if (!isHTMLElement(target)) return;
					if (target.hasAttribute(attribute())) {
						e.preventDefault();
						focusInput(meltIds.input);
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const input = builder(name('input'), {
		stores: [disabled, placeholder],
		returned: ([$disabled, $placeholder]) => {
			return {
				'data-melt-id': meltIds.input,
				'data-disabled': disabledAttr($disabled),
				disabled: disabledAttr($disabled),
				placeholder: $placeholder,
			};
		},
		action: (node: HTMLInputElement): MeltActionReturn<TagsInputEvents['input']> => {
			const getTagsInfo = (id: string) => {
				const rootEl = getElementByMeltId(meltIds.root);

				let tagsEl: Array<Element> = [];
				let selectedIndex = -1;
				let prevIndex = -1;
				let nextIndex = -1;

				if (rootEl) {
					tagsEl = Array.from(rootEl.querySelectorAll(selector('tag')));

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
				addMeltEventListener(node, 'focus', () => {
					// Set data-focus on root and input
					const rootEl = getElementByMeltId(meltIds.root);
					if (rootEl) rootEl.setAttribute('data-focus', '');
					node.setAttribute('data-focus', '');
				}),
				addMeltEventListener(node, 'blur', async () => {
					// Clear data-focus from root and input
					const rootEl = getElementByMeltId(meltIds.root);
					if (rootEl) rootEl.removeAttribute('data-focus');
					node.removeAttribute('data-focus');

					// Clear selected tag
					selected.set(null);

					// Do nothing when input is empty
					const value = node.value;
					if (!value) return;

					// Handle clear or add (if set)
					const $blur = get(blur);

					if ($blur === 'clear') {
						node.value = '';
					} else if ($blur === 'add') {
						if (isInputValid(value) && (await addTag(value))) {
							node.value = '';
							inputValue.set('');
						} else {
							inputInvalid.set(true);
						}
					}
				}),
				addMeltEventListener(node, 'paste', async (e) => {
					// Do nothing when there is nothing to paste
					// if (addOnPaste) {
					// 	e.preventDefault();
					// }
					if (!e.clipboardData) return;
					const pastedText = e.clipboardData.getData('text');
					if (!pastedText) return;

					// Do nothing when addOnPaste is false
					if (!get(addOnPaste)) return;
					else e.preventDefault();

					// Update value with the pasted text or set invalid
					if (isInputValid(pastedText) && (await addTag(pastedText))) {
						node.value = '';
					} else {
						inputInvalid.set(true);
					}
				}),
				addMeltEventListener(node, 'keydown', async (e) => {
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
								focusInput(meltIds.input, 'start');
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
							focusInput(meltIds.input);
						} else if (e.key === kbd.DELETE) {
							// Delete this tag and move to the next element of tag or input
							e.preventDefault();

							const prevSelected = $selected;
							const { tagsEl, nextIndex } = getTagsInfo($selected.id);

							if (nextIndex === -1 || nextIndex >= tagsEl.length) {
								selected.set(null);
								focusInput(meltIds.input);
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
									focusInput(meltIds.input, 'start');
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
							const lastTag = tagsEl.at(-1);
							if (!lastTag) return;
							setSelectedFromEl(lastTag, selected);
						}
					}
				}),
				addMeltEventListener(node, 'input', () => {
					inputValue.set(node.value);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const tag = builder(name('tag'), {
		stores: [selected, editing, disabled, editable],
		returned: ([$selected, $editing, $disabled, $editable]) => {
			return (tag: TagProps) => {
				const disabled = $disabled || tag.disabled;
				const editable = $editable && tag.editable !== false;
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
					'data-disabled': disabledAttr(disabled),
					disabled: disabledAttr(disabled),
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
		action: (node: HTMLDivElement): MeltActionReturn<TagsInputEvents['tag']> => {
			const getElProps = () => {
				const id = node.getAttribute('data-tag-id') ?? '';

				return {
					id,
				};
			};

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'mousedown', (e) => {
					// Do nothing when editing any tag
					const $editing = get(editing);
					if ($editing && $editing.id !== getElProps().id) return;

					// Focus on the input and set this as the selected tag
					focusInput(meltIds.input);
					e.preventDefault();
					setSelectedFromEl(node, selected);
					editing.set(null);
				}),
				addMeltEventListener(node, 'click', (e) => {
					// Do nothing when editing any tag
					const $editing = get(editing);
					if ($editing && $editing.id === getElProps().id) return;

					// Focus on the input and set this as the selected tag
					focusInput(meltIds.input);
					e.preventDefault();
					setSelectedFromEl(node, selected);
					editing.set(null);
				}),
				addMeltEventListener(node, 'dblclick', async () => {
					if (!isBrowser) return;

					// Do nothing when it is not editable
					if (!node.hasAttribute('data-editable')) return;

					// Do nothing when there is no edit container
					const editEl = document.querySelector(
						selector('edit') + `[data-tag-id="${getElProps().id}"]`
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
					highlightText(selector('edit') + `[data-tag-id="${getElProps().id}"]`);
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const deleteTrigger = builder(name('delete-trigger'), {
		stores: [selected, editing, disabled, editable],
		returned: ([$selected, $editing, $disabled, $editable]) => {
			return (tag: TagProps) => {
				const disabled = $disabled || tag.disabled;
				const editable = $editable && tag.editable !== false;
				const selected = disabled ? undefined : $selected?.id === tag?.id;
				const editing = editable ? $editing?.id === tag?.id : undefined;

				return {
					'aria-selected': selected,
					'data-tag-id': tag.id,
					'data-tag-value': tag.value,
					'data-selected': selected ? '' : undefined,
					'data-editing': editing ? '' : undefined,
					'data-disabled': disabledAttr(disabled),
					disabled: disabledAttr(disabled),
					tabindex: -1,
				};
			};
		},
		action: (node: HTMLElement): MeltActionReturn<TagsInputEvents['deleteTrigger']> => {
			function handleDelete() {
				if (node.hasAttribute('data-disabled')) return;

				// Remove the tag and put focus on the input
				const value = node.getAttribute('data-tag-value') ?? '';
				const id = node.getAttribute('data-tag-id') ?? '';

				removeTag({ id, value });
				focusInput(meltIds.input);
			}
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					// Do nothing when disabled
					e.stopPropagation();
					handleDelete();
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					handleDelete();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const edit = builder(name('edit'), {
		stores: [editing, editable],
		returned: ([$editing, $editable]) => {
			return (tag: Tag) => {
				const editable = $editable;
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
		action: (node: HTMLElement): MeltActionReturn<TagsInputEvents['edit']> => {
			const getElProps = () => {
				const id = node.getAttribute('data-tag-id') ?? '';
				const value = node.getAttribute('data-tag-value') ?? '';

				return {
					id,
					value,
				};
			};

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'blur', () => {
					if (node.hasAttribute('hidden')) return;

					// Stop editing, reset the value to the original and clear an invalid state
					editing.set(null);
					node.textContent = getElProps().value;
					getElementByMeltId(meltIds.root)?.removeAttribute('data-invalid-edit');
					node.removeAttribute('data-invalid-edit');
				}),
				addMeltEventListener(node, 'keydown', async (e) => {
					if (node.hasAttribute('hidden')) return;

					if (e.key === kbd.ENTER) {
						// Capture the edit value, validate and then update
						e.preventDefault();

						// Do nothing when the value is empty
						const value = node.textContent;
						if (!value) return;

						const t = { id: getElProps().id, value };

						if (isInputValid(value) && (await updateTag(t, true))) {
							node.textContent = t.value;
							editValue.set('');
							focusInput(meltIds.input);
						} else {
							getElementByMeltId(meltIds.root)?.setAttribute('data-invalid-edit', '');
							node.setAttribute('data-invalid-edit', '');
						}
					} else if (e.key === kbd.ESCAPE) {
						// Reset the value, clear the edit value store, set this tag as
						// selected and focus on input
						e.preventDefault();
						node.textContent = getElProps().value;
						editValue.set('');
						setSelectedFromEl(node, selected);
						focusInput(meltIds.input);
					}
				}),
				addMeltEventListener(node, 'input', () => {
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
			getElementByMeltId(meltIds.root)?.setAttribute('data-invalid', '');
			getElementByMeltId(meltIds.input)?.setAttribute('data-invalid', '');
		} else {
			getElementByMeltId(meltIds.root)?.removeAttribute('data-invalid');
			getElementByMeltId(meltIds.input)?.removeAttribute('data-invalid');
		}
	});

	// When the input valid changes, clear any potential invalid states
	effect(editValue, () => {
		if (!isBrowser) return;
		getElementByMeltId(meltIds.root)?.removeAttribute('data-invalid-edit');

		const invalidEl = Array.from(
			document.querySelectorAll(selector('edit') + '[data-invalid-edit]')
		);
		invalidEl.forEach((e) => {
			e.removeAttribute('data-invalid-edit');
		});
	});

	return {
		ids: meltIds,
		elements: {
			root,
			input,
			deleteTrigger,
			edit,
			tag,
		},
		states: {
			tags,
			inputValue: readonly(inputValue),
			inputInvalid: readonly(inputInvalid),
			selected: readonly(selected),
		},
		helpers: {
			isSelected,
			isInputValid,
			addTag,
			updateTag,
			removeTag,
		},
		options,
	};
}
