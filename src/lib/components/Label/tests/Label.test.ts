import { expect, test } from '@playwright/experimental-ct-svelte';

import LabelTest from './LabelTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';
import { inputId, labelDataTestId } from './constants.js';

test.describe('Label', () => {
	test('No accessibility violations', async ({ mount, page }) => {
		await mount(LabelTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Input is focused when label is clicked', async ({ mount, page }) => {
		const cmp = await mount(LabelTest);
		const label = cmp.getByTestId(labelDataTestId);

		await label.click();

		const activeElementId = await page.evaluate(() => document.activeElement?.id);

		expect(activeElementId).toBe(inputId);
	});

	test('Input is focused when label is double-clicked', async ({ mount, page }) => {
		const cmp = await mount(LabelTest);
		const label = cmp.getByTestId(labelDataTestId);

		await label.dblclick();

		const activeElementId = await page.evaluate(() => document.activeElement?.id);

		expect(activeElementId).toBe(inputId);
	});

	/* 	// in firefox, window.getSelection() returns label even when visually it isn't selected but the input is.
	test('Label text is not selected when double clicked', async ({ mount, page }) => {
		const cmp = await mount(LabelTest);
		const label = cmp.getByTestId(labelDataTestId);

		await label.dblclick();

		const selection = await page.evaluate(() => {
			const selection = window.getSelection();

			if (!selection) {
				return undefined;
			}

			return {
				nodeValue: selection.anchorNode?.nodeValue,
				dataTestId: selection.anchorNode?.parentElement?.dataset['testid'],
			};
		});

		expect(selection?.nodeValue).not.toBe(labelText);
		expect(selection?.dataTestId).not.toBe(labelDataTestId);
	}); */
});
