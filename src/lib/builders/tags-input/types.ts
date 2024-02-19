import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createTagsInput } from './create.js';
export type { TagsInputComponentEvents } from './events.js';
export type CreateTagsInputProps = {
	placeholder?: ReadableProp<string>;
	disabled?: ReadableProp<boolean>;
	editable?: ReadableProp<boolean>;
	selected?: ReadableProp<Tag>;

	tags?: ReadableProp<ReadableProp<Tag[]>>;

	unique?: ReadableProp<boolean>;
	trim?: ReadableProp<boolean>;
	blur?: ReadableProp<Blur>;
	addOnPaste?: ReadableProp<boolean>;
	maxTags?: ReadableProp<number>;
	allowed?: ReadableProp<string[]>;
	denied?: ReadableProp<string[]>;
	/**
	 * Optional validator/parser function that runs on tag addition.
	 *
	 * If an error is thrown, or the promise is rejected, the tag will not be added.
	 *
	 * Otherwise, return a Tag or a string for the tag to be added.
	 *
	 * @param tag The tag to be added
	 */
	add?: ReadableProp<AddTag>;
	/**
	 * Optional validator/parser function that runs on tag removal.
	 *
	 * If an error is thrown, the promise is rejected, or `false` is returned, the tag will not be removed.
	 *
	 * Otherwise, return `true` for the tag to be removed.
	 *
	 * @param tag The tag to be removed
	 */
	remove?: ReadableProp<RemoveTag>;
	/**
	 * Optional validator/parser function that runs on tag update.
	 *
	 * If an error is thrown, or the promise is rejected, the tag will not be updated.
	 *
	 * Otherwise, return a Tag or a string for the tag to be updated.
	 *
	 * @param tag The tag to be updated
	 */
	update?: ReadableProp<UpdateTag>;
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
