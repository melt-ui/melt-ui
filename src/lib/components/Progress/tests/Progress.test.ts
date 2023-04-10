import { expect, test } from '@playwright/experimental-ct-svelte';

import ProgressTest from './ProgressTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Checkbox', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(ProgressTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Indicator has default values', async ({ mount }) => {
		const cmp = await mount(ProgressTest);
		const indicator = cmp.getByTestId('progress-indicator');

		await expect(cmp).toBeVisible();

		await expect(cmp).toHaveAttribute('data-value', '0');
		await expect(indicator).toHaveAttribute('data-value', '0');

		await expect(cmp).toHaveAttribute('data-max', '1');
		await expect(indicator).toHaveAttribute('data-max', '1');
	});

	test('Should have populated ARIA attributes', async ({ mount }) => {
		const cmp = await mount(ProgressTest, {
			props: {
				value: 100,
				max: 200,
			},
		});

		await expect(cmp).toBeVisible();

		await expect(cmp).toHaveAttribute('aria-valuemin', '0');
		await expect(cmp).toHaveAttribute('aria-valuenow', '100');
		await expect(cmp).toHaveAttribute('aria-valuemax', '200');
		await expect(cmp).toHaveAttribute('aria-valuetext', '50%');
	});
});
