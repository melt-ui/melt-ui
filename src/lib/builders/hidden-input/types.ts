import type { Readable } from 'svelte/store';

export type CreateHiddenInputProps = {
	value: Readable<string>;
	disabled?: Readable<boolean>;
	name?: Readable<string | undefined> | undefined;
	required?: Readable<boolean>;
	prefix?: string;
};
