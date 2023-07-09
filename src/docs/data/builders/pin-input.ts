import type { KeyboardSchema } from '$docs/types';
import { isMac, kbd } from '@melt-ui/svelte/internal/helpers';

const keyboard: KeyboardSchema = [
	{
		key: kbd.ARROW_LEFT,
		behavior: 'Moves to the previous input.',
	},
	{
		key: kbd.ARROW_RIGHT,
		behavior: 'Moves to the next input.',
	},
	{
		key: kbd.BACKSPACE,
		behavior:
			'Deletes the value of the current input. If the input is empty, moves to the previous input.',
	},
	{
		key: kbd.DELETE,
		behavior: 'Deletes the value of the current input.',
	},
	{
		key: `${isMac() ? '⌘' : kbd.CTRL} + V`,
		behavior:
			'Pastes the contents of the clipboard into the pin input.\
			If the number of characters in the clipboard equals exceeds the number of inputs, the contents are pasted from the first input.\
			Otherwise, the contents are pasted from the current input onwards.',
	},
];

const schemas = {
	keyboard,
};

const features = ['Fully managed focus', 'Supports pasting from clipboard', 'Keyboard navigation'];

export const pinInputData = {
	schemas,
	features,
};
