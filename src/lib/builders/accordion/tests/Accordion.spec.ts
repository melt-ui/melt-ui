import { kbd } from '$lib/internal/helpers/keyboard';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import AccordionTest from './AccordionTest.svelte';

const items = [
	{
		id: 'item-1',
		triggerId: 'trigger-1',
		title: 'Title 1',
		description: 'Description 1',
	},
	{
		id: 'item-2',
		triggerId: 'trigger-2',
		title: 'Title 2',
		description: 'Description 2',
	},
	{
		id: 'item-3',
		triggerId: 'trigger-3',
		title: 'Item 3',
		description: 'Description 3',
	},
];

describe('Accordion', () => {
	test('has no accessibility violations', async () => {
		const { container } = render(AccordionTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('displays content when item is expanded', async () => {
		const user = userEvent.setup();

		const { getByText, getByTestId } = render(AccordionTest, { items });

		const trigger = getByTestId('trigger-3');
		await user.click(trigger);

		expect(getByText('Description 3')).toBeVisible();
	});

	test('expands item on click', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(AccordionTest, { items });

		const item = getByTestId('item-1');
		const trigger = getByTestId('trigger-1');

		await user.click(trigger);

		expect(item).toHaveAttribute('data-state', 'open');
	});

	test('does not expand item when disabled', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(AccordionTest, { items, disabled: true });

		const item = getByTestId('item-2');
		const trigger = getByTestId('trigger-2');

		expect(item).toHaveAttribute('data-state', 'closed');

		await user.click(trigger);

		expect(item).toHaveAttribute('data-state', 'closed');
	});

	test("expands only one item when type is 'single'", async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(AccordionTest, { type: 'single', items });

		const item1 = getByTestId('item-1');
		const item2 = getByTestId('item-2');

		const trigger1 = getByTestId('trigger-1');
		const trigger2 = getByTestId('trigger-2');

		expect(item1).toHaveAttribute('data-state', 'closed');
		expect(item2).toHaveAttribute('data-state', 'closed');

		await user.click(trigger1);

		expect(item1).toHaveAttribute('data-state', 'open');
		expect(item2).toHaveAttribute('data-state', 'closed');

		await user.click(trigger2);

		expect(item1).toHaveAttribute('data-state', 'closed');
		expect(item2).toHaveAttribute('data-state', 'open');
	});

	test("expands multiple items when type is 'multiple'", async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(AccordionTest, { type: 'multiple', items });

		const item1 = getByTestId('item-1');
		const item2 = getByTestId('item-2');

		const trigger1 = getByTestId('trigger-1');
		const trigger2 = getByTestId('trigger-2');

		expect(item1).toHaveAttribute('data-state', 'closed');
		expect(item2).toHaveAttribute('data-state', 'closed');

		await user.click(trigger1);

		expect(item1).toHaveAttribute('data-state', 'open');
		expect(item2).toHaveAttribute('data-state', 'closed');

		await user.click(trigger2);

		expect(item1).toHaveAttribute('data-state', 'open');
		expect(item2).toHaveAttribute('data-state', 'open');
	});

	test('expands item when pressing enter', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { type: 'single', items });

		const item = getByTestId('item-1');
		const triggerElement = getByTestId('trigger-1');

		triggerElement.focus();
		await user.keyboard(`{${kbd.ENTER}}`);

		expect(item).toHaveAttribute('data-state', 'open');
	});

	test('expands item when pressing space', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { type: 'single', items });

		const item = getByTestId('item-1');
		const triggerElement = getByTestId('trigger-1');

		triggerElement.focus();
		await user.keyboard(`{${kbd.SPACE}}`);

		expect(item).toHaveAttribute('data-state', 'open');
	});

	test('focuses on item below when pressing key arrow down', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { type: 'single', items });

		const trigger1 = getByTestId('trigger-1');
		const trigger2 = getByTestId('trigger-2');

		trigger1.focus();
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);

		expect(trigger1).not.toHaveFocus();
		expect(trigger2).toHaveFocus();
	});

	test('focuses on item above when pressing key arrow up', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { type: 'single', items });

		const trigger1 = getByTestId('trigger-1');
		const trigger2 = getByTestId('trigger-2');

		trigger2.focus();
		await user.keyboard(`{${kbd.ARROW_UP}}`);

		expect(trigger2).not.toHaveFocus();
		expect(trigger1).toHaveFocus();
	});

	test('focuses on first item when pressing key home', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { type: 'single', items });

		const trigger1 = getByTestId('trigger-1');
		const trigger3 = getByTestId('trigger-3');

		trigger3.focus();
		await user.keyboard(`{${kbd.HOME}}`);

		expect(trigger3).not.toHaveFocus();
		expect(trigger1).toHaveFocus();
	});

	test('focuses on last item when pressing key end', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AccordionTest, { type: 'single', items });

		const trigger1 = getByTestId('trigger-1');
		const trigger3 = getByTestId('trigger-3');

		trigger1.focus();
		await user.keyboard(`{${kbd.END}}`);

		expect(trigger1).not.toHaveFocus();
		expect(trigger3).toHaveFocus();
	});
});
