import type { createTagsInput } from './create';

export type CreateTagsInputProps = {
	placeholder?: string;
	disabled?: boolean;
	editable?: boolean;
	selected?: Tag;
	tags?: string[] | Tag[];
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

export type CreateTagsInputReturn = ReturnType<typeof createTagsInput>;
