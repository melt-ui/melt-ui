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
import { deleteTagById, focusInput, getTagElements, type Tag, type TagArgs } from './helpers';
import type { CreateTagsInputArgs } from './types';

const defaults = {
	placeholder: 'Enter tags...',
	disabled: false,
	tags: [],
	unique: false,
	// blur: 'nothing',
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
				'data-melt-part': dataMeltParts['root'],
				disabled: $options.disabled,
			} as const;
		}),
		// Action => use:root.action
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'click', (e) => {
					const delegatedTarget = (e.target as HTMLElement).closest(
						'[data-melt-part=tags-input-tag]'
					);

					if (delegatedTarget) {
						selectedTag.set({
							id: delegatedTarget.getAttribute('data-tag-id') ?? '',
							value: delegatedTarget.getAttribute('data-tag-value') ?? '',
						});
					} else {
						// Focus on the input when the root is clicked
						selectedTag.set(null);
						const inputEl = getElementByMeltId(ids.input);
						if (inputEl) inputEl.focus();
					}
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
				'data-disabled': $options.disabled,
				disabled: $options.disabled,
				placeholder: $options.placeholder,
			};
		}),
		// Action => use:input.action
		action: (node: HTMLInputElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'keydown', (e) => {
					const $selectedTag = get(selectedTag);

					if ($selectedTag) {
						// Check if a character is entered into the input
						if (e.key.length === 1) {
							// A character is entered, set selectedTag to null
							selectedTag.set(null);
						} else if (e.key === kbd.ARROW_LEFT) {
							e.preventDefault();
							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);

							const selectedIndex = tagsEl.findIndex(
								(element) => element.getAttribute('data-tag-id') === $selectedTag.id
							);
							const prevIndex = selectedIndex - 1;

							if (prevIndex >= 0) {
								selectedTag.set({
									id: tagsEl[prevIndex].getAttribute('data-tag-id') ?? '',
									value: tagsEl[prevIndex].getAttribute('data-tag-value') ?? '',
								});
							}
						} else if (e.key === kbd.ARROW_RIGHT) {
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
								selectedTag.set({
									id: tagsEl[nextIndex].getAttribute('data-tag-id') ?? '',
									value: tagsEl[nextIndex].getAttribute('data-tag-value') ?? '',
								});
							}
						} else if (e.key === kbd.HOME) {
							e.preventDefault();
							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							if (tagsEl.length > 0) {
								selectedTag.set({
									id: tagsEl[0].getAttribute('data-tag-id') ?? '',
									value: tagsEl[0].getAttribute('data-tag-value') ?? '',
								});
							}
						} else if (e.key === kbd.END) {
							e.preventDefault();
							selectedTag.set(null);
							focusInput(ids.input, 'end');
						} else if (e.key === kbd.DELETE) {
							// Delete this tag and move to the next tag. If there is no next tag
							// focus on input
							e.preventDefault();

							const prevSelectedId = $selectedTag.id;
							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const selectedIndex = tagsEl.findIndex(
								(element) => element.getAttribute('data-tag-id') === $selectedTag.id
							);
							const nextIndex = selectedIndex + 1;

							if (nextIndex >= tagsEl.length) {
								selectedTag.set(null);
								focusInput(ids.input, 'start');
							} else {
								selectedTag.set({
									id: tagsEl[nextIndex].getAttribute('data-tag-id') ?? '',
									value: tagsEl[nextIndex].getAttribute('data-tag-value') ?? '',
								});
							}

							// Delete the previously selected tag
							deleteTagById(prevSelectedId, tags);
						} else if (e.key === kbd.BACKSPACE) {
							// Delete this tag and move to the previous tag. If there is no previous,
							// move to the next tag. If there is no next tag, focus on input
							e.preventDefault();
							const prevSelectedId = $selectedTag.id;

							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const selectedIndex = tagsEl.findIndex(
								(element) => element.getAttribute('data-tag-id') === $selectedTag.id
							);
							const prevIndex = selectedIndex - 1;
							const nextIndex = selectedIndex + 1;

							if (prevIndex >= 0) {
								selectedTag.set({
									id: tagsEl[prevIndex].getAttribute('data-tag-id') ?? '',
									value: tagsEl[prevIndex].getAttribute('data-tag-value') ?? '',
								});
							} else {
								if (nextIndex >= tagsEl.length) {
									selectedTag.set(null);
									focusInput(ids.input, 'start');
								} else {
									selectedTag.set({
										id: tagsEl[nextIndex].getAttribute('data-tag-id') ?? '',
										value: tagsEl[nextIndex].getAttribute('data-tag-value') ?? '',
									});
								}
							}

							// Delete the previously selected tag
							deleteTagById(prevSelectedId, tags);
						}
					} else {
						// ENTER
						if (e.key === kbd.ENTER) {
							e.preventDefault();
							const value = node.value;
							if (!value) return;

							const $options = get(options);
							const $tags = get(tags);

							// Ignore unique
							if ($options.unique) {
								const index = $tags.findIndex((tag) => tag.value === value);
								if (index >= 0) {
									// Select the tag
									selectedTag.set($tags[index]);
									return;
								}
							}

							// Add tag
							tags.update((currentTags) => [
								...currentTags,
								{ id: generateId(), value: node.value },
							]);
							node.value = '';
						} else if (
							node.selectionStart === 0 &&
							(e.key === kbd.ARROW_LEFT || e.key === kbd.BACKSPACE)
						) {
							e.preventDefault();

							const tagsEl = getTagElements(node, dataMeltParts['root'], dataMeltParts['tag']);
							const lastTag = tagsEl.at(-1) as HTMLElement;

							if (lastTag) {
								selectedTag.set({
									id: lastTag.getAttribute('data-tag-id') ?? '',
									value: lastTag.getAttribute('data-tag-value') ?? '',
								});
							}
						}
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
					'data-melt-part': dataMeltParts['tag'],
					'aria-selected': selected,
					'data-selected': selected ? '' : undefined,
					'data-tag-value': tag.value,
					'data-tag-id': tag.id,
					'data-disabled': disabled ? '' : undefined,
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
