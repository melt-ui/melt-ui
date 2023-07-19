import type {
	BuilderElements,
	BuilderHelpers,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
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

export type TagsInput = BuilderReturn<typeof createTagsInput>;
export type TagsInputElements = BuilderElements<TagsInput>;
export type TagsInputOptions = BuilderOptions<TagsInput>;
export type TagsInputStates = BuilderStates<TagsInput>;
export type TagsInputHelpers = BuilderHelpers<TagsInput>;
