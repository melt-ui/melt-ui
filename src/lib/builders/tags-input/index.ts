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
import { deleteTagById, focusInput, type Tag, type TagArgs } from './helpers';

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
	// blur?: 'nothing' | 'add' | 'clear';
};

const defaults = {
	placeholder: 'Enter tags...',
	disabled: false,
	tags: [],
	unique: false,
	// blur: 'nothing',
} satisfies Defaults<CreateTagsInputArgs>;

export function createTagsInput(args?: CreateTagsInputArgs) {
	const withDefaults = { ...defaults, ...args } as CreateTagsInputArgs;

	// Options store
	const options = writable(omit(withDefaults, 'tags', 'selectedTag'));

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
				'data-melt-part': 'tags-input',
				disabled: $options.disabled,
			} as const;
		}),
		// Action => use:root.action
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'click', () => {
					// Focus on the input when the root is clicked
					selectedTag.set(null);
					const inputEl = getElementByMeltId(ids.input);
					if (inputEl) inputEl.focus();
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
				'data-melt-part': 'tags-input-input',
				'data-disabled': $options.disabled,
				disabled: $options.disabled,
				placeholder: $options.placeholder,
			};
		}),
		// Action => use:input.action
		action: (node: HTMLInputElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'keydown', (e) => {
					// on any keydown, clear selected tag
					selectedTag.set(null);

					if (e.key === kbd.ENTER) {
						e.preventDefault();
						const value = node.value;
						if (!value) return;

						// Do not add when tags are unique and this tag already exists
						const $options = get(options);
						const $tags = get(tags);

						if ($options.unique) {
							const index = $tags.findIndex((tag) => tag.value === value);
							if (index >= 0) {
								// Select the tag
								selectedTag.set($tags[index]);
								return;
							}
						}

						// Add tag
						tags.update((currentTags) => [...currentTags, { id: generateId(), value: node.value }]);
						node.value = '';

						return;
					}

					if (e.key === kbd.ARROW_LEFT || (e.key === kbd.BACKSPACE && node.selectionStart === 0)) {
						// Move to the last tag (if there is one)
						const el = e.currentTarget as HTMLElement;
						const root = el.closest('[data-melt-part="tags-input"]') as HTMLElement;

						const tags = Array.from(
							root.querySelectorAll('[data-melt-part="tags-input-tag"]')
						) as Array<HTMLElement>;

						// Go to the first tag
						e.preventDefault();
						tags.at(-1)?.focus();

						return;
					}
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
					'data-melt-part': 'tags-input-tag',
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					'data-tag-value': tag.value,
					'data-tag-id': tag.id,
					'data-disabled': disabled ? '' : undefined,
					tabindex: tag.disabled ? -1 : 0,
				};
			};
		}),
		// Action => use:tag.action
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
				addEventListener(node, 'focus', (e) => {
					// Simulate a click on focus
					const el = e.currentTarget as HTMLElement;
					el.click();
				}),
				addEventListener(node, 'click', (e) => {
					e.stopPropagation();
					const args = getElArgs();

					// Do nothing when disabled
					if (args.disabled) return;

					const $selectedTag = get(selectedTag);
					if ($selectedTag?.id !== args.id) selectedTag.set({ id: args.id, value: args.value });
				}),
				addEventListener(node, 'keydown', (e) => {
					const $selectedTag = get(selectedTag);

					const el = e.currentTarget as HTMLElement;
					const rootEl = el.closest('[data-melt-part="tags-input"]') as HTMLElement;

					const tagsEl = Array.from(
						rootEl.querySelectorAll('[data-melt-part="tags-input-tag"]')
					) as Array<HTMLElement>;

					const currentIndex = tagsEl.indexOf(el);
					const prevIndex = currentIndex - 1;
					const nextIndex = currentIndex + 1;

					if (e.key === kbd.ARROW_RIGHT) {
						// Go to the next tag. If this is the last tag, focus on input
						e.preventDefault();

						if (nextIndex >= tagsEl.length) {
							selectedTag.set(null);
							focusInput(ids.input);
						} else {
							tagsEl[nextIndex].focus();
						}
					} else if (e.key === kbd.ARROW_LEFT) {
						// Go to the previous tag
						e.preventDefault();
						if (prevIndex >= 0) tagsEl[prevIndex].focus();
					} else if (e.key === kbd.HOME) {
						// Go to the first tag
						e.preventDefault();
						tagsEl[0].focus();
					} else if (e.key === kbd.END) {
						// Focus on the input
						e.preventDefault();
						selectedTag.set(null);
						focusInput(ids.input);
					} else if ($selectedTag !== null && e.key === kbd.DELETE) {
						// Delete this tag and move to the next tag. If there is no next tag
						// focus on input
						e.preventDefault();

						if (nextIndex >= tagsEl.length) {
							// Focus on the input when the root is clicked
							selectedTag.set(null);
							focusInput(ids.input);
						} else {
							// Set the next tag as selected
							const value = tagsEl[nextIndex].getAttribute('data-tag-value') ?? '';
							const id = tagsEl[nextIndex].getAttribute('data-tag-id') ?? '';
							selectedTag.set({ id, value });
						}

						// Delete the current tag
						const currentId = node.getAttribute('data-tag-id') ?? '';
						deleteTagById(currentId, tags);
					} else if ($selectedTag !== null && e.key === kbd.BACKSPACE) {
						// Delete this tag and move to the previous tag. If there is no previous,
						// move to the next tag. If there is no next tag, focus on input
						e.preventDefault();

						let previousEL: HTMLElement | null = null;

						if (prevIndex >= 0) {
							const value = tagsEl[prevIndex].getAttribute('data-tag-value') ?? '';
							const id = tagsEl[prevIndex].getAttribute('data-tag-id') ?? '';
							selectedTag.set({ id, value });

							previousEL = rootEl.querySelector(`[data-tag-id="${id}"]`);
						} else {
							const nextIndex = currentIndex + 1;

							if (nextIndex >= tagsEl.length) {
								// Focus on the input when the root is clicked
								selectedTag.set(null);
								focusInput(ids.input);
							} else {
								// Set the next tag as selected
								const value = tagsEl[nextIndex].getAttribute('data-tag-value') ?? '';
								const id = tagsEl[nextIndex].getAttribute('data-tag-id') ?? '';
								selectedTag.set({ id, value });
							}
						}

						// Delete the current tag
						const currentId = node.getAttribute('data-tag-id') ?? '';
						deleteTagById(currentId, tags);

						// Fix issue whereby when a tag is deleted the focus can sometimes
						// 'shift'
						if (previousEL) previousEL.focus();
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
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
					'data-melt-part': 'tags-input-delete-trigger',
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					'data-tag-value': tag.value,
					'data-tag-id': tag.id,
					'data-disabled': disabled ? '' : undefined,
					disabled: disabled ? true : undefined,
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
		input,
		options,
		selectedTag,
		isSelected,
		tags,
		tag,
		deleteTrigger,
	};
}
