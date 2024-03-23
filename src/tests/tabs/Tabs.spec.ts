import { testKbd as kbd } from '../utils.js';
import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import TabsTest from './TabsTest.svelte';

const tabs = ['1', '2', '3', '4', '5'];

describe('Tabs', () => {
	test('has no accessibility violations', async () => {
		const { container } = render(TabsTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	test('tablist renders tabs', async () => {
		const { getByTestId } = render(TabsTest, {
			tabValues: tabs,
		});

		const tabList = getByTestId('list');

		const tabTriggers = tabList.querySelectorAll('[role="tab"]');
		expect(tabTriggers.length).toBe(tabs.length);
	});

	test('can navigate tabs with arrow keys', async () => {
		const { getByTestId } = render(TabsTest, {
			tabValues: tabs,
		});

		const firstTrigger = getByTestId('1-trigger');
		firstTrigger.focus();

		for (const tab of tabs) {
			expect(getByTestId(`${tab}-trigger`)).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_RIGHT);
		}

		const lastTrigger = getByTestId(`${tabs[tabs.length - 1]}-trigger`);
		lastTrigger.focus();

		for (const tab of [...tabs].reverse()) {
			expect(getByTestId(`${tab}-trigger`)).toHaveFocus();
			await userEvent.keyboard(kbd.ARROW_LEFT);
		}
	});
});
