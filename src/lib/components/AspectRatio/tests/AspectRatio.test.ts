import { expect, test } from '@playwright/experimental-ct-svelte';

import AspectRatioTest from './AspectRatioTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('AspectRatio', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(AspectRatioTest);
		expect(await axeViolations(page)).toEqual([]);
	});
});
