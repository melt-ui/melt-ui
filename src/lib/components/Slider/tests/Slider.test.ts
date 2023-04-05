import { expect, test } from '@playwright/experimental-ct-svelte';

import type { Locator } from '@playwright/test';
import SliderTest from './SliderTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Slider', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(SliderTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	let root: Locator;
	let input: Locator;
	let thumb: Locator;
	test.beforeEach(async ({ page }) => {
		root = page.getByTestId('slider-root');
		input = page.locator('input');
		thumb = page.getByTestId('slider-thumb');
	});

	test('Horizontal value updates when clicked', async ({ mount }) => {
		await mount(SliderTest);

		await root.click({
			position: { x: 40, y: 0 }
		});

		await expect(thumb).toBeFocused();
		await expect(input).toHaveAttribute('value', '40');
	});

	test('Vertical value updates when clicked', async ({ mount }) => {
		await mount(SliderTest, { props: { orientation: 'vertical' } });

		await root.click({
			position: { x: 0, y: 40 }
		});

		await expect(thumb).toBeFocused();
		await expect(input).toHaveAttribute('value', '60');
	});

	test('Value gets inverted', async ({ mount }) => {
		await mount(SliderTest, { props: { inverted: true } });

		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '60');
	});

	test('Min / max values are respected', async ({ mount }) => {
		await mount(SliderTest, { props: { min: 100, max: 200 } });

		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '140');
	});

	test('Should be disabled when disabled prop is true', async ({ mount }) => {
		await mount(SliderTest, { props: { disabled: true } });

		await expect(root).toHaveAttribute('data-disabled', '');
		await expect(thumb).toHaveAttribute('data-disabled', '');

		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '0');
	});

	test('Keyboard interaction', async ({ mount, page }) => {
		await mount(SliderTest);

		await thumb.focus();
		await page.keyboard.press('ArrowRight');
		await expect(input).toHaveAttribute('value', '1');

		await page.keyboard.press('Shift+ArrowRight');
		await expect(input).toHaveAttribute('value', '11');
	});

	test('Increased step size', async ({ mount }) => {
		await mount(SliderTest, { props: { step: 25 } });

		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '50');
	});

	test('RTL Direction flips the values', async ({ mount }) => {
		await mount(SliderTest, { props: { dir: 'rtl' } });

		await root.click({
			position: { x: 40, y: 0 }
		});
		await expect(input).toHaveAttribute('value', '60');
	});
});
