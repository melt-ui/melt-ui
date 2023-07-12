/**
 * A constant object that maps commonly used keyboard keys to their corresponding string values.
 * This object can be used in other parts of the application to handle keyboard input and prevent
 * hard-coded strings throughout.
 */
export const kbd = {
	ALT: 'Alt',
	ARROW_DOWN: 'ArrowDown',
	ARROW_LEFT: 'ArrowLeft',
	ARROW_RIGHT: 'ArrowRight',
	ARROW_UP: 'ArrowUp',
	BACKSPACE: 'Backspace',
	CAPS_LOCK: 'CapsLock',
	CONTROL: 'Control',
	DELETE: 'Delete',
	END: 'End',
	ENTER: 'Enter',
	ESCAPE: 'Escape',
	F1: 'F1',
	F10: 'F10',
	F11: 'F11',
	F12: 'F12',
	F2: 'F2',
	F3: 'F3',
	F4: 'F4',
	F5: 'F5',
	F6: 'F6',
	F7: 'F7',
	F8: 'F8',
	F9: 'F9',
	HOME: 'Home',
	META: 'Meta',
	PAGE_DOWN: 'PageDown',
	PAGE_UP: 'PageUp',
	SHIFT: 'Shift',
	SPACE: ' ',
	TAB: 'Tab',
	CTRL: 'Control',
};

/** Key sets for navigation within lists, such as select, menu, and combobox. */
export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

export const getNextKey = (
	dir: 'ltr' | 'rtl' = 'ltr',
	orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
	return {
		horizontal: dir === 'rtl' ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT,
		vertical: kbd.ARROW_DOWN,
	}[orientation];
};

export const getPrevKey = (
	dir: 'ltr' | 'rtl' = 'ltr',
	orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
	return {
		horizontal: dir === 'rtl' ? kbd.ARROW_RIGHT : kbd.ARROW_LEFT,
		vertical: kbd.ARROW_UP,
	}[orientation];
};

export const getDirectionalKeys = (
	dir: 'ltr' | 'rtl' = 'ltr',
	orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
	return {
		nextKey: getNextKey(dir, orientation),
		prevKey: getPrevKey(dir, orientation),
	};
};
