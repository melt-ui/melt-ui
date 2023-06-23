import { render } from '@testing-library/svelte';
import LabelTest from './LabelTest.svelte';

describe('LabelTest', () => {
	it('renders the label with the correct text', () => {
		const { getByText } = render(LabelTest, { props: { isRequired: false, inputId: 'test' } });
		expect(getByText('Test')).toBeInTheDocument();
	});

	it('renders the input with the correct ID', () => {
		const { getByLabelText } = render(LabelTest, { props: { isRequired: false, inputId: 'test' } });
		expect(getByLabelText('Test')).toHaveAttribute('id', 'test');
	});

	// it('renders the label with an asterisk when isRequired is true', () => {
	// 	const { getByText } = render(LabelTest, {
	// 		props: { isRequired: true, inputId: 'test' },
	// 	});
	// 	expect(getByText('*')).toBeInTheDocument();
	// });
});
