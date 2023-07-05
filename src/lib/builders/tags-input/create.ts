import {
	addEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	kbd,
	omit,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import { clearDataInvalid, focusInput, setDataInvalid, setSelectedFromEl } from './helpers';
import type { CreateTagsInputArgs, Tag, TagArgs } from './types';

const defaults = {
	placeholder: 'Enter tags...',
	disabled: false,
	tags: [],
	unique: false,
	blur: 'nothing',
	addOnPaste: false,
	allowed: [],
	denied: [],
} satisfies Defaults<CreateTagsInputArgs>;

type TagsInputParts = '' | 'input' | 'tag' | 'delete-trigger';
const { name, selector } = createElHelpers<TagsInputParts>('tags-input');

export function createTagsInput(args?: CreateTagsInputArgs) {
	const withDefaults = { ...defaults, ...args } as CreateTagsInputArgs;

	// Options store
	const options = writable(omit(withDefaults, 'tags', 'selected'));

	// A store representing the current input value. A readable version is exposed to the
	// user
	const inputValue = writable('');

	const invalid = writable(false);

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

	// Runs several validation checks. When a validation fails, it returns false
	// immediately
	const isInputValid = (v: string) => {
		const $options = get(options);
		const $tags = get(tags);

		// Tag uniqueness
		if ($options.unique) {
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

	// Selected tag store. When `null`, no tag is selected
	const selected = writable<Tag | null>(withDefaults.selected ?? null);

	// Adds a tag to the $tags store. It calls  the async $options.add function if set. If this
	// function returns a reject, the data is invalidated and not added to the $tags store
	const addTag = async (v: string) => {
		const $options = get(options);

		let t: Tag;

		if ($options.add) {
			try {
				const res = await $options.add(v);

				if (typeof res === 'string') {
					t = { id: generateId(), value: res };
				} else {
					t = res;
					if (!t.id) t.id = generateId();
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

	// Remove a tag from the $tags store. It calls the async $options.remove function if set.
	// If this function returns false, the tag is not removed.
	const removeTag = async (t: Tag) => {
		const $options = get(options);

		if ($options.remove) {
			try {
				if (!(await $options.remove(t))) return false;
			} catch {
				setDataInvalid(ids, invalid);
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

	// UUID for specific containers
	const ids = {
		root: generateId(),
		input: generateId(),
	};

	const root = builder(name(''), {
		stores: options,
		returned: ($options) => {
			return {
				'data-disabled': $options.disabled ? true : undefined,
				'data-melt-id': ids.root,
				disabled: $options.disabled,
			} as const;
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'mousedown', (e) => {
					focusInput(ids.input);
					const targetEL = (e.target as HTMLElement).closest(selector('tag'));
					if (targetEL) {
						e.preventDefault();
						setSelectedFromEl(targetEL, selected);
					}
				}),
				addEventListener(node, 'click', (e) => {
					focusInput(ids.input);
					const targetEL = (e.target as HTMLElement).closest(selector('tag'));
					setSelectedFromEl(targetEL, selected);
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
		action: (node: HTMLElement) => {
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
					// Set data-focus
					const rootEl = getElementByMeltId(ids.root);
					if (rootEl) rootEl.setAttribute('data-focus', '');
					node.setAttribute('data-focus', '');
				}),
				addEventListener(node, 'blur', async () => {
					// Clear data-focus
					const rootEl = getElementByMeltId(ids.root);
					if (rootEl) rootEl.removeAttribute('data-focus');
					node.removeAttribute('data-focus');

					// Clear selected tag
					selected.set(null);

					// Do nothing when input is empty
					const value = (node as HTMLInputElement).value;
					if (!value) return;

					// Handle on:blur add tag || clear input
					const $options = get(options);

					if ($options.blur === 'clear') {
						(node as HTMLInputElement).value = '';
					} else if ($options.blur === 'add') {
						if (isInputValid(value) && (await addTag(value))) {
							(node as HTMLInputElement).value = '';
							inputValue.set('');
						} else {
							setDataInvalid(ids, invalid);
						}
					}
				}),
				addEventListener(node, 'paste', async (e) => {
					// Do nothing when there is nothing to paste
					if (!e.clipboardData) return;
					const pastedText = e.clipboardData.getData('text');
					if (!pastedText) return;

					const $options = get(options);

					if (!$options.addOnPaste) {
						return;
					}

					// Update value with the pasted text
					if (isInputValid(pastedText)) {
						// Prevent default as we are going to add a new tag
						e.preventDefault();
						if (await addTag(pastedText)) {
							(node as HTMLInputElement).value = '';
						} else {
							// Adding tag failed
							(node as HTMLInputElement).value = pastedText;
						}
					} else {
						setDataInvalid(ids, invalid);
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
							if (!(await removeTag(prevSelected))) {
								selected.set(prevSelected);
							}
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
							if (!(await removeTag(prevSelected))) {
								selected.set(prevSelected);
							}
						}
					} else {
						// ENTER
						if (e.key === kbd.ENTER) {
							e.preventDefault();
							const value = (node as HTMLInputElement).value;
							if (!value) return;

							if (isInputValid(value)) {
								if (await addTag(value)) {
									(node as HTMLInputElement).value = '';
									inputValue.set('');
								}
							} else {
								setDataInvalid(ids, invalid);
							}
						} else if (
							(node as HTMLInputElement).selectionStart === 0 &&
							(node as HTMLInputElement).selectionEnd === 0 &&
							(e.key === kbd.ARROW_LEFT || e.key === kbd.BACKSPACE)
						) {
							e.preventDefault();
							const { tagsEl } = getTagsInfo('');
							const lastTag = tagsEl.at(-1) as HTMLElement;
							setSelectedFromEl(lastTag, selected);
						}
					}
				}),
				addEventListener(node, 'input', (e) => {
					inputValue.set((e.target as HTMLInputElement).value);
				})
			);
			return {
				destroy: unsub,
			};
		},
	});

	const tag = builder(name('tag'), {
		stores: [selected, options],
		returned: ([$selected, $options]) => {
			return (tag: TagArgs) => {
				const disabled = $options.disabled || tag.disabled;
				const selected = disabled ? undefined : $selected?.id === tag?.id;

				return {
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					'data-tag-value': tag.value,
					'data-tag-id': tag.id,
					'data-disabled': disabled ? '' : undefined,
					disabled: disabled,
					tabindex: -1,
				};
			};
		},
	});

	const deleteTrigger = builder(name('delete-trigger'), {
		stores: [selected, options],
		returned: ([$selected, $options]) => {
			return (tag: TagArgs) => {
				const disabled = $options.disabled || tag.disabled;
				const selected = disabled ? undefined : $selected?.id === tag?.id;

				return {
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					'data-tag-value': tag.value,
					'data-tag-id': tag.id,
					'data-disabled': disabled ? '' : undefined,
					disabled: disabled,
					tabindex: -1,
				};
			};
		},
		action: (node: HTMLElement) => {
			const getElArgs = () => {
				const value = node.getAttribute('data-tag-value') ?? '';
				const id = node.getAttribute('data-tag-id') ?? '';
				const disabled = node.hasAttribute('data-disabled');

				return {
					value,
					id,
					disabled,
				};
			};

			const unsub = executeCallbacks(
				addEventListener(node, 'click', (e) => {
					e.stopPropagation();

					const args = getElArgs();

					if (args.disabled) return;

					removeTag({ id: args.id, value: args.value });

					// Put focus back on the input
					const inputEl = getElementByMeltId(ids.input);
					if (inputEl) inputEl.focus();
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

	// When the input valid changes, clear any potential invalid states
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
		isSelected,
	};
}
