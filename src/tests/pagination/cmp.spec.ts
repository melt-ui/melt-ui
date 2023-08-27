import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import cmp from './cmp.svelte';
import { isHTMLElement } from '$lib/internal/helpers/index.js';

function getValue(el: HTMLElement) {
	return el.querySelector('[data-selected]')?.getAttribute('data-value');
}

function getPageButton(el: HTMLElement, page: number) {
	const btn = el.querySelector(`[data-value="${page}"]`);
	if (!isHTMLElement(btn)) {
		throw new Error(`Page button ${page} not found`);
	}
	return btn;
}

describe('Pagination', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(cmp);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Next and prev buttons should work accordingly', async () => {
		const { getByTestId } = await render(cmp);

		const prev = getByTestId('prev');
		const next = getByTestId('next');
		const root = getByTestId('root');

		await expect(getValue(root)).toBe('1');
		await prev.click();
		await expect(getValue(root)).toBe('1');
		await next.click();
		await expect(getValue(root)).toBe('2');
		await next.click();
		await expect(getValue(root)).toBe('3');
		await prev.click();
		await expect(getValue(root)).toBe('2');
	});

	test('Should change page to clicked button', async () => {
		const { getByTestId } = await render(cmp);

		const root = getByTestId('root');
		const page2 = getPageButton(root, 2);

		await expect(getValue(root)).toBe('1');
		await page2.click();
		await expect(getValue(root)).toBe('2');

		const page10 = getPageButton(root, 10);
		await page10.click();
		await expect(getValue(root)).toBe('10');
	});
});
