import { render } from '@testing-library/svelte';
import LabelTest from './LabelTest.svelte';

describe('LabelTest', () => {
	it('renders the label with the correct text', () => {
		const { getByText } = render(LabelTest, { props: { isRequired: false, inputId: 'test' } });
		expect(getByText('Test')).toBeInTheDocument();
	});
});
