import { expect, test } from '@playwright/experimental-ct-svelte';

import PopperTest from './PopperTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Popper', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(PopperTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Opens up when clicked', async ({ mount, page }) => {
		const cmp = await mount(PopperTest);
		const anchor = cmp.getByTestId('anchor');
		const content = cmp.getByTestId('content');

		await expect(content).not.toBeVisible();
		await anchor.click();
		await expect(content).toBeVisible();

		await expect(content).toHaveAttribute('data-side', 'bottom');
		await expect(content).toHaveAttribute('data-align', 'center');
	});
});
