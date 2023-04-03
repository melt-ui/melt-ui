import { expect, test } from '@playwright/experimental-ct-svelte';

import CheckboxTest from './CheckboxTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Checkbox', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(CheckboxTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Indicator toggles when clicked', async ({ mount }) => {
		const cmp = await mount(CheckboxTest);

		await expect(cmp).toBeVisible();

		await expect(cmp.getByTestId('checkbox-indicator')).not.toBeVisible();
		await cmp.click();
		await expect(cmp.getByTestId('checkbox-indicator')).toBeVisible();
		await cmp.click();
		await expect(cmp.getByTestId('checkbox-indicator')).not.toBeVisible();
	});

	test('Should be checked when checked prop is true', async ({ mount }) => {
		const cmp = await mount(CheckboxTest, { props: { checked: true } });
		await expect(cmp.getByTestId('checkbox-indicator')).toBeVisible();
	});

	test('data-state attribute should be set', async ({ mount }) => {
		const cmp = await mount(CheckboxTest, { props: { checked: 'indeterminate' } });
		const indicator = cmp.getByTestId('checkbox-indicator');

		await expect(cmp).toHaveAttribute('data-state', 'indeterminate');
		await expect(indicator).toHaveAttribute('data-state', 'indeterminate');

		await cmp.click();
		await expect(cmp).toHaveAttribute('data-state', 'checked');
		await expect(indicator).toHaveAttribute('data-state', 'checked');
		await expect(cmp).toBeChecked();

		await cmp.click();
		await expect(cmp).toHaveAttribute('data-state', 'unchecked');
		await expect(cmp).not.toBeChecked();
	});

	test('Should be disabled when disabled prop is true', async ({ mount }) => {
		const cmp = await mount(CheckboxTest, { props: { disabled: true } });
		await expect(cmp).toHaveAttribute('data-disabled', '');
		await expect(cmp).toHaveAttribute('disabled', '');
	});

	test('Hidden input field value gets updated', async ({ mount }) => {
		const cmp = await mount(CheckboxTest);

		const input = await cmp.locator('input');
		await expect(input).toBeHidden();
		await expect(input).toHaveAttribute('name', 'test-name');
		await expect(input).toHaveAttribute('value', 'test-value');
		await expect(input).toHaveAttribute('required', '');

		await expect(input).not.toBeChecked();

		await cmp.click();

		await expect(input).toBeChecked();
	});
});
