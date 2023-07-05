import type { createTagsInput } from './create';

export type CreateTagsInputArgs = {
	placeholder?: string;
	disabled?: boolean;
	editable?: boolean;
	selected?: Tag;
	tags?: string[] | Tag[];
	unique?: boolean;
	blur?: 'nothing' | 'add' | 'clear';
	addOnPaste?: boolean;
	maxTags?: number;
	allowed?: string[];
	denied?: string[];
	add?: (tag: string) => Promise<Tag | string>;
	remove?: (tag: Tag) => Promise<boolean>;
	update?: (tag: Tag) => Promise<Tag>;
};

export type Tag = {
	id: string;
	value: string;
};

export type TagArgs = {
	id: string;
	value: string;
	disabled?: boolean;
	editable?: boolean;
};

export type CreateTagsInputReturn = ReturnType<typeof createTagsInput>;
