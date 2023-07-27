import { render, act } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers';
import { kbd } from '$lib/internal/helpers';
import DropdownMenuTest from './DropdownMenuTest.svelte';
import DropdownMenuForceVisible from './DropdownMenuForceVisibleTest.svelte';

const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

describe('Dropdown Menu (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(DropdownMenuTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is clicked', async () => {
		const { getByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
		await expect(menu).toBeVisible();

		test('Arrow is visible when open', async () => {
			const arrow = getByTestId('arrow');
			await expect(arrow).toBeVisible();
		});

		test('Closes when trigger is clicked while open', async () => {
			await user.click(trigger);
			await expect(menu).not.toBeVisible();
		});
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		await expect(menu).toBeVisible();

		test(`Focuses first item when opened with ${key}`, async () => {
			const firstItem = getByTestId('item1');
			await expect(firstItem).toHaveFocus();
		});
	});

	test('Focus when opened with click', async () => {
		const { getByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
		await expect(menu).toBeVisible();

		const firstItem = getByTestId('item1');
		await expect(firstItem).not.toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_DOWN}}`);

		test('Focuses first item when arrow down is pressed', async () => {
			await expect(firstItem).toHaveFocus();
		});

		test('Doesnt focus disabled menu items', async () => {
			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			const disabledItem = getByTestId('item2');
			await expect(disabledItem).not.toHaveFocus();
			await expect(getByTestId('checkboxItem1')).toHaveFocus();
		});
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		await expect(menu).toBeVisible();
	});

	test('Displays proper initial checked state for checkbox items', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		const checked1 = getByTestId('check1');
		await expect(checked1).toBeVisible();
		await expect(queryByTestId('check2')).toBeNull();
	});

	test('Toggles checked to false for default checked checkbox items', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await expect(queryByTestId('check1')).not.toBeNull();
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ENTER}}`);
		await expect(queryByTestId('check1')).toBeNull();
	});

	test('Toggles checked to true for default unchecked checkbox items', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await expect(queryByTestId('check2')).toBeNull();
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ENTER}}`);
		await expect(queryByTestId('check2')).not.toBeNull();
	});

	test('Hovering over subtrigger opens submenu', async () => {
		const { getByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		const submenu = getByTestId('submenu');
		await expect(submenu).not.toBeVisible();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		await expect(submenu).toBeVisible();
		await expect(subtrigger).toHaveFocus();
	});

	test.each([
		[kbd.ARROW_DOWN, 'item1', 'checkboxItem1'],
		[kbd.ARROW_UP, 'checkboxItem1', 'item1'],
	])(
		'Pressing arrow keys while hovering over item goes to next/prev item',
		async (key, hoverItem, endItem) => {
			const { getByTestId } = await render(DropdownMenuTest);
			const trigger = getByTestId('trigger');
			const user = userEvent.setup();

			await user.click(trigger);
			const item = getByTestId(hoverItem);
			await user.hover(item);
			await user.keyboard(`{${key}}`);
			await expect(item).not.toHaveFocus();
			await expect(getByTestId(`${endItem}`)).toHaveFocus();
		}
	);

	test('Arrow right when subtrigger hover focuses first item in submenu', async () => {
		const { getByTestId } = await render(DropdownMenuTest);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		const submenu = getByTestId('submenu');
		await expect(submenu).not.toBeVisible();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		const subItem0 = getByTestId('subitem0');
		await expect(subItem0).toHaveFocus();
		test('Arrow down inside submenu moves to next submenu item', async () => {
			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			const subItem1 = getByTestId('subitem1');
			await expect(subItem1).toHaveFocus();
		});
		test('Arrow left inside submenu closes submenu and focuses subtrigger', async () => {
			await user.keyboard(`{${kbd.ARROW_LEFT}}`);
			await expect(subItem0).not.toHaveFocus();
			await expect(submenu).not.toBeVisible();
			await expect(subtrigger).toHaveFocus();
		});
	});

	test.todo('Radio items');
});

describe('Dropdown Menu (forceVisible)', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(DropdownMenuForceVisible);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is clicked', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();
		await expect(queryByTestId('menu')).toBeNull();

		await user.click(trigger);
		const menu = getByTestId('menu');
		await expect(menu).toBeVisible();

		test('Arrow is visible when open', async () => {
			const arrow = getByTestId('arrow');
			await expect(arrow).toBeVisible();
		});

		test('Closes when trigger is clicked while open', async () => {
			await user.click(trigger);
			await expect(menu).not.toBeVisible();
		});
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		await expect(queryByTestId('menu')).toBeNull();
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		await expect(getByTestId('menu')).toBeVisible();

		test(`Focuses first item when opened with ${key}`, async () => {
			const firstItem = getByTestId('item1');
			await expect(firstItem).toHaveFocus();
		});
	});

	test('Focus when opened with click', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await expect(queryByTestId('menu')).toBeNull();
		await user.click(trigger);
		await expect(getByTestId('menu')).toBeVisible();

		const firstItem = getByTestId('item1');
		await expect(firstItem).not.toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_DOWN}}`);

		test('Focuses first item when arrow down is pressed', async () => {
			await expect(firstItem).toHaveFocus();
		});
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await expect(queryByTestId('menu')).toBeNull();
		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		await expect(getByTestId('menu')).toBeVisible();
		const firstItem = getByTestId('item1');
		test('focuses first item when opened with a key', async () => {
			await expect(firstItem).toHaveFocus();
		});
	});

	test('Doesnt focus disabled menu items', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await expect(queryByTestId('menu')).toBeNull();
		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.SPACE}}`);
		await expect(getByTestId('menu')).toBeVisible();
		const firstItem = getByTestId('item1');
		test('focuses first item when opened with a key', async () => {
			await expect(firstItem).toHaveFocus();
		});

		test('Doesnt focus disabled menu items', async () => {
			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			const disabledItem = getByTestId('item2');
			await expect(disabledItem).not.toHaveFocus();
			await expect(getByTestId('checkboxItem1')).toHaveFocus();
		});
	});

	test('Displays proper initial checked state for checkbox items', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		const checked1 = getByTestId('check1');
		await expect(checked1).toBeVisible();
		await expect(queryByTestId('check2')).toBeNull();
	});

	test('Toggles checked to false for default checked checkbox items', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await expect(queryByTestId('check1')).not.toBeNull();

		test('Toggles checked to false for default checked checkbox items', async () => {
			await user.keyboard(`{${kbd.ENTER}}`);
			await user.keyboard(`{${kbd.ENTER}}`);
			await expect(queryByTestId('check1')).toBeNull();
		});
	});

	test('Toggles checked to true for default unchecked checkbox items', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await act(() => trigger.focus());
		await user.keyboard(`{${kbd.ENTER}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		await expect(queryByTestId('check2')).toBeNull();

		test('Toggle to true', async () => {
			await user.keyboard(`{${kbd.ENTER}}`);
			await user.keyboard(`{${kbd.ENTER}}`);
			await expect(queryByTestId('check2')).not.toBeNull();
		});
	});

	test('Hovering over subtrigger opens submenu', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		await expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		await expect(getByTestId('submenu')).toBeVisible();
		await expect(subtrigger).toHaveFocus();
	});

	test.each([
		[kbd.ARROW_DOWN, 'item1', 'checkboxItem1'],
		[kbd.ARROW_UP, 'checkboxItem1', 'item1'],
	])(
		'Pressing arrow keys while hovering over item goes to next/prev item',
		async (key, hoverItem, endItem) => {
			const { getByTestId } = await render(DropdownMenuForceVisible);
			const trigger = getByTestId('trigger');
			const user = userEvent.setup();

			await user.click(trigger);
			const item = getByTestId(hoverItem);
			await user.hover(item);
			await user.keyboard(`{${key}}`);
			await expect(item).not.toHaveFocus();
			await expect(getByTestId(`${endItem}`)).toHaveFocus();
		}
	);

	test('Arrow right when subtrigger hover focuses first item in submenu', async () => {
		const { getByTestId, queryByTestId } = await render(DropdownMenuForceVisible);
		const trigger = getByTestId('trigger');
		const user = userEvent.setup();

		await user.click(trigger);
		await expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('subtrigger');
		await user.hover(subtrigger);
		await sleep(100);
		await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		const subItem0 = getByTestId('subitem0');
		await expect(subItem0).toHaveFocus();
		test('Arrow down inside submenu moves to next submenu item', async () => {
			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			const subItem1 = getByTestId('subitem1');
			await expect(subItem1).toHaveFocus();
		});
		test('Arrow left inside submenu closes submenu and focuses subtrigger', async () => {
			await user.keyboard(`{${kbd.ARROW_LEFT}}`);
			await expect(subItem0).not.toHaveFocus();
			await expect(queryByTestId('submenu')).toBeNull();
			await expect(subtrigger).toHaveFocus();
		});
	});

	test.todo('Radio items');
});
