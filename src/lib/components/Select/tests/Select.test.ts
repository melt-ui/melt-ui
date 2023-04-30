import { expect, test } from '@playwright/experimental-ct-svelte';
import Example from './SelectTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Select', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(Example);
		expect(await axeViolations(page)).toEqual([]);
	});
});