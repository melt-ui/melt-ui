import type { BuilderReturn, Expand } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { TagsInputIdParts, createTagsInput } from './create.js';
import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
export type { TagsInputComponentEvents } from './events.js';
export type CreateTagsInputProps = {
	placeholder?: string;
	disabled?: boolean;
	editable?: boolean;
	selected?: Tag;
	defaultTags?: string[] | Tag[];
	tags?: Writable<Tag[]>;
	onTagsChange?: ChangeFn<Tag[]>;
	unique?: boolean;
	trim?: boolean;
	blur?: Blur;
	addOnPaste?: boolean;
	maxTags?: number;
	allowed?: string[];
	denied?: string[];
	/**
	 * Optional validator/parser function that runs on tag addition.
	 *
	 * If an error is thrown, or the promise is rejected, the tag will not be added.
	 *
	 * Otherwise, return a Tag or a string for the tag to be added.
	 *
	 * @param tag The tag to be added
	 */
	add?: AddTag;
	/**
	 * Optional validator/parser function that runs on tag removal.
	 *
	 * If an error is thrown, the promise is rejected, or `false` is returned, the tag will not be removed.
	 *
	 * Otherwise, return `true` for the tag to be removed.
	 *
	 * @param tag The tag to be removed
	 */
	remove?: RemoveTag;
	/**
	 * Optional validator/parser function that runs on tag update.
	 *
	 * If an error is thrown, or the promise is rejected, the tag will not be updated.
	 *
	 * Otherwise, return a Tag or a string for the tag to be updated.
	 *
	 * @param tag The tag to be updated
	 */
	update?: UpdateTag;

	/**
	 * Optionally override the default ids we apply to the elements.
	 */
	ids?: Expand<IdObj<TagsInputIdParts>>;
};

export type Blur = 'nothing' | 'add' | 'clear';

export type Tag = {
	id: string;
	value: string;
};

export type TagProps = {
	id: string;
	value: string;
	disabled?: boolean;
	editable?: boolean;
};

export type UpdateTag = (tag: Tag) => (Tag | never) | Promise<Tag | never>;
export type RemoveTag = (tag: Tag) => (boolean | never) | Promise<boolean | never>;
export type AddTag = (tag: string) => (Tag | string | never) | Promise<Tag | string | never>;

export type TagsInput = BuilderReturn<typeof createTagsInput>;
export type TagsInputElements = TagsInput['elements'];
export type TagsInputOptions = TagsInput['options'];
export type TagsInputStates = TagsInput['states'];
export type TagsInputHelpers = TagsInput['helpers'];
