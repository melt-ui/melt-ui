/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test } from '@playwright/experimental-ct-svelte';
import Collapsible from './cmp.svelte';

test('Test Collapsible.svelte', async ({ mount }) => {
	const cmp = await mount(Collapsible as any);

	const trigger = await cmp.getByTestId('trigger');

	await expect(cmp).toBeVisible();

	await expect(cmp.getByTestId('content')).not.toBeVisible();
	await trigger.click();
	await expect(cmp.getByTestId('content')).toBeVisible();
	await trigger.click();
	await expect(cmp.getByTestId('content')).not.toBeVisible();
});
