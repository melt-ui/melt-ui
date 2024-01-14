import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { testKbd as kbd } from '../utils.js';
import ContextMenuTest from './ContextMenuTest.svelte';
import type { CreateContextMenuProps } from '$lib/index.js';

function setup(props: CreateContextMenuProps = {}) {
	const user = userEvent.setup();
	const returned = render(ContextMenuTest, props);
	const trigger = returned.getByTestId('trigger');
	return {
		user,
		trigger,
		...returned,
	};
}

async function open(
	props: CreateContextMenuProps & { submenuIds?: CreateContextMenuProps['ids'] } = {}
) {
	const returned = setup(props);
	const { queryByTestId, getByTestId, user, trigger } = returned;
	expect(queryByTestId('menu')).toBeNull();
	await user.pointer([{ target: trigger }, { keys: '[MouseRight]', target: trigger }]);
	await waitFor(() => expect(queryByTestId('menu')).not.toBeNull());
	const menu = getByTestId('menu');
	expect(menu).toBeVisible();
	return {
		...returned,
		user,
		trigger,
		menu,
	};
}

describe('Context Menu', () => {
	beforeEach(() => {
		vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
			return window.setTimeout(() => fn(Date.now()), 16);
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test('No accessibility violations', async () => {
		const { container } = render(ContextMenuTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is right-clicked', async () => {
		await open();
	});

	test('Focus when opened', async () => {
		const { user, getByTestId } = await open();

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

	test('Displays proper initial checked state for checkbox items', async () => {
		const { getByTestId, queryByTestId } = await open();

		const checked1 = getByTestId('check1');
		expect(checked1).toBeVisible();
		expect(queryByTestId('check2')).toBeNull();
	});

	test('Toggles checked to false for default checked checkbox items', async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(queryByTestId('check1')).not.toBeNull();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ENTER);
		expect(queryByTestId('check1')).toBeNull();
	});

	test('Toggles checked to true for default unchecked checkbox items', async () => {
		const { user, queryByTestId } = await open();

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		expect(queryByTestId('check2')).toBeNull();
		await user.keyboard(kbd.ENTER);
		await user.keyboard(kbd.ENTER);
		expect(queryByTestId('check2')).not.toBeNull();
	});

	test('Hovering over subtrigger opens submenu', async () => {
		const { user, getByTestId, queryByTestId } = await open();

		expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('sub-trigger');
		await user.hover(subtrigger);
		await waitFor(() => expect(queryByTestId('submenu')).not.toBeNull());
		expect(subtrigger).toHaveFocus();
	});

	test.each([
		[kbd.ARROW_DOWN, 'item1', 'checkboxItem1'],
		[kbd.ARROW_UP, 'checkboxItem1', 'item1'],
	])(
		'Pressing arrow keys while hovering over item goes to next/prev item',
		async (key, hoverItem, endItem) => {
			const { user, getByTestId } = await open();

			const item = getByTestId(hoverItem);
			await user.hover(item);
			await user.keyboard(key);
			expect(item).not.toHaveFocus();
			expect(getByTestId(`${endItem}`)).toHaveFocus();
		}
	);

	test('Arrow right when subtrigger hover focuses first item in submenu', async () => {
		const { user, getByTestId, queryByTestId } = await open();
		expect(queryByTestId('submenu')).toBeNull();
		const subtrigger = getByTestId('sub-trigger');
		await user.hover(subtrigger);
		await waitFor(() => expect(queryByTestId('submenu')).not.toBeNull());
		await user.keyboard(kbd.ARROW_RIGHT);
		const subItem0 = getByTestId('subitem0');
		expect(subItem0).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		const subItem1 = getByTestId('subitem1');
		expect(subItem1).toHaveFocus();
	});

	test('Should close on outside click by default', async () => {
		const { user, getByTestId, queryByTestId } = await open();
		const outsideClick = getByTestId('outside-click');
		await user.click(outsideClick);
		await waitFor(() => expect(queryByTestId('menu')).toBeNull());
	});

	test('Should close on escape', async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(queryByTestId('menu')).toBeNull());
	});

	test('respects `closeOnEscape` prop', async () => {
		const { user, getByTestId } = await open({
			closeOnEscape: false,
		});
		await user.keyboard(kbd.ESCAPE);
		expect(getByTestId('menu')).toBeVisible();
		await user.keyboard(kbd.ARROW_DOWN);
	});

	test('respects close on outside click prop', async () => {
		const { user, menu, getByTestId } = await open({
			closeOnOutsideClick: false,
		});
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

		const { getByTestId, user, queryByTestId } = await open({
			ids,
			submenuIds: subIds,
		});

		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const subtrigger = getByTestId('sub-trigger');

		await user.hover(subtrigger);
		await waitFor(() => expect(queryByTestId('submenu')).not.toBeNull());

		expect(trigger.id).toBe(ids.trigger);
		expect(menu.id).toBe(ids.menu);
		expect(subtrigger.id).toBe(subIds.trigger);
		const submenu = getByTestId('submenu');
		expect(submenu.id).toBe(subIds.menu);
	});
});
