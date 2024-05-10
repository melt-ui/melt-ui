import type { MaybeReadable } from '$lib/internal/types.js';
import type { HTMLInputAttributes } from 'svelte/elements';

export type CreateHiddenInputProps = {
	value: MaybeReadable<string>;
	disabled?: MaybeReadable<boolean>;
	name?: MaybeReadable<string | undefined> | undefined;
	required?: MaybeReadable<boolean>;
	prefix?: string;
	type?: MaybeReadable<HTMLInputAttributes['type']>;
	checked?: MaybeReadable<boolean | undefined | 'indeterminate'>;
};
