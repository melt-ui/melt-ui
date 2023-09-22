import { render } from '@testing-library/svelte';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';

import { kbd } from '$lib/internal/helpers/keyboard';
import Spinbutton from './Spinbutton.svelte';

describe('Spinbutton', () => {
	it('should have the required attributes', () => {
		const { getByTestId } = render(Spinbutton);
		const root = getByTestId('spinbutton-root');
		const label = getByTestId('spinbutton-label');

		expect(root).toHaveAttribute('role', 'group');

		// NOTE: the label is referenced by aria-labelledby in the root element
		const labelID = label.getAttribute('id');
		const rootLabelID = root.getAttribute('aria-labelledby');
		expect(rootLabelID).toBe(labelID);

		const spinbutton = getByTestId('spinbutton');
		const decrease = getByTestId('spinbutton-decrease');
		const increase = getByTestId('spinbutton-increase');

		// NOTE: only the spinbutton element is focusable not the buttons
		expect(spinbutton).toHaveAttribute('role', 'spinbutton');
		expect(spinbutton).toHaveAttribute('tabindex', '0');
		expect(increase).toHaveAttribute('tabindex', '-1');
		expect(decrease).toHaveAttribute('tabindex', '-1');
	});

	it('should have a min and a max value', () => {
		const { getByTestId } = render(Spinbutton);
		const spinbutton = getByTestId('spinbutton');

		const min = spinbutton.getAttribute('aria-valuemin');
		const max = spinbutton.getAttribute('aria-valuemax');

		expect(Number(min)).toEqual(1);
		expect(Number(max)).toEqual(12);
	});

	it('should have a default value of January', () => {
		const { getByTestId } = render(Spinbutton);
		const spinbutton = getByTestId('spinbutton');

		expect(spinbutton.textContent).toBe('January');
	});

	it('should allow setting a default value', () => {
		const { getByTestId } = render(Spinbutton, { defaultValue: 'October' });
		const spinbutton = getByTestId('spinbutton');

		expect(spinbutton.textContent).toBe('October');
	});

	it.each([
		// Expected, defaultValue, triggerAttr
		['December', 'January', 'spinbutton-decrease'],
		['January', 'December', 'spinbutton-increase'],
		['February', 'January', 'spinbutton-increase'],
		['February', 'March', 'spinbutton-decrease'],
	])(
		'should have a value of "%s" when the previous value is "%s"',
		async (expected, defaultValue, triggerAttr) => {
			const user = userEvent.setup();

			const { getByTestId } = render(Spinbutton, { defaultValue });
			const spinbutton = getByTestId('spinbutton');
			const button = getByTestId(triggerAttr);

			await user.click(button);

			expect(spinbutton.textContent).toBe(expected);
		}
	);

	it.each([
		// Expected, defaultValue, key
		['December', 'January', kbd.ARROW_DOWN],
		['January', 'December', kbd.ARROW_UP],
		['March', 'April', kbd.ARROW_DOWN],
		['May', 'April', kbd.ARROW_UP],
		['February', 'April', kbd.PAGE_DOWN],
		['June', 'April', kbd.PAGE_UP],
		['November', 'January', kbd.PAGE_DOWN],
		['February', 'December', kbd.PAGE_UP],
		['January', 'April', kbd.HOME],
		['December', 'April', kbd.END],
	])(
		'should have a value of "%s" if the previous value is "%s" when using the "%s" key',
		async (expected, defaultValue, key) => {
			const user = userEvent.setup();

			const { getByTestId } = render(Spinbutton, { steps: 2, defaultValue });
			const spinbutton = getByTestId('spinbutton');

			spinbutton.focus();

			// NOTE: Update the value
			await user.keyboard(`{${key}}`);
			expect(spinbutton.textContent).toBe(expected);
		}
	);

	it('should not allow modifications when using the buttons while disabled', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(Spinbutton, { disabled: true });
		const spinbutton = getByTestId('spinbutton');
		const increase = getByTestId('spinbutton-increase');

		await user.click(increase);
		expect(spinbutton.textContent).toBe('January');
	});

	it('should not update the currentValue when using the keyboard while disabled', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(Spinbutton, { steps: 2, disabled: true });
		const spinbutton = getByTestId('spinbutton');

		spinbutton.focus();

		// NOTE: Update the value
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(spinbutton.textContent).toBe('January');

		// NOTE: Update the value by a large step
		await user.keyboard(`{${kbd.PAGE_UP}}`);
		expect(spinbutton.textContent).toBe('January');

		// NOTE: Update to the max and min values
		await user.keyboard(`{${kbd.HOME}}`);
		expect(spinbutton.textContent).toBe('January');
	});
});
