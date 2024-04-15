import { Page } from '@playwright/test';

export const jsAvailable = async (page: Page) => {
	if (process.env.CI) {
		return await page.evaluate(() => {
			return new Promise((resolve) => setTimeout(resolve, 0));
		});
	}
	await page.waitForSelector('[data-browser]');
};
