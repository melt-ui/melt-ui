import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createTagsInput } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
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
	regex?: string;
	add?: AddTag;
	remove?: RemoveTag;
	update?: UpdateTag;
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

export type UpdateTag = (tag: Tag) => Tag | Promise<Tag>;
export type RemoveTag = (tag: Tag) => boolean | Promise<boolean>;
export type AddTag = (tag: string) => (Tag | string) | Promise<Tag | string>;

export type TagsInput = BuilderReturn<typeof createTagsInput>;
export type TagsInputElements = TagsInput['elements'];
export type TagsInputOptions = TagsInput['options'];
export type TagsInputStates = TagsInput['states'];
export type TagsInputHelpers = TagsInput['helpers'];
