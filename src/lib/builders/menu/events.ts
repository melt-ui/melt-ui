import type { GroupedEvents } from '$lib/internal/types';

export const menuEvents = {
	menu: ['keydown'] as const,
	trigger: ['pointerdown', 'keydown'] as const,
	item: [
		'pointerdown',
		'click',
		'keydown',
		'pointermove',
		'pointerleave',
		'focusin',
		'focusout',
	] as const,
	checkboxItem: [
		'pointerdown',
		'click',
		'keydown',
		'pointermove',
		'pointerleave',
		'focusin',
		'focusout',
	] as const,
	radioItem: [
		'pointerdown',
		'click',
		'keydown',
		'pointermove',
		'pointerleave',
		'focusin',
		'focusout',
	] as const,
	submenu: ['keydown', 'pointermove', 'focusout'] as const,
	subTrigger: ['click', 'keydown', 'pointermove', 'pointerleave', 'focusin', 'focusout'] as const,
};

export type MenuEvents = GroupedEvents<typeof menuEvents>;
