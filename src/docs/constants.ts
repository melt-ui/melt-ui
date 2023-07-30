import rawFloatingConfig from '$docs/data/long-types/floating-config?raw';

export const DESCRIPTIONS = {
	FLOATING_CONFIG:
		'A configuration object which determines how the floating element is positioned relative to the trigger.',
	ARROW_SIZE: 'The size of the arrow which points to the trigger in pixels.',
	PREVENT_SCROLL: (name = 'element') =>
		`Whether or not to prevent scrolling of the document when the ${name} is open.`,
	ON_SELECT:
		'A callback which is called when the item is selected. To prevent the default behavior, call `e.preventDefault()` in the callback.',
	LOOP: 'Whether or not the focus should loop back to the first item when the last item is reached.',
	CLOSE_ON_ESCAPE: (name = 'element') =>
		`Whether or not to close the ${name} when the escape key is pressed.`,
	CLOSE_ON_CLICK_OUTSIDE: (name = 'element') =>
		`Whether or not to close the ${name} when the user clicks outside of it.`,
	BUILDER: (name: string) => `The builder function used to create the ${name} component.`,
};

export const ATTRS = {
	OPEN_CLOSED: "`'open' | 'closed'`",
	TRUE_FALSE: "`'true' | 'false'`",
	ORIENTATION: "`'vertical' | 'horizontal'`",
	CHECKED_UNCHECKED: "`'checked' | 'unchecked'`",
	CHECKBOX_STATE: "`'checked' | 'unchecked' | 'indeterminate'`",
	MELT: (name: string) => `Present on all ${name} elements.`,
	DISABLED: (name = 'element') => `Present when the ${name} is disabled.`,
	HIGHLIGHTED: (name = 'element') => `Present when the ${name} is highlighted.`,
	TRUE: "`'true'`",
	ACTIVE_INACTIVE: `'active' | 'inactive'`,
	ON_OFF: "`'on' | 'off'`",
	SELECTED: (name = 'element') => `Present when the ${name} is selected.`,
};

export const TYPES = {
	EVENT_HANDLER: '(e: Event) => void',
	FLOATING_CONFIG: 'FloatingConfig',
	ORIENTATION: ["'horizontal'", "'vertical'"],
};

export const LONG_TYPES = {
	FLOATING_CONFIG: {
		rawCode: rawFloatingConfig,
	},
};

export const SEE = {
	CHANGE_FUNCTIONS: {
		label: 'Change Functions',
		href: 'https://melt-ui.com/docs/controlled#change-functions',
	},
	BRING_YOUR_OWN_STORE: {
		label: 'Bring Your Own Store',
		href: 'https://melt-ui.com/docs/controlled#bring-your-own-store',
	},
};

export const KBD = {
	ENTER: 'Enter',
	SPACE: 'Space',
	TAB: 'Tab',
	ESCAPE: 'Esc',
	ARROW_UP: 'ArrowUp',
	ARROW_DOWN: 'ArrowDown',
	ARROW_LEFT: 'ArrowLeft',
	ARROW_RIGHT: 'ArrowRight',
	HOME: 'Home',
	END: 'End',
	PAGE_UP: 'PageUp',
	PAGE_DOWN: 'PageDown',
	SHIFT: 'Shift',
	ALT: 'Alt',
	COMMAND: 'CMD/CTRL',
	CONTROL: 'CTRL/CMD',
	SHIFT_TAB: 'Shift + Tab',
	BACKSPACE: 'Backspace',
	DELETE: 'Delete',
};
