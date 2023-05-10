import { expect, test } from '@playwright/experimental-ct-svelte';
import Example from './AlertDialogTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('AlertDialog', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(Example);
		expect(await axeViolations(page)).toEqual([]);
	});
});
