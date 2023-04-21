import { expect, test } from '@playwright/experimental-ct-svelte';

import WorkingSrc from './WorkingSrc.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Avatar', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(WorkingSrc);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Should render fallback initially', async ({ mount }) => {
		const cmp = await mount(WorkingSrc);
		expect(cmp.getByTestId('fallback')).toBeTruthy();
	});

	test('Should render image when src is loaded', async ({ mount, page }) => {
		const cmp = await mount(WorkingSrc);
		expect(cmp.getByTestId('fallback')).toBeTruthy();
		await page.waitForSelector('img');
		expect(cmp.getByTestId('image')).toBeTruthy();
	});
});
