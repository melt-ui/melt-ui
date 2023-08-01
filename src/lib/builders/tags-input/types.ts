import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createTagsInput } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateTagsInputProps = {
	placeholder?: string;
	disabled?: boolean;
	editable?: boolean;
	selected?: Tag;
	defaultTags?: string[] | Tag[];
	tags?: Writable<Tag[]>;
	onTagsChange?: ChangeFn<Tag[]>;
	unique?: boolean;
	blur?: Blur;
	addOnPaste?: boolean;
	maxTags?: number;
	allowed?: string[];
	denied?: string[];
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

export type UpdateTag = (tag: Tag) => Promise<Tag>;
export type RemoveTag = (tag: Tag) => Promise<boolean>;
export type AddTag = (tag: string) => Promise<Tag | string>;

export type TagsInput = BuilderReturn<typeof createTagsInput>;
export type TagsInputElements = TagsInput['elements'];
export type TagsInputOptions = TagsInput['options'];
export type TagsInputStates = TagsInput['states'];
export type TagsInputHelpers = TagsInput['helpers'];
