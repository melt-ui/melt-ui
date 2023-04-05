import { expect, test } from '@playwright/experimental-ct-svelte';

import SliderTest from './SliderTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Slider', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(SliderTest);
		expect(await axeViolations(page)).toEqual([]);
	});
});
