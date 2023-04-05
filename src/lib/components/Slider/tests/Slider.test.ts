import { expect, test } from '@playwright/experimental-ct-svelte';

import SliderTest from './SliderTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Slider', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(SliderTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Horizontal value updates when clicked', async ({ mount }) => {
		const cmp = await mount(SliderTest);
		const root = cmp.getByTestId('slider-root');
		const input = cmp.locator('input');

		await root.click({
			position: { x: 40, y: 0 }
		});

		await expect(cmp.getByTestId('slider-thumb')).toBeFocused();
		await expect(input).toHaveAttribute('value', '40');
	});

	test('Vertical value updates when clicked', async ({ mount }) => {
		const cmp = await mount(SliderTest, { props: { orientation: 'vertical' } });
		const root = cmp.getByTestId('slider-root');
		const input = cmp.locator('input');

		await root.click({
			position: { x: 0, y: 40 }
		});

		await expect(cmp.getByTestId('slider-thumb')).toBeFocused();
		await expect(input).toHaveAttribute('value', '60');
	});

	test('Value gets inverted', async ({ mount }) => {
		const cmp = await mount(SliderTest, { props: { inverted: true } });
		const root = cmp.getByTestId('slider-root');
		const input = cmp.locator('input');
		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '60');
	});

	test('Min / max values are respected', async ({ mount }) => {
		const cmp = await mount(SliderTest, { props: { min: 100, max: 200 } });
		const root = cmp.getByTestId('slider-root');
		const input = cmp.locator('input');
		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '140');
	});

	test('Should be disabled when disabled prop is true', async ({ mount }) => {
		const cmp = await mount(SliderTest, { props: { disabled: true } });
		const root = cmp.getByTestId('slider-root');
		const input = cmp.locator('input');

		await expect(root).toHaveAttribute('data-disabled', '');
		await expect(cmp.getByTestId('slider-thumb')).toHaveAttribute('data-disabled', '');

		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '0');
	});

	test('Keyboard interaction', async ({ mount, page }) => {
		const cmp = await mount(SliderTest);
		const thumb = cmp.getByTestId('slider-thumb');
		const input = cmp.locator('input');

		await thumb.focus();
		await page.keyboard.press('ArrowRight');
		await expect(input).toHaveAttribute('value', '1');

		await page.keyboard.press('Shift+ArrowRight');
		await expect(input).toHaveAttribute('value', '11');
	});
});
