import rawFloatingConfig from '$docs/data/long-types/floating-config?raw';
import type { Prop, ReturnedProps } from './types';

export const SEE = {
	CHANGE_FUNCTIONS: {
		label: 'Change Functions',
		href: '/docs/controlled#change-functions',
	},
	BRING_YOUR_OWN_STORE: {
		label: 'Bring Your Own Store',
		href: '/docs/controlled#bring-your-own-store',
	},
};

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
	PORTAL: (name = 'floating element') =>
		`The element or selector to render the ${name} into. Nested floating elements are automatically rendered into their parent if not specified.`,
	FORCE_VISIBLE: (name = 'element') =>
		`Whether or not to force the ${name} to always be visible. This is useful for custom transitions and animations using conditional blocks.`,
};

type PropArgs = {
	name?: string;
	default?: string;
};

export const PROPS = {
	FORCE_VISIBLE: (args: PropArgs = {}): Prop => ({
		name: 'forceVisible',
		type: 'boolean',
		description: DESCRIPTIONS.FORCE_VISIBLE(args.name ?? 'element'),
		default: args.default ?? 'false',
	}),
	DISABLED: (args: PropArgs = {}): Prop => ({
		name: 'disabled',
		type: 'boolean',
		description: `Whether or not the ${args.name ?? 'element'} is disabled.`,
		default: args.default ?? 'false',
	}),
	PORTAL: (args: PropArgs = {}): Prop => ({
		name: 'portal',
		type: 'string | HTMLElement',
		description: DESCRIPTIONS.PORTAL(args.name ?? 'floating element'),
		default: args.default ?? 'body',
	}),
	CLOSE_ON_ESCAPE: (args: PropArgs = {}): Prop => ({
		name: 'closeOnEscape',
		type: 'boolean',
		description: DESCRIPTIONS.CLOSE_ON_ESCAPE(args.name ?? 'floating element'),
		default: args.default ?? 'true',
	}),
	CLOSE_ON_OUTSIDE_CLICK: (args: PropArgs = {}): Prop => ({
		name: 'closeOnOutsideClick',
		type: 'boolean',
		description: DESCRIPTIONS.CLOSE_ON_CLICK_OUTSIDE(args.name ?? 'floating element'),
		default: args.default ?? 'true',
	}),
	PREVENT_SCROLL: (args: PropArgs = {}): Prop => ({
		name: 'preventScroll',
		type: 'boolean',
		description: DESCRIPTIONS.PREVENT_SCROLL(args.name ?? 'floating element'),
		default: args.default ?? 'true',
	}),
	ARROW_SIZE: {
		name: 'arrowSize',
		type: 'number',
		default: '8',
		description: DESCRIPTIONS.ARROW_SIZE,
	},
	DIR: (args: PropArgs = {}): Prop => ({
		name: 'dir',
		type: '"ltr" | "rtl"',
		default: args.default ?? '"ltr"',
		description: `The direction of the text in the ${args.name ?? 'element'} .`,
	}),
	POSITIONING: (args: PropArgs = {}): Prop => ({
		name: 'positioning',
		default: args.default ?? 'positioning: "bottom"',
		description: DESCRIPTIONS.FLOATING_CONFIG,
		type: 'FloatingConfig',
		longType: {
			rawCode: rawFloatingConfig,
		},
	}),
	LOOP: (args: PropArgs = {}): Prop => ({
		name: 'loop',
		type: 'boolean',
		description: DESCRIPTIONS.LOOP,
		default: args.default ?? 'false',
	}),
	DEFAULT_OPEN: (args: PropArgs = {}): Prop => ({
		name: 'defaultOpen',
		type: 'boolean',
		description: `Whether the ${args.name ?? 'element'} is open by default or not.`,
		default: 'false',
	}),
	ON_OPEN_CHANGE: {
		name: 'onOpenChange',
		type: 'ChangeFn<boolean>',
		description: 'A callback called when the value of the `open` store should be changed.',
		see: SEE.CHANGE_FUNCTIONS,
	},
	OPEN: (args: PropArgs = {}): Prop => ({
		name: 'open',
		type: 'Writable<boolean>',
		description: `A writable store that controls whether or not the ${
			args.name ?? 'floating element'
		} is open.`,
		see: SEE.BRING_YOUR_OWN_STORE,
	}),
};

export function propToOption(prop: Prop): ReturnedProps[0] {
	const type = Array.isArray(prop.type) ? prop.type.join(' | ') : prop.type;
	return {
		name: prop.name,
		type: `Writable<${type}>`,
		description: prop.description,
	};
}

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
	DIR: ["'ltr'", "'rtl'"],
	PORTAL: ['HTMLElement', 'string'],
};

export const LONG_TYPES = {
	FLOATING_CONFIG: {
		rawCode: rawFloatingConfig,
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
