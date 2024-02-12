import type { CreateHiddenInputProps } from '$lib/builders/hidden-input/types.js';

export type HiddenInputProps = CreateHiddenInputProps & {
	onChange?: (event: Event) => void;
};
