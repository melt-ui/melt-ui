import type { MaybeReadable } from '$lib/internal/types.js';
import type { HTMLInputAttributes } from 'svelte/elements';

export type CreateHiddenInputProps = {
	value: MaybeReadable<string>;
	disabled?: MaybeReadable<boolean> | undefined;
	name?: MaybeReadable<string | undefined> | undefined;
	required?: MaybeReadable<boolean> | undefined;
	prefix?: string | undefined;
	type?: MaybeReadable<HTMLInputAttributes['type']> | undefined;
	checked?: MaybeReadable<boolean | undefined | 'indeterminate'> | undefined;
};
