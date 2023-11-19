import { render } from '@testing-library/svelte';
import { it, describe } from 'vitest';
import LabelTest from './LabelTest.svelte';
import userEvent from '@testing-library/user-event';

describe('LabelTest', () => {
	it('renders the label with the correct text', () => {
		const { getByText } = render(LabelTest, { props: { inputId: 'test' } });
		expect(getByText('Test')).toBeInTheDocument();
	});

	it('focuses the input when the label is clicked', async () => {
		const { getByTestId } = render(LabelTest);
		const label = getByTestId('label');
		const input = getByTestId('input');
		await userEvent.click(label);
		expect(input).toHaveFocus();
	});
});
