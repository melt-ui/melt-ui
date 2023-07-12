import { test, expect } from '@playwright/test';
import { jsAvailable } from './utils';

test('should open on click', async ({ page }) => {
	await page.goto('http://localhost:5173/docs/builders/dropdown-menu');

	await jsAvailable(page);

	const trigger = page.locator('[data-melt-dropdown-menu-trigger]');
	await trigger.click();

	const menu = page.locator('[data-melt-dropdown-menu]');
	await expect(menu).toBeVisible();
});
