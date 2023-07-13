import { Page } from '@playwright/test';

export const jsAvailable = async (page: Page) => {
	await page.waitForSelector('[data-browser]');
};
