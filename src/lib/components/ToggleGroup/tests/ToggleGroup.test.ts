import { expect, test } from '@playwright/experimental-ct-svelte';
import Example from './ToggleGroupTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('ToggleGroup', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(Example);
		expect(await axeViolations(page)).toEqual([]);
	});
});