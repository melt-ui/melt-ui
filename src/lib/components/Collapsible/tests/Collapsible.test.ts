/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, type RenderResult } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import Collapsible from './cmp.svelte';

describe('Collapsible', () => {
	let rendered: RenderResult<any>;

	beforeEach(() => {
		rendered = render(Collapsible as any);
	});

	it('should have no accessibility violations', async () => {
		expect(await axe(rendered.container)).toHaveNoViolations();
	});
});
