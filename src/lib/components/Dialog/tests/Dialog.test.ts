import { expect, test } from '@playwright/experimental-ct-svelte';

import { axeViolations } from '$test-helpers/axeTester.js';
import DialogTest from './DialogTest.svelte';

test.describe('Dialog', () => {
	test.beforeEach(async ({ mount }) => {
		await mount(DialogTest);
	});

	test('No accesibility violations', async ({ page }) => {
		expect(await axeViolations(page)).toEqual([]);
	});

	test('When the trigger is clicked', async ({ page }) => {
		const content = await page.getByTestId('content');
		await expect(content).not.toBeVisible();
		await page.getByTestId('trigger').click();
		await expect(content).toBeVisible();
	});

	test('When esc is clicked', async ({ page }) => {
		const content = await page.getByTestId('content');
		await page.getByTestId('trigger').click();
		await expect(content).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(content).not.toBeVisible();
	});

	test('When the close button is clicked', async ({ page }) => {
		const content = await page.getByTestId('content');
		await page.getByTestId('trigger').click();
		await expect(content).toBeVisible();
		await page.getByTestId('close').click();
		await expect(content).not.toBeVisible();
	});
});
