import type { APISchema } from '$routes/(components)';
import { isMac, kbd } from '@melt-ui/svelte/internal/helpers';

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: kbd.ARROW_LEFT,
			description: 'Moves to the previous input.',
		},
		{
			key: kbd.ARROW_RIGHT,
			description: 'Moves to the next input.',
		},
		{
			key: kbd.BACKSPACE,
			description:
				'Deletes the value of the current input. If the input is empty, moves to the previous input.',
		},
		{
			key: kbd.DELETE,
			description: 'Deletes the value of the current input.',
		},
		{
			key: `${isMac() ? '⌘' : kbd.CTRL} + V`,
			description:
				'Pastes the contents of the clipboard into the pin input.\
			If the number of characters in the clipboard equals exceeds the number of inputs, the contents are pasted from the first input.\
			Otherwise, the contents are pasted from the current input onwards.',
		},
	],
};

const schemas = {
	keyboard,
};

const features = ['Fully managed focus', 'Supports pasting from clipboard', 'Keyboard navigation'];

export const pinInputData = {
	schemas,
	features,
};
