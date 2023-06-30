import {
	addEventListener,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	kbd,
	omit,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import {
	clearDataInvalid,
	deleteTagById,
	focusInput,
	getTagElements,
	setDataInvalid,
	setSelectedTagFromElement,
	type Tag,
	type TagArgs,
} from './helpers';

export type CreateTagsInputArgs = {
	// The default input placeholder
	placeholder?: string;
	// When `true`, prevents the user from interacting with the input and tags
	disabled?: boolean;
	// The selected tag
	selectedTag?: Tag;
	// An array of pre-populated tags
	tags?: string[] | Tag[];
	// Whether the tags should be unique
	unique?: boolean;
	// What to do on blur
	blur?: 'nothing' | 'add' | 'clear';
	// What to do on paste
	addOnPaste?: boolean;
	// Maximum number of tags
	maxTags?: number;
	// Allowed tags (undefined || 0 or lower === no max)
	allowedTags?: string[];
	// Denied tags
	deniedTags?: string[];
	// A custom validator function. A response of true means the validator passed
	validator?: (value: string) => boolean;
};

const defaults = {
	placeholder: 'Enter tags...',
	disabled: false,
	tags: [],
	unique: false,
	blur: 'nothing',
	addOnPaste: false,
	allowedTags: [],
	deniedTags: [],
} satisfies Defaults<CreateTagsInputArgs>;

const dataMeltParts = {
	root: 'tags-input',
	input: 'tags-input-input',
	tag: 'tags-input-tag',
	deleteTrigger: 'tags-input-delete-trigger',
};

export function createTagsInput(args?: CreateTagsInputArgs) {
	const withDefaults = { ...defaults, ...args } as CreateTagsInputArgs;

	// Options store
	const options = writable(omit(withDefaults, 'tags', 'selectedTag'));

	const inputValue = writable('');

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

	// Returns true if a tag is unique and false if $options.unique is true and the tag
	// already exists
	const isTagUnique = (v: string) => {
		const $options = get(options);
		const $tags = get(tags);

		if ($options.unique) {
			const index = $tags.findIndex((tag) => tag.value === v);
			return index === -1;
		}

		// Already return true when $options.unique === false
		return true;
	};

	// Returns true if a tag is in $options.allowedTags. If $options.allowedTags is empty
	// return true
	const isTagAllowed = (v: string) => {
		const $options = get(options);

		// When empty, it is allowed
		if ($options.allowedTags?.length === 0) return true;

		return $options.allowedTags?.includes(v);
	};

	// Returns true if a tag is in $options.deniedTags. If $options.deniedTags is empty
	// return false
	const isTagDenied = (v: string) => {
		const $options = get(options);

		// When empty, it is not denied
		if ($options.deniedTags?.length === 0) return false;

		return $options.deniedTags?.includes(v);
	};

	// Returns the result of $options.validator(). If undefined, return true
	const validator = (v: string) => {
		const $options = get(options);

		if ($options.validator === undefined) return true;

		return $options.validator(v);
	};

	// Returns the result of $options.validator(). If undefined, return true
	const isMaxTags = () => {
		const $options = get(options);
		const $tags = get(tags);

		if ($options.maxTags === undefined || $options.maxTags <= 0) return false;

		return $tags.length == $options.maxTags;
	};

	// Selected tag store. When `null`, no tag is selected
	const selectedTag = writable<Tag | null>(withDefaults.selectedTag ?? null);

	const ids = {
		root: generateId(),
		input: generateId(),
	};

	// Attributes and an action to apply to the root element
	const root = {
		// Attributes => {...$root}
		...derived(options, ($options) => {
			return {
				role: 'tagsinput',
				'data-disabled': $options.disabled ? true : undefined,
				'data-melt-id': ids.root,
				'data-melt-part': dataMeltParts['root'],
				disabled: $options.disabled,
			} as const;
		}),
		// Action => use:root.action
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'mousedown', (e) => {
					focusInput(ids.input);

					// Set the selected tag
					const tagTargetEL = (e.target as HTMLElement).closest(
						`[data-melt-part="${dataMeltParts['tag']}"]`
					);

					if (tagTargetEL) {
						e.preventDefault();
						setSelectedTagFromElement(tagTargetEL, selectedTag);
					}
				}),
				addEventListener(node, 'click', (e) => {
					focusInput(ids.input);

					// Set the selected tag
					const delegatedTarget = (e.target as HTMLElement).closest(
						`[data-melt-part="${dataMeltParts['tag']}"]`
					);
					setSelectedTagFromElement(delegatedTarget, selectedTag);
				})
			);
			return {
				destroy: unsub,
			};
		},
	};

	// Attributes and an action to apply to the input
	const input = {
		// Attributes => {...$input}
		...derived(options, ($options) => {
			return {
				'data-melt-id': ids.input,
				'data-melt-part': dataMeltParts['input'],
				'data-disabled': $options.disabled ? '' : undefined,
				disabled: $options.disabled,
				placeholder: $options.placeholder,
			};
		}),
		// Action => use:input.action
		action: (node: HTMLInputElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'focus', () => {
					// Set data-focus
					const rootEl = getElementByMeltId(ids.root);
					if (rootEl) rootEl.setAttribute('data-focus', '');
					node.setAttribute('data-focus', '');
				}),
				addEventListener(node, 'blur', () => {
					// Clear data-focus
					const rootEl = getElementByMeltId(ids.root);
					if (rootEl) rootEl.removeAttribute('data-focus');
					node.removeAttribute('data-focus');

					// Clear selected tag
					selectedTag.set(null);

					// Do nothing when input is empty
					const value = node.value;
					if (!value) return;

					// Handle on:blur add tag || clear input
					const $options = get(options);

					if ($options.blur === 'clear') {
						node.value = '';
					} else if ($options.blur === 'add') {
						if (isTagUnique(value)) {
							// Add new tag
							tags.update((currentTags) => [
								...currentTags,
								{ id: generateId(), value: node.value },
							]);
							node.value = '';
						} else {
							// Tag is not unique. Set data-invalid
							setDataInvalid(ids.root, ids.input);
						}
					}
				}),
				addEventListener(node, 'paste', (e) => {
					// Do nothing when there is nothing to paste
					if (!e.clipboardData) return;
					const pastedText = e.clipboardData.getData('text');
					if (!pastedText) return;

					// Clear data-invalid
					clearDataInvalid(ids.root, ids.input);

					const $options = get(options);

					if (!$options.addOnPaste) {
						return;
					}

					// Update value with the pasted text
					if (
						isTagUnique(pastedText) &&
						isTagAllowed(pastedText) &&
						!isTagDenied(pastedText) &&
						!isMaxTags() &&
						validator(pastedText)
					) {
						// Prevent default as we are going to add a new tag
						e.preventDefault();
						tags.update((currentTags) => [...currentTags, { id: generateId(), value: pastedText }]);
						node.value = '';
					} else {
						// Tag is not unique. Set data-invalid
						setDataInvalid(ids.root, ids.input);
					}
				}),
				addEventListener(node, 'keydown', (e) => {
					const $selectedTag = get(selectedTag);

					if ($selectedTag) {
						// Check if a character is entered into the input
						if (e.key.length === 1) {
							// Clear data-invalid
							clearDataInvalid(ids.root, ids.input);

							// A character is entered, set selectedTag to null
							selectedTag.set(null);
						} else if (e.key === kbd.ARROW_LEFT) {
							// Move to the previous tag
							e.preventDefault();

							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const selectedIndex = tagsEl.findIndex(
								(element) => element.getAttribute('data-tag-id') === $selectedTag.id
							);
							const prevIndex = selectedIndex - 1;

							if (prevIndex >= 0) {
								setSelectedTagFromElement(tagsEl[prevIndex], selectedTag);
							}
						} else if (e.key === kbd.ARROW_RIGHT) {
							// Move to the next element of tag or input
							e.preventDefault();

							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const selectedIndex = tagsEl.findIndex(
								(element) => element.getAttribute('data-tag-id') === $selectedTag.id
							);
							const nextIndex = selectedIndex + 1;

							if (nextIndex >= tagsEl.length) {
								selectedTag.set(null);
								focusInput(ids.input, 'start');
							} else {
								setSelectedTagFromElement(tagsEl[nextIndex], selectedTag);
							}
						} else if (e.key === kbd.HOME) {
							// Jump to the first tag or do nothing
							e.preventDefault();
							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							if (tagsEl.length > 0) setSelectedTagFromElement(tagsEl[0], selectedTag);
						} else if (e.key === kbd.END) {
							// Jump to the input
							e.preventDefault();
							selectedTag.set(null);
							focusInput(ids.input);
						} else if (e.key === kbd.DELETE) {
							// Delete this tag and move to the next element of tag or input
							e.preventDefault();

							const prevSelectedId = $selectedTag.id;
							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const selectedIndex = tagsEl.findIndex(
								(element) => element.getAttribute('data-tag-id') === $selectedTag.id
							);
							const nextIndex = selectedIndex + 1;

							if (nextIndex >= tagsEl.length) {
								selectedTag.set(null);
								focusInput(ids.input);
							} else {
								setSelectedTagFromElement(tagsEl[nextIndex], selectedTag);
							}

							// Delete the previously selected tag
							deleteTagById(prevSelectedId, tags);
						} else if (e.key === kbd.BACKSPACE) {
							// Delete this tag and move to the previous tag. If this is the
							// first tag, delete and move to the next element of tag or input
							e.preventDefault();
							const prevSelectedId = $selectedTag.id;

							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const selectedIndex = tagsEl.findIndex(
								(element) => element.getAttribute('data-tag-id') === $selectedTag.id
							);
							const prevIndex = selectedIndex - 1;
							const nextIndex = selectedIndex + 1;

							if (prevIndex >= 0) {
								setSelectedTagFromElement(tagsEl[prevIndex], selectedTag);
							} else {
								if (nextIndex >= tagsEl.length) {
									selectedTag.set(null);
									focusInput(ids.input, 'start');
								} else {
									setSelectedTagFromElement(tagsEl[nextIndex], selectedTag);
								}
							}

							// Delete the previously selected tag
							deleteTagById(prevSelectedId, tags);
						}
					} else {
						if (e.key.length === 1) {
							// Clear data-invalid
							clearDataInvalid(ids.root, ids.input);
						}

						// ENTER
						if (e.key === kbd.ENTER) {
							e.preventDefault();
							const value = node.value;
							if (!value) return;

							if (
								isTagUnique(value) &&
								isTagAllowed(value) &&
								!isTagDenied(value) &&
								!isMaxTags() &&
								validator(value)
							) {
								// Prevent default as we are going to add a new tag
								tags.update((currentTags) => [...currentTags, { id: generateId(), value: value }]);

								node.value = '';
								inputValue.set('');
							} else {
								// Tag is not unique. Set data-invalid
								setDataInvalid(ids.root, ids.input);
							}
						} else if (
							node.selectionStart === 0 &&
							node.selectionEnd === 0 &&
							(e.key === kbd.ARROW_LEFT || e.key === kbd.BACKSPACE)
						) {
							e.preventDefault();

							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const lastTag = tagsEl.at(-1) as HTMLElement;
							setSelectedTagFromElement(lastTag, selectedTag);
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
	};

	// Attributes and an action to apply to each tag
	const tag = {
		// Attributes => {...$tag}
		...derived([selectedTag, options], ([$selectedTag, $options]) => {
			return (tag: TagArgs) => {
				const disabled = $options.disabled || tag.disabled;
				const selected = disabled ? undefined : $selectedTag?.id === tag?.id;

				return {
					role: 'tag',
					'data-melt-part': dataMeltParts['tag'],
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					'data-tag-value': tag.value,
					'data-tag-id': tag.id,
					'data-disabled': disabled ? '' : undefined,
					disabled: disabled,
					tabindex: -1,
				};
			};
		}),
	};

	// Attributes and an action to apply each delete trigger
	const deleteTrigger = {
		// Attributes => {...$deleteTrigger}
		...derived([selectedTag, options], ([$selectedTag, $options]) => {
			return (tag: TagArgs) => {
				const disabled = $options.disabled || tag.disabled;
				const selected = disabled ? undefined : $selectedTag?.id === tag?.id;

				return {
					role: 'tag-delete-trigger',
					'data-melt-part': dataMeltParts['deleteTrigger'],
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					'data-tag-value': tag.value,
					'data-tag-id': tag.id,
					'data-disabled': disabled ? '' : undefined,
					disabled: disabled,
					tabindex: -1,
				};
			};
		}),
		// Action => use:deleteTrigger.action
		action: (node: HTMLElement) => {
			const getElArgs = () => {
				const id = node.getAttribute('data-tag-id') ?? '';
				const disabled = node.hasAttribute('data-disabled');

				return {
					id,
					disabled,
				};
			};

			const unsub = executeCallbacks(
				addEventListener(node, 'click', (e) => {
					e.stopPropagation();

					const args = getElArgs();

					if (args.disabled) return;

					deleteTagById(args.id, tags);

					// Put focus back on the input
					const inputEl = getElementByMeltId(ids.input);
					if (inputEl) inputEl.focus();
				})
			);

			return {
				destroy: unsub,
			};
		},
	};

	// Used to determine if a tag is selected
	const isSelected = derived(selectedTag, ($selectedTag) => {
		return (tag: Tag) => $selectedTag?.id === tag.id;
	});

	return {
		root,
		tag,
		deleteTrigger,
		input,
		options,
		tags,
		value: derived(inputValue, ($inputValue) => $inputValue),
		selectedTag,
		isSelected,
	};
}
