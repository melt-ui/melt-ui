import { render } from '@testing-library/svelte';
import SpinButton from './Spinbutton.svelte';

describe('Spinbutton', () => {
	it('should have the required attributes are present on the elements', () => {
		const { getByTestId } = render(SpinButton);
		const root = getByTestId('spinbutton-root');
		const label = getByTestId('spinbutton-label');

		expect(root).toHaveAttribute('role', 'group');

		// NOTE: the label is referenced by aria-labelledby
		const labelID = label.getAttribute('id');
		const rootLabelID = root.getAttribute('aria-labelledby');
		expect(rootLabelID).toBe(labelID);

		const spinbutton = getByTestId('spinbutton');
		const decrease = getByTestId('spinbutton-decrease');
		const increase = getByTestId('spinbutton-increase');

		// NOTE: only the spinbutton is focusable, the buttons are not.
		expect(spinbutton).toHaveAttribute('role', 'spinbutton');
		expect(spinbutton).toHaveAttribute('tabindex', '0');
		expect(increase).toHaveAttribute('tabindex', '-1');
		expect(decrease).toHaveAttribute('tabindex', '-1');
	});

	it('should have a min and a max value defined and the current value is 1', () => {
		const minValue = 1;
		const maxValue = 10;

		const { getByTestId } = render(SpinButton, { minValue, maxValue });
		const spinbutton = getByTestId('spinbutton');

		const min = spinbutton.getAttribute('aria-valuemin');
		const max = spinbutton.getAttribute('aria-valuemax');
		const currentValue = spinbutton.getAttribute('aria-valuenow');

		expect(Number(min)).toEqual(minValue);
		expect(Number(max)).toEqual(maxValue);
		expect(Number(currentValue)).toEqual(minValue);
	});
});
