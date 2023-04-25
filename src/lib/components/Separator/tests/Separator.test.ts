import { expect, test } from '@playwright/experimental-ct-svelte';

import SeparatorTest from './SeparatorTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Separator', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(SeparatorTest);
		expect(await axeViolations(page)).toEqual([]);
	});
});