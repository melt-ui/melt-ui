import { expect, test } from '@playwright/experimental-ct-svelte';
import Example from './ToggleTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Toggle', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(Example);
		expect(await axeViolations(page)).toEqual([]);
	});
});
