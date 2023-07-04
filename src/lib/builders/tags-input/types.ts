import type { createTagsInput } from './create';
import type { Tag } from './helpers';

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

export type CreateTagsInputReturn = ReturnType<typeof createTagsInput>;
