import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { focus, getTabbableNodes } from '../dom.js';
import Dom from './DomTest.svelte';

describe('focus', () => {
	it('focuses the given HTMLElement', () => {
		const { getByPlaceholderText } = render(Dom);
		const el = getByPlaceholderText('Name');
		// Assert that the element does not have focus.
		expect(el).not.toHaveFocus();
		// Pass the HTMLElement to the focus function.
		focus(el);
		// Assert that the element now has focus.
		expect(el).toHaveFocus();
	});
	it('finds the element by querySelector and focuses it', () => {
		const { getByPlaceholderText } = render(Dom);
		const el = getByPlaceholderText('Name');
		// Assert that the element does not have focus.
		expect(el).not.toHaveFocus();
		// Pass a querySelector that matches the element.
		focus('#name');
		// Assert that the element now has focus.
		expect(el).toHaveFocus();
	});
});

describe('getTabbableNodes', () => {
	it('returns only tabbable nodes', () => {
		const { getByRole, getByPlaceholderText } = render(Dom);
		// Select the form container and the 2 inputs.
		const [form, nameInput, emailInput] = [
			getByRole('form'),
			getByPlaceholderText('Name'),
			getByPlaceholderText('vanilla@melt-ui.com'),
		];
		const nodes = getTabbableNodes(form);
		// Assert that the <hr /> element isn't returned from getTabbableNodes.
		expect(nodes).toHaveLength(2);
		expect(nodes).toStrictEqual(expect.arrayContaining([nameInput, emailInput]));
	});
});
