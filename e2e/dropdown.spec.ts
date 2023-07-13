import { test, expect, type Page } from '@playwright/test';
import { jsAvailable } from './utils';

const locators = {
	trigger: '[data-melt-dropdown-menu-trigger]',
	menu: '[data-melt-dropdown-menu]',
	item: '[data-melt-dropdown-menu-item]',
};

const menuOpenKeys = ['ArrowDown', 'Space', 'Enter'];

async function nav(page: Page) {
	await page.goto('http://localhost:5173/docs/builders/dropdown-menu');
	await jsAvailable(page);
}

test.describe.configure({ mode: 'parallel' });

test.describe('menu', () => {
	test.beforeEach(async ({ page }) => {
		await nav(page);
	});

	test('should open on click', async ({ page }) => {
		const trigger = page.locator(locators.trigger);
		await trigger.click();

		const menu = page.locator(locators.menu);
		await expect(menu).toBeVisible();
	});

	for (const key of menuOpenKeys) {
		test(`should open on ${key}`, async ({ page }) => {
			const trigger = page.locator(locators.trigger);
			await trigger.press(key);

			const menu = page.locator(locators.menu);
			await expect(menu).toBeVisible();
		});
	}
});

test.describe('first menu item', () => {
	test.beforeEach(async ({ page }) => {
		await nav(page);
	});

	test('should not be focused on click open', async ({ page }) => {
		const trigger = page.locator(locators.trigger);
		await trigger.click();

		const item = page.locator(locators.item).first();
		await expect(item).not.toBeFocused();
	});

	for (const key of menuOpenKeys) {
		test(`should be focused on ${key} open`, async ({ page }) => {
			const trigger = page.locator(locators.trigger);
			await trigger.press(key);

			const item = page.locator(locators.item).first();
			await expect(item).toBeFocused();
		});
	}
	test('should be focused on arrow down after click open', async ({ page }) => {
		await page.locator(locators.trigger).click();
		await page.locator(locators.menu).press('ArrowDown');
		await expect(page.getByRole('menuitem', { name: 'About Melt UI' })).toBeFocused();
	});

	test('should not be focused on arrow down after keyed open', async ({ page }) => {
		await page.locator(locators.trigger).press('ArrowDown');
		await expect(page.getByRole('menuitem', { name: 'About Melt UI' })).toBeFocused();
	});
});
