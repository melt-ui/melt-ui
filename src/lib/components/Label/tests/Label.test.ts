import { expect, test } from '@playwright/experimental-ct-svelte';

import LabelTest, { testConstants } from './LabelTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Label', () => {
	test('No accessibility violations', async ({ mount, page }) => {
		await mount(LabelTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Input is focused when label is clicked', async ({ mount, page }) => {
		const cmp = await mount(LabelTest);
		const label = cmp.getByTestId(testConstants.labelDataTestId);

		await label.click();

		const activeElementId = await page.evaluate(() => document.activeElement?.id);

		expect(activeElementId).toBe(testConstants.inputId);
	});

	test('Input is focused when label is double-clicked', async ({ mount, page }) => {
		const cmp = await mount(LabelTest);
		const label = cmp.getByTestId(testConstants.labelDataTestId);

		await label.dblclick();

		const activeElementId = await page.evaluate(() => document.activeElement?.id);

		expect(activeElementId).toBe(testConstants.inputId);
	});
});
