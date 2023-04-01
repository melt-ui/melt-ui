import CollapsibleTest from './CollapsibleTest.svelte';
import { axe } from 'jest-axe';
import { render } from '@testing-library/svelte';

describe('Collapsible', () => {
	it('should have no accessibility violations', async () => {
		const rendered = render(CollapsibleTest);
		expect(await axe(rendered.container)).toHaveNoViolations();
	});
});
