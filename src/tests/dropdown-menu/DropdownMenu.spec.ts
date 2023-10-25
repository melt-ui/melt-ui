import { render, act } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';
import { kbd } from '$lib/internal/helpers/index.js';
import DropdownMenuTest from './DropdownMenuTest.svelte';
import DropdownMenuForceVisible from './DropdownMenuForceVisibleTest.svelte';
import { tick } from 'svelte';

const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

describe('Dropdown Menu (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(DropdownMenuTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is clicked', async () => {
		const { getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const arrow = getByTestId('arrow');
		expect(arrow).toBeVisible();

		await user.click(trigger);
		expect(menu).not.toBeVisible();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		expect(menu).toBeVisible();

		const firstItem = getByTestId('item1');
		expect(firstItem).toHaveFocus();
	});

	test('Focus when opened with click', async () => {
		const { getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const firstItem = getByTestId('item1');
		expect(firstItem).not.toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_DOWN}}`);

		// focuses first item after arrow down
		expect(firstItem).toHaveFocus();

		// Doesnt focus disabled menu items
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		const disabledItem = getByTestId('item2');
		expect(disabledItem).not.toHaveFocus();
		expect(getByTestId('checkboxItem1')).toHaveFocus();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		expect(menu).toBeVisible();
	});

	test('Displays proper initial checked state for checkbox items', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		const checked1 = getByTestId('check1');
		expect(checked1).toBeVisible();
		expect(queryByTestId('check2')).toBeNull();
	});

	test('Toggles checked to false for default checked checkbox items', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(queryByTestId('check1')).not.toBeNull();
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ENTER}}`);
		expect(queryByTestId('check1')).toBeNull();
	});

	test('Toggles checked to true for default unchecked checkbox items', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(queryByTestId('check2')).toBeNull();
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ENTER}}`);
		expect(queryByTestId('check2')).not.toBeNull();
	});

	test('Hovering over subtrigger opens submenu', async () => {
		const { getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		const submenu = getByTestId('submenu');
		expect(submenu).not.toBeVisible();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		expect(submenu).toBeVisible();
		expect(subtrigger).toHaveFocus();
	});

	test.each([
		[kbd.ARROW_DOWN, 'item1', 'checkboxItem1'],
		[kbd.ARROW_UP, 'checkboxItem1', 'item1'],
	])(
		'Pressing arrow keys while hovering over item goes to next/prev item',
		async (key, hoverItem, endItem) => {
			const { getByTestId } = render(DropdownMenuTest);
			const trigger = getByTestId('trigger');
			const user = userEvent.setup();

			await user.click(trigger);
			const item = getByTestId(hoverItem);
			await user.hover(item);
			await user.keyboard(`{${key}}`);
			expect(item).not.toHaveFocus();
			expect(getByTestId(`${endItem}`)).toHaveFocus();
		}
	);

	test('Arrow right when subtrigger hover focuses first item in submenu', async () => {
		const { getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		const submenu = getByTestId('submenu');
		expect(submenu).not.toBeVisible();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		const subItem0 = getByTestId('subitem0');
		expect(subItem0).toHaveFocus();
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		const subItem1 = getByTestId('subitem1');
		expect(subItem1).toHaveFocus();
		await user.keyboard(`{${kbd.ARROW_LEFT}}`);
		expect(subItem0).not.toHaveFocus();
		expect(submenu).not.toBeVisible();
		expect(subtrigger).toHaveFocus();
	});

	test('Respects the `closeFocus` prop', async () => {
		const { getByTestId } = render(DropdownMenuTest, {
			closeFocus: () => {
				return document.getElementById('closeFocus');
			},
		});
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		expect(menu).not.toBeVisible();
		await act(() => userEvent.click(trigger));
		expect(menu).toBeVisible();
		await act(() => userEvent.keyboard(`{${kbd.ESCAPE}}`));
		const closeFocus = getByTestId('closeFocus');
		expect(closeFocus).toHaveFocus();
	});

	test.todo('Radio items');
});

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
		const { getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const arrow = getByTestId('arrow');
		expect(arrow).toBeVisible();

		await user.click(trigger);
		expect(menu).not.toBeVisible();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		expect(queryByTestId('menu')).toBeNull();
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		expect(getByTestId('menu')).toBeVisible();
	});

	test('Focus when opened with click', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		expect(queryByTestId('menu')).toBeNull();
		await user.click(trigger);
		await tick();
		expect(queryByTestId('menu')).not.toBeNull();
		expect(getByTestId('menu')).toBeVisible();

		const firstItem = getByTestId('item1');
		expect(firstItem).not.toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_DOWN}}`);

		// focuses first item after arrow down
		expect(firstItem).toHaveFocus();

		// Doesnt focus disabled menu items
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		const disabledItem = getByTestId('item2');
		expect(disabledItem).not.toHaveFocus();
		expect(getByTestId('checkboxItem1')).toHaveFocus();
	});

	test.todo('Doesnt focus disabled menu items', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		expect(queryByTestId('menu')).toBeNull();
		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		expect(getByTestId('menu')).toBeVisible();
		// focuses first item when opened with a key
		expect(getByTestId('item1')).toHaveFocus();

		// Doesnt focus disabled menu items
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		const disabledItem = getByTestId('item2');
		expect(disabledItem).not.toHaveFocus();
		expect(getByTestId('checkboxItem1')).toHaveFocus();
	});

	test('Displays proper initial checked state for checkbox items', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		const checked1 = getByTestId('check1');
		expect(checked1).toBeVisible();
		expect(queryByTestId('check2')).toBeNull();
	});

	test('Toggles checked to false for default checked checkbox items', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(queryByTestId('check1')).not.toBeNull();
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ENTER}}`);
		expect(queryByTestId('check1')).toBeNull();
	});

	test('Toggles checked to true for default unchecked checkbox items', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(queryByTestId('check2')).toBeNull();
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ENTER}}`);
		expect(queryByTestId('check2')).not.toBeNull();
	});

	test('Hovering over subtrigger opens submenu', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		expect(getByTestId('submenu')).toBeVisible();
		expect(subtrigger).toHaveFocus();
	});

	test.each([
		[kbd.ARROW_DOWN, 'item1', 'checkboxItem1'],
		[kbd.ARROW_UP, 'checkboxItem1', 'item1'],
	])(
		'Pressing arrow keys while hovering over item goes to next/prev item',
		async (key, hoverItem, endItem) => {
			const { getByTestId } = render(DropdownMenuForceVisible);
			const trigger = getByTestId('trigger');
			const user = userEvent.setup();

			await user.click(trigger);
			const item = getByTestId(hoverItem);
			await user.hover(item);
			await user.keyboard(`{${key}}`);
			expect(item).not.toHaveFocus();
			expect(getByTestId(`${endItem}`)).toHaveFocus();
		}
	);

	test('Arrow right when subtrigger hover focuses first item in submenu', async () => {
		const { getByTestId, queryByTestId } = render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		const subItem0 = getByTestId('subitem0');
		expect(subItem0).toHaveFocus();

		// Arrow down inside submenu moves to next submenu item
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		const subItem1 = getByTestId('subitem1');
		expect(subItem1).toHaveFocus();

		await user.hover(subItem1);

		// Arrow left inside submenu closes submenu and focuses subtrigger
		await user.keyboard(`{${kbd.ARROW_LEFT}}`);
		expect(subItem0).not.toHaveFocus();
		expect(subtrigger).toHaveFocus();
	});

	test('loops through items when loop prop true', async () => {
		const { queryByTestId, getByTestId } = render(DropdownMenuTest, {
			loop: true,
		});
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		const menuItems = ['item1', 'checkboxItem1', 'checkboxItem2', 'subtrigger'];

		await user.click(trigger);
		expect(queryByTestId('menu')).not.toBeNull();

		for (const item of menuItems) {
			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			expect(getByTestId(item)).toHaveFocus();
		}
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(getByTestId('item1')).toHaveFocus();
		await user.keyboard(`{${kbd.ARROW_UP}}`);
		expect(getByTestId('subtrigger')).toHaveFocus();
	});

	test('does not loop through items when loop prop false/undefined', async () => {
		const { queryByTestId, getByTestId } = render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		const menuItems = ['item1', 'checkboxItem1', 'checkboxItem2', 'subtrigger'];

		await user.click(trigger);
		expect(queryByTestId('menu')).not.toBeNull();

		for (const item of menuItems) {
			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			expect(getByTestId(item)).toHaveFocus();
		}
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(getByTestId('item1')).not.toHaveFocus();
		expect(getByTestId('subtrigger')).toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_UP}}`);
		await user.keyboard(`{${kbd.ARROW_UP}}`);
		await user.keyboard(`{${kbd.ARROW_UP}}`);
		expect(getByTestId('item1')).toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_UP}}`);
		expect(getByTestId('subtrigger')).not.toHaveFocus();
		expect(getByTestId('item1')).toHaveFocus();
	});

	test.todo('Radio items');
});
