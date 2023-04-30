import { expect, test } from '@playwright/experimental-ct-svelte';
import Example from './RadioGroupTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('RadioGroup', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(Example);
		expect(await axeViolations(page)).toEqual([]);
	});
});
