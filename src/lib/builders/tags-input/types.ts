import type { createTagsInput } from './create';

export type CreateTagsInputArgs = {
	placeholder?: string;
	disabled?: boolean;
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
};

export type Tag = {
	id: string;
	value: string;
};

export type TagArgs = {
	id: string;
	value: string;
	disabled?: boolean;
};

export type CreateTagsInputReturn = ReturnType<typeof createTagsInput>;
