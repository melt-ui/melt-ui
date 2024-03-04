import { kbd } from '$lib/internal/helpers/keyboard.js';
import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import ToolbarTest from './ToolbarTest.svelte';
import { writable } from 'svelte/store';
import { tick } from 'svelte';
import { type CreateToolbarProps } from '$lib/index.js';

const group1Items = ['item-1', 'item-2', 'item-3'];
const group2Items = ['item-4', 'item-5', 'item-6'];
const tbItems = [...group1Items, ...group2Items];

const tbLinks = ['link-1'];
const tbButtons = ['button-1'];
const tbLinksAndButtons = [...tbLinks, ...tbButtons];
const tbButtonsAndLinks = [...tbButtons, ...tbLinks];

const allToolbarItems = [...tbItems, ...tbLinks, ...tbButtons];
const allToolbarItemsLinksFirst = [...tbLinks, ...tbItems, ...tbButtons];
const allToolbarItemsButtonsFirst = [...tbButtons, ...tbItems, ...tbLinks];

const horizontal: CreateToolbarProps['orientation'] = 'horizontal';
const vertical: CreateToolbarProps['orientation'] = 'vertical';

describe('Toolbar', () => {
	test('has no accessibility violations', async () => {
		const { container } = render(ToolbarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	test.each([
		{ desc: '', props: {}, items: allToolbarItems },
		{
			desc: 'first item is a link',
			props: { linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'first item is a button',
			props: { buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'no group items, first item is a link',
			props: { linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'no group items, first item is a button',
			props: { linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
	])("tab enters toolbar but doesn't navigate between items - $desc", async ({ props, items }) => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest, props);

		await user.tab();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.tab();
		expect(getByTestId(items[1])).not.toHaveFocus();
		await user.tab({ shift: true });
		expect(getByTestId(items[0])).toHaveFocus();
		await user.tab({ shift: true });
		expect(getByTestId(items[0])).not.toHaveFocus();
	});

	test.each([
		{ desc: 'horizontal', props: { orientation: horizontal }, items: allToolbarItems },
		{ desc: 'vertical', props: { orientation: vertical }, items: allToolbarItems },
		{
			desc: 'horizontal, first item is a link',
			props: { orientation: horizontal, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'vertical, first item is a link',
			props: { orientation: vertical, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'horizontal, first item is a button',
			props: { orientation: horizontal, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'vertical, first item is a button',
			props: { orientation: vertical, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'horizontal, no group items, first item is a link',
			props: { orientation: horizontal, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'vertical, no group items, first item is a link',
			props: { orientation: vertical, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'horizontal, no group items, first item is a button',
			props: { orientation: horizontal, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
		{
			desc: 'vertical, no group items, first item is a button',
			props: { orientation: vertical, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
	])('arrow keys navigate between items - $desc', async ({ props, items }) => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest, props);

		const nextKey = `{${props.orientation === horizontal ? kbd.ARROW_RIGHT : kbd.ARROW_DOWN}}`;
		const prevKey = `{${props.orientation === horizontal ? kbd.ARROW_LEFT : kbd.ARROW_UP}}`;

		const reversedItems = [...items].reverse();

		await user.tab();

		for (const item of items) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(nextKey);
		}

		for (const item of reversedItems) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(prevKey);
		}
	});

	test.each([
		{ desc: 'horizontal', props: { orientation: horizontal }, items: allToolbarItems },
		{ desc: 'vertical', props: { orientation: vertical }, items: allToolbarItems },
		{
			desc: 'horizontal, first item is a link',
			props: { orientation: horizontal, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'vertical, first item is a link',
			props: { orientation: vertical, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'horizontal, first item is a button',
			props: { orientation: horizontal, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'vertical, first item is a button',
			props: { orientation: vertical, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'horizontal, no group items, first item is a link',
			props: { orientation: horizontal, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'vertical, no group items, first item is a link',
			props: { orientation: vertical, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'horizontal, no group items, first item is a button',
			props: { orientation: horizontal, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
		{
			desc: 'vertical, no group items, first item is a button',
			props: { orientation: vertical, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
	])(
		'arrow key navigation loops around when looping is enabled - $desc',
		async ({ props, items }) => {
			const user = userEvent.setup();
			const { getByTestId } = render(ToolbarTest, { loop: true, ...props });

			const nextKey = `{${props.orientation === horizontal ? kbd.ARROW_RIGHT : kbd.ARROW_DOWN}}`;
			const prevKey = `{${props.orientation === horizontal ? kbd.ARROW_LEFT : kbd.ARROW_UP}}`;

			await user.tab();
			const firstItem = getByTestId(items[0]);
			const lastItem = getByTestId(items[items.length - 1]);
			expect(firstItem).toHaveFocus();
			await user.keyboard(prevKey);
			expect(lastItem).toHaveFocus();
			await user.keyboard(nextKey);
			expect(firstItem).toHaveFocus();
		}
	);

	test.each([
		{ desc: 'horizontal', props: { orientation: horizontal }, items: allToolbarItems },
		{ desc: 'vertical', props: { orientation: vertical }, items: allToolbarItems },
		{
			desc: 'horizontal, first item is a link',
			props: { orientation: horizontal, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'vertical, first item is a link',
			props: { orientation: vertical, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'horizontal, first item is a button',
			props: { orientation: horizontal, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'vertical, first item is a button',
			props: { orientation: vertical, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'horizontal, no group items, first item is a link',
			props: { orientation: horizontal, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'vertical, no group items, first item is a link',
			props: { orientation: vertical, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'horizontal, no group items, first item is a button',
			props: { orientation: horizontal, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
		{
			desc: 'vertical, no group items, first item is a button',
			props: { orientation: vertical, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
	])(
		'arrow key navigation does not loop around when looping is disabled - $desc',
		async ({ props, items }) => {
			const user = userEvent.setup();
			const { getByTestId } = render(ToolbarTest, { loop: false, ...props });

			const nextKey = `{${props.orientation === horizontal ? kbd.ARROW_RIGHT : kbd.ARROW_DOWN}}`;
			const prevKey = `{${props.orientation === horizontal ? kbd.ARROW_LEFT : kbd.ARROW_UP}}`;

			const firstItem = getByTestId(items[0]);
			const lastItem = getByTestId(items[items.length - 1]);

			firstItem.focus();
			expect(firstItem).toHaveFocus();
			await user.keyboard(prevKey);
			expect(firstItem).toHaveFocus();

			lastItem.focus();
			expect(lastItem).toHaveFocus();
			await user.keyboard(nextKey);
			expect(lastItem).toHaveFocus();
		}
	);

	test.each([
		{ desc: 'horizontal', props: { orientation: horizontal }, items: allToolbarItems },
		{ desc: 'vertical', props: { orientation: vertical }, items: allToolbarItems },
		{
			desc: 'horizontal, first item is a link',
			props: { orientation: horizontal, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'vertical, first item is a link',
			props: { orientation: vertical, linksFirst: true },
			items: allToolbarItemsLinksFirst,
		},
		{
			desc: 'horizontal, first item is a button',
			props: { orientation: horizontal, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'vertical, first item is a button',
			props: { orientation: vertical, buttonsFirst: true },
			items: allToolbarItemsButtonsFirst,
		},
		{
			desc: 'horizontal, no group items, first item is a link',
			props: { orientation: horizontal, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'vertical, no group items, first item is a link',
			props: { orientation: vertical, linksButtonsOnly: true, linksFirst: true },
			items: tbLinksAndButtons,
		},
		{
			desc: 'horizontal, no group items, first item is a button',
			props: { orientation: horizontal, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
		{
			desc: 'vertical, no group items, first item is a button',
			props: { orientation: vertical, linksButtonsOnly: true, buttonsFirst: true },
			items: tbButtonsAndLinks,
		},
	])('home and end keys focus first and last items - $desc', async ({ props, items }) => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest, props);

		await user.tab();
		const firstItem = getByTestId(items[0]);
		const lastItem = getByTestId(items[items.length - 1]);
		expect(firstItem).toHaveFocus();
		await user.keyboard(`{${kbd.END}}`);
		expect(lastItem).toHaveFocus();
		await user.keyboard(`{${kbd.HOME}}`);
		expect(firstItem).toHaveFocus();
	});

	test('items can be selected with keyboard', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest);

		for (const item of group1Items) {
			const curr = getByTestId(item);
			curr.focus();
			expect(curr).toHaveFocus();
			await user.keyboard(`{${kbd.SPACE}}`);
			expect(curr).toHaveAttribute('aria-pressed', 'true');
			expect(curr).toHaveAttribute('data-state', 'on');
		}

		for (const item of group2Items) {
			const curr = getByTestId(item);
			curr.focus();
			expect(curr).toHaveFocus();
			await user.keyboard(`{${kbd.SPACE}}`);
			expect(curr).toHaveAttribute('aria-checked', 'true');
			expect(curr).toHaveAttribute('data-state', 'on');
		}
	});

	test('items can be selected with mouse', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest);

		for (const item of group1Items) {
			const curr = getByTestId(item);
			await user.click(curr);
			expect(curr).toHaveAttribute('aria-pressed', 'true');
			expect(curr).toHaveAttribute('data-state', 'on');
		}

		for (const item of group2Items) {
			const curr = getByTestId(item);
			await user.click(curr);
			expect(curr).toHaveAttribute('aria-checked', 'true');
			expect(curr).toHaveAttribute('data-state', 'on');
		}
	});

	test('multiple items can be selected in `multiple` groups', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest);

		for (const item of group1Items) {
			const curr = getByTestId(item);
			await user.click(curr);
		}

		const group1 = getByTestId('group-1');
		const group1OnItems = group1.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group1OnItems.length).toBe(group1Items.length);
	});

	test('multiple items cannot be selected in `single` groups', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest);

		const group2Items = ['item-4', 'item-5', 'item-6'];

		for (const item of group2Items) {
			const curr = getByTestId(item);
			await user.click(curr);
		}

		const group2 = getByTestId('group-2');
		const group2OnItems = group2.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group2OnItems.length).toBe(1);
	});

	test('default value sets initial pressed/checked items', async () => {
		const { getByTestId } = render(ToolbarTest, {
			orientation: 'vertical',
			toolbarGroup1Props: {
				defaultValue: ['item-1', 'item-2'],
			},
			toolbarGroup2Props: {
				defaultValue: 'item-5',
			},
		});

		const group1 = getByTestId('group-1');
		const group1OnItems = group1.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group1OnItems.length).toBe(2);
		expect(group1OnItems[0]).toHaveAttribute('data-testid', 'item-1');
		expect(group1OnItems[1]).toHaveAttribute('data-testid', 'item-2');

		const group2 = getByTestId('group-2');
		const group2OnItems = group2.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group2OnItems.length).toBe(1);
		expect(group2OnItems[0]).toHaveAttribute('data-testid', 'item-5');
	});

	test('onValueChange function can override value', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToolbarTest, {
			orientation: 'vertical',
			toolbarGroup1Props: {
				onValueChange: () => {
					return ['item-1'];
				},
			},
			toolbarGroup2Props: {
				onValueChange: () => {
					return 'item-5';
				},
			},
		});

		const item1 = getByTestId('item-1');
		const item2 = getByTestId('item-2');
		await user.click(item2);
		expect(item2).not.toHaveAttribute('data-state', 'on');
		expect(item1).toHaveAttribute('data-state', 'on');

		const item5 = getByTestId('item-5');
		const item6 = getByTestId('item-6');
		await user.click(item6);
		expect(item6).not.toHaveAttribute('data-state', 'on');
		expect(item5).toHaveAttribute('data-state', 'on');
	});

	test('value prop overrides default value', async () => {
		const valueStore1 = writable(['item-1', 'item-2']);
		const valueStore2 = writable('item-5');
		const { getByTestId } = render(ToolbarTest, {
			orientation: 'vertical',
			toolbarGroup1Props: {
				defaultValue: ['item-3'],
				value: valueStore1,
			},
			toolbarGroup2Props: {
				defaultValue: 'item-6',
				value: valueStore2,
			},
		});

		const group1 = getByTestId('group-1');
		const group1OnItems = group1.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group1OnItems.length).toBe(2);
		expect(group1OnItems[0]).toHaveAttribute('data-testid', 'item-1');
		expect(group1OnItems[1]).toHaveAttribute('data-testid', 'item-2');

		const group2 = getByTestId('group-2');
		const group2OnItems = group2.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group2OnItems.length).toBe(1);
		expect(group2OnItems[0]).toHaveAttribute('data-testid', 'item-5');
	});

	test('can be programmatically updated using value store', async () => {
		const valueStore1 = writable<string[]>([]);
		const valueStore2 = writable<string>(undefined);
		const { getByTestId } = render(ToolbarTest, {
			orientation: 'vertical',
			toolbarGroup1Props: {
				value: valueStore1,
			},
			toolbarGroup2Props: {
				value: valueStore2,
			},
		});

		const group1 = getByTestId('group-1');
		const group1OnItems = group1.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group1OnItems.length).toBe(0);

		const group2 = getByTestId('group-2');
		const group2OnItems = group2.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group2OnItems.length).toBe(0);

		valueStore1.update(() => ['item-1', 'item-2']);
		await tick();
		const group1OnItems2 = group1.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group1OnItems2.length).toBe(2);
		expect(group1OnItems2[0]).toHaveAttribute('data-testid', 'item-1');
		expect(group1OnItems2[1]).toHaveAttribute('data-testid', 'item-2');

		valueStore2.update(() => 'item-5');
		await tick();
		const group2OnItems2 = group2.querySelectorAll<HTMLElement>('[data-state="on"]');
		expect(group2OnItems2.length).toBe(1);
		expect(group2OnItems2[0]).toHaveAttribute('data-testid', 'item-5');
	});
});
