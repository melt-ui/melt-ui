import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createTagsInput } from './create.js';
export type { TagsInputComponentEvents } from './events.js';
export type CreateTagsInputProps = {
	placeholder?: string | undefined;
	disabled?: boolean | undefined;
	editable?: boolean | undefined;
	selected?: Tag | undefined;
	defaultTags?: string[] | Tag[] | undefined;
	tags?: Writable<Tag[]> | undefined;
	onTagsChange?: ChangeFn<Tag[]> | undefined;
	unique?: boolean | undefined;
	trim?: boolean | undefined;
	blur?: Blur | undefined;
	addOnPaste?: boolean | undefined;
	maxTags?: number | undefined;
	allowed?: string[] | undefined;
	denied?: string[] | undefined;
	/**
	 * Optional validator/parser function that runs on tag addition.
	 *
	 * If an error is thrown, or the promise is rejected, the tag will not be added.
	 *
	 * Otherwise, return a Tag or a string for the tag to be added.
	 *
	 * @param tag The tag to be added
	 */
	add?: AddTag | undefined;
	/**
	 * Optional validator/parser function that runs on tag removal.
	 *
	 * If an error is thrown, the promise is rejected, or `false` is returned, the tag will not be removed.
	 *
	 * Otherwise, return `true` for the tag to be removed.
	 *
	 * @param tag The tag to be removed
	 */
	remove?: RemoveTag | undefined;
	/**
	 * Optional validator/parser function that runs on tag update.
	 *
	 * If an error is thrown, or the promise is rejected, the tag will not be updated.
	 *
	 * Otherwise, return a Tag or a string for the tag to be updated.
	 *
	 * @param tag The tag to be updated
	 */
	update?: UpdateTag | undefined;
};

export type Blur = 'nothing' | 'add' | 'clear';

export type Tag = {
	id: string;
	value: string;
};

export type TagProps = {
	id: string;
	value: string;
	disabled?: boolean | undefined;
	editable?: boolean | undefined;
};

export type UpdateTag = (tag: Tag) => (Tag | never) | Promise<Tag | never>;
export type RemoveTag = (tag: Tag) => (boolean | never) | Promise<boolean | never>;
export type AddTag = (tag: string) => (Tag | string | never) | Promise<Tag | string | never>;

export type TagsInput = BuilderReturn<typeof createTagsInput>;
export type TagsInputElements = TagsInput['elements'];
export type TagsInputOptions = TagsInput['options'];
export type TagsInputStates = TagsInput['states'];
export type TagsInputHelpers = TagsInput['helpers'];
