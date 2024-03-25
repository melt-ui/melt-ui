import { test, expect, type Page, Locator } from '@playwright/test';
import { jsAvailable } from './utils.js';

const locators = {
	trigger: '[data-melt-dialog-trigger]',
	overlay: '[data-melt-dialog-overlay][data-state="open"]',
	content: '[data-melt-dialog-content][data-state="open"]',
};

async function nav(page: Page) {
	await page.goto('/docs/builders/dialog');
	await jsAvailable(page);
}

test.describe.configure({ mode: 'parallel', retries: 0 });

test.describe('dialog', () => {
	test.beforeEach(async ({ page }) => {
		await nav(page);
	});

	test.describe('touch device', () => {
		test("doesn't leak events when tapping overlay", async ({ page }) => {
			const trigger = page.locator(locators.trigger).first();
			const content = page.locator(locators.content).first();
			const viewCodeButton = page.getByLabel('View code').first();

			await trigger.click();
			await expect(content).toBeVisible();

			const [centerX, centerY] = await getElementCenterPosition(viewCodeButton);

			// Make sure "View Code" Button is not under the dialog, but under the overlay.
			const isButtonUnderneathContent = await isPositionInsideElement(content, centerX, centerY);
			expect(isButtonUnderneathContent).toBe(false);

			// Tap the overlay at the position of the "View code" button
			await page.tap(locators.overlay, { position: { x: centerX, y: centerY } });

			await expect(content).not.toBeVisible();

			// Verify the state of the "View Code" is "unchecked".
			const viewCodeState = await viewCodeButton.getAttribute('data-state');
			expect(viewCodeState).toBe('unchecked');
		});
	});
});

/**
 * Retrieves the bounding box of an element and throws an error if `null`.
 */
const getBoundingBox = async (locator: Locator) => {
	const bounding = await locator.boundingBox();
	if (!bounding) throw new Error(`Failed to get position of '${locator}'`);
	return bounding;
};

/**
 * Retrieves the center position (x, y coordinates) of an element represented by a Locator.
 */
const getElementCenterPosition = async (locator: Locator) => {
	const bounding = await getBoundingBox(locator);
	return [bounding.x + bounding.width / 2, bounding.y + bounding.height / 2] as const;
};

/**
 * Verifies an x, y position is within the boundaries of an element.
 */
const isPositionInsideElement = async (locator: Locator, x: number, y: number) => {
	const bounding = await getBoundingBox(locator);
	const isXValid = bounding.x <= x && x <= bounding.x + bounding.width;
	const isYValid = bounding.y <= y && y <= bounding.y + bounding.height;
	return isXValid && isYValid;
};
