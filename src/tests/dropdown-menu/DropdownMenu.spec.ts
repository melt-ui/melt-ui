import { render, act, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { testKbd as kbd } from '../utils.js';
import DropdownMenuTest from './DropdownMenuTest.svelte';
import DropdownMenuForceVisible from './DropdownMenuForceVisibleTest.svelte';
import type { CreateDropdownMenuProps } from '$lib';
import { sleep } from '$lib/internal/helpers/sleep.js';

const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

function setup(
	props: CreateDropdownMenuProps & { submenuIds?: CreateDropdownMenuProps['ids'] } = {}
) {
	const user = userEvent.setup();
	const returned = render(DropdownMenuTest, props);
	const trigger = returned.getByTestId('trigger');
	return {
		user,
		trigger,
		...returned,
	};
}

describe('Dropdown Menu (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(DropdownMenuTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is clicked', async () => {
		const { user, trigger, getByTestId } = setup();
		const menu = getByTestId('menu');

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const arrow = getByTestId('arrow');
		expect(arrow).toBeVisible();

		await user.click(trigger);
		expect(menu).not.toBeVisible();
	});

	test('Refocuses the trigger when menu closed with keyboard', async () => {
		const { user, trigger, getByTestId } = setup();
		const menu = getByTestId('menu');

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		await user.keyboard(kbd.ESCAPE);
		expect(menu).not.toBeVisible();
		expect(trigger).toHaveFocus();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { user, trigger, getByTestId } = setup();
		const menu = getByTestId('menu');

		expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(key);
		expect(menu).toBeVisible();

		const firstItem = getByTestId('item1');
		expect(firstItem).toHaveFocus();
	});

	test('Focus when opened with click', async () => {
		const { user, trigger, getByTestId } = setup();
		const menu = getByTestId('menu');

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const firstItem = getByTestId('item1');
		expect(firstItem).not.toHaveFocus();

		await user.keyboard(kbd.ARROW_DOWN);

		// focuses first item after arrow down
		expect(firstItem).toHaveFocus();

		// Doesnt focus disabled menu items
		await user.keyboard(kbd.ARROW_DOWN);
		const disabledItem = getByTestId('item2');
		expect(disabledItem).not.toHaveFocus();
		expect(getByTestId('checkboxItem1')).toHaveFocus();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { user, trigger, getByTestId } = setup();
		const menu = getByTestId('menu');

		expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(key);
		expect(menu).toBeVisible();
	});

	test('Displays proper initial checked state for checkbox items', async () => {
		const { user, trigger, getByTestId, queryByTestId } = setup();

		await act(() => trigger.focus());
		await user.keyboard(kbd.ENTER);
		const checked1 = getByTestId('check1');
		expect(checked1).toBeVisible();
		expect(queryByTestId('check2')).toBeNull();
	});

	test('Toggles checked to false for default checked checkbox items', async () => {
		const { user, trigger, queryByTestId } = setup();
		trigger.focus();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(queryByTestId('check1')).not.toBeNull();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ENTER);
		expect(queryByTestId('check1')).toBeNull();
	});

	test('Toggles checked to true for default unchecked checkbox items', async () => {
		const { user, trigger, queryByTestId } = setup();

		trigger.focus();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(queryByTestId('check2')).toBeNull();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ENTER);
		expect(queryByTestId('check2')).not.toBeNull();
	});

	test('Hovering over subtrigger opens submenu', async () => {
		const { user, trigger, getByTestId } = setup();

		await user.click(trigger);
		const submenu = getByTestId('submenu');
		expect(submenu).not.toBeVisible();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await waitFor(() => expect(submenu).toBeVisible());
		expect(subtrigger).toHaveFocus();
	});

	test.each([
		[kbd.ARROW_DOWN, 'item1', 'checkboxItem1'],
		[kbd.ARROW_UP, 'checkboxItem1', 'item1'],
	])(
		'Pressing arrow keys while hovering over item goes to next/prev item',
		async (key, hoverItem, endItem) => {
			const { user, trigger, getByTestId } = setup();

			await user.click(trigger);
			const item = getByTestId(hoverItem);
			await user.hover(item);
			await user.keyboard(key);
			expect(item).not.toHaveFocus();
			expect(getByTestId(`${endItem}`)).toHaveFocus();
		}
	);

	test('Arrow right when subtrigger hover focuses first item in submenu', async () => {
		const { user, trigger, getByTestId } = setup();
		await user.click(trigger);
		const submenu = getByTestId('submenu');
		expect(submenu).not.toBeVisible();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await waitFor(() => expect(submenu).toBeVisible());
		await user.keyboard(kbd.ARROW_RIGHT);
		const subItem0 = getByTestId('subitem0');
		expect(subItem0).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		const subItem1 = getByTestId('subitem1');
		expect(subItem1).toHaveFocus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(subItem0).not.toHaveFocus();
		expect(submenu).not.toBeVisible();
		expect(subtrigger).toHaveFocus();
	});

	test('Respects the `closeFocus` prop', async () => {
		const { user, trigger, getByTestId } = setup({
			closeFocus: () => {
				return document.getElementById('closeFocus');
			},
		});
		const menu = getByTestId('menu');
		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();
		await user.keyboard(kbd.ESCAPE);
		const closeFocus = getByTestId('closeFocus');
		await sleep(1);
		expect(closeFocus).toHaveFocus();
	});

	test('respects `closeOnEscape` prop', async () => {
		const { user, trigger, getByTestId } = setup({
			closeOnEscape: false,
		});
		const menu = getByTestId('menu');
		await user.click(trigger);
		expect(menu).toBeVisible();
		await user.keyboard(kbd.ESCAPE);
		expect(menu).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
	});

	test('respects close on outside click prop', async () => {
		const { user, trigger, getByTestId } = setup({
			closeOnOutsideClick: false,
		});
		const menu = getByTestId('menu');
		await user.click(trigger);
		expect(menu).toBeVisible();
		const outsideClick = getByTestId('outside-click');
		await user.click(outsideClick);
		expect(menu).toBeVisible();
	});

	test('Applies custom ids if provided', async () => {
		const ids = {
			menu: 'id-menu',
			trigger: 'id-trigger',
		};

		const subIds = {
			menu: 'id-submenu',
			trigger: 'id-subtrigger',
		};

		const { getByTestId, user, queryByTestId } = setup({
			ids,
			submenuIds: subIds,
		});

		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const subtrigger = getByTestId('subtrigger');

		await user.hover(subtrigger);
		await waitFor(() => expect(queryByTestId('submenu')).not.toBeNull());

		expect(trigger.id).toBe(ids.trigger);
		expect(menu.id).toBe(ids.menu);
		expect(subtrigger.id).toBe(subIds.trigger);
		const submenu = getByTestId('submenu');
		expect(submenu.id).toBe(subIds.menu);
	});

	test("Doesn't close on outsideClick if defaultPrevented in onOutsideClick", async () => {
		const { user, trigger, getByTestId } = setup({
			onOutsideClick: (e) => {
				e.preventDefault();
			},
		});
		const menu = getByTestId('menu');
		await user.click(trigger);
		expect(menu).toBeVisible();
		const outsideClick = getByTestId('outside-click');
		await user.click(outsideClick);
		expect(menu).toBeVisible();
	});

	test.todo('Radio items');
});

function setupForceVis(props: CreateDropdownMenuProps = {}) {
	const user = userEvent.setup();
	const returned = render(DropdownMenuForceVisible, props);
	const trigger = returned.getByTestId('trigger');
	return {
		user,
		trigger,
		...returned,
	};
}

describe('Dropdown Menu (forceVisible)', () => {
	beforeEach(() => {
		vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
			return window.setTimeout(() => fn(Date.now()), 16);
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test('No accessibility violations', async () => {
		const { container } = render(DropdownMenuForceVisible);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is clicked', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis();

		expect(queryByTestId('menu')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('menu')).not.toBeNull());

		const arrow = getByTestId('arrow');
		expect(arrow).toBeVisible();

		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('menu')).toBeNull());
	});

	test('Refocuses the trigger when menu closed with keyboard', async () => {
		const { queryByTestId, user, trigger } = setupForceVis();

		expect(queryByTestId('menu')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('menu')).not.toBeNull());

		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(queryByTestId('menu')).toBeNull());
		await waitFor(() => expect(trigger).toHaveFocus());
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { queryByTestId, user, trigger } = setupForceVis();
		expect(queryByTestId('menu')).toBeNull();

		trigger.focus();
		await user.keyboard(key);
		await waitFor(() => expect(queryByTestId('menu')).not.toBeNull());
	});

	test('Focus when opened with click', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis();

		expect(queryByTestId('menu')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('menu')).not.toBeNull());
		const firstItem = getByTestId('item1');
		expect(firstItem).not.toHaveFocus();

		await user.keyboard(kbd.ARROW_DOWN);

		// focuses first item after arrow down
		expect(firstItem).toHaveFocus();

		// Doesnt focus disabled menu items
		await user.keyboard(kbd.ARROW_DOWN);
		const disabledItem = getByTestId('item2');
		expect(disabledItem).not.toHaveFocus();
		expect(getByTestId('checkboxItem1')).toHaveFocus();
	});

	test.todo('Doesnt focus disabled menu items', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis();

		expect(queryByTestId('menu')).toBeNull();
		trigger.focus();
		await user.keyboard(kbd.ENTER);
		expect(getByTestId('menu')).toBeVisible();
		// focuses first item when opened with a key
		expect(getByTestId('item1')).toHaveFocus();

		// Doesnt focus disabled menu items
		await user.keyboard(kbd.ARROW_DOWN);
		const disabledItem = getByTestId('item2');
		expect(disabledItem).not.toHaveFocus();
		expect(getByTestId('checkboxItem1')).toHaveFocus();
	});

	test('Displays proper initial checked state for checkbox items', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis();
		trigger.focus();
		await user.keyboard(kbd.ENTER);
		const checked1 = getByTestId('check1');
		expect(checked1).toBeVisible();
		expect(queryByTestId('check2')).toBeNull();
	});

	test('Toggles checked to false for default checked checkbox items', async () => {
		const { queryByTestId, user, trigger } = setupForceVis();

		trigger.focus();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(queryByTestId('check1')).not.toBeNull();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ENTER);
		expect(queryByTestId('check1')).toBeNull();
	});

	test('Toggles checked to true for default unchecked checkbox items', async () => {
		const { queryByTestId, user, trigger } = setupForceVis();
		trigger.focus();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(queryByTestId('check2')).toBeNull();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ENTER);

		await waitFor(() => expect(queryByTestId('check2')).not.toBeNull());
	});

	test('Hovering over subtrigger opens submenu', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis();

		await user.click(trigger);
		expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await waitFor(() => expect(getByTestId('submenu')).toBeVisible());
		expect(subtrigger).toHaveFocus();
	});

	test.each([
		[kbd.ARROW_DOWN, 'item1', 'checkboxItem1'],
		[kbd.ARROW_UP, 'checkboxItem1', 'item1'],
	])(
		'Pressing arrow keys while hovering over item goes to next/prev item',
		async (key, hoverItem, endItem) => {
			const { user, trigger, getByTestId } = setupForceVis();

			await user.click(trigger);
			const item = getByTestId(hoverItem);
			await user.hover(item);
			await user.keyboard(key);
			expect(item).not.toHaveFocus();
			expect(getByTestId(`${endItem}`)).toHaveFocus();
		}
	);

	test('Arrow right when subtrigger hover focuses first item in submenu', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis();

		await user.click(trigger);
		expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await waitFor(() => expect(getByTestId('submenu')).toBeVisible());
		await user.keyboard(kbd.ARROW_RIGHT);
		const subItem0 = getByTestId('subitem0');
		expect(subItem0).toHaveFocus();

		// Arrow down inside submenu moves to next submenu item
		await user.keyboard(kbd.ARROW_DOWN);
		const subItem1 = getByTestId('subitem1');
		expect(subItem1).toHaveFocus();

		await user.hover(subItem1);

		// Arrow left inside submenu closes submenu and focuses subtrigger
		await user.keyboard(kbd.ARROW_LEFT);
		expect(subItem0).not.toHaveFocus();
		expect(subtrigger).toHaveFocus();
	});

	test('loops through items when loop prop true', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis({ loop: true });
		const menuItems = ['item1', 'checkboxItem1', 'checkboxItem2', 'subtrigger'];

		await user.click(trigger);
		expect(queryByTestId('menu')).not.toBeNull();

		for (const item of menuItems) {
			await user.keyboard(kbd.ARROW_DOWN);
			expect(getByTestId(item)).toHaveFocus();
		}
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId('item1')).toHaveFocus();
		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId('subtrigger')).toHaveFocus();
	});

	test('does not loop through items when loop prop false/undefined', async () => {
		const { queryByTestId, user, trigger, getByTestId } = setupForceVis();

		const menuItems = ['item1', 'checkboxItem1', 'checkboxItem2', 'subtrigger'];

		await user.click(trigger);
		expect(queryByTestId('menu')).not.toBeNull();

		for (const item of menuItems) {
			await user.keyboard(kbd.ARROW_DOWN);
			expect(getByTestId(item)).toHaveFocus();
		}
		await user.keyboard(kbd.ARROW_DOWN);
		expect(getByTestId('item1')).not.toHaveFocus();
		expect(getByTestId('subtrigger')).toHaveFocus();

		await user.keyboard(kbd.ARROW_UP);
		await user.keyboard(kbd.ARROW_UP);
		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId('item1')).toHaveFocus();

		await user.keyboard(kbd.ARROW_UP);
		expect(getByTestId('subtrigger')).not.toHaveFocus();
		expect(getByTestId('item1')).toHaveFocus();
	});

	test.todo('Radio items');
});
