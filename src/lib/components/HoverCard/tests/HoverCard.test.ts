import { expect, test } from '@playwright/experimental-ct-svelte';
import HoverCardTest from './HoverCardTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('HoverCard', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(HoverCardTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Should be visible when open prop is true', async ({ mount, page }) => {
		await mount(HoverCardTest, { props: { open: true } });
		await expect(page.getByTestId('hovercard-content')).toBeVisible();
	});

	test('Should be visible after hovering', async ({ mount, page }) => {
		const cmp = await mount(HoverCardTest);

		await cmp.getByTestId('hovercard-trigger').dispatchEvent('pointerenter');
		await page.waitForTimeout(750);

		await expect(page.getByTestId('hovercard-content')).toBeVisible();
	});

	test('Should be hidden after leaving', async ({ mount, page }) => {
		const cmp = await mount(HoverCardTest);

		await cmp.getByTestId('hovercard-trigger').dispatchEvent('pointerenter');
		await page.waitForTimeout(750);
		await cmp.getByTestId('hovercard-trigger').dispatchEvent('pointerleave');
		await page.waitForTimeout(300);

		await expect(page.getByTestId('hovercard-content')).not.toBeVisible();
	});
});
