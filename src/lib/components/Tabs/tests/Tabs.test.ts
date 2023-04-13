import { expect, test } from '@playwright/experimental-ct-svelte';

import TabsTest from './TabsTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Checkbox', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(TabsTest);
		expect(await axeViolations(page)).toEqual([]);
	});
});
