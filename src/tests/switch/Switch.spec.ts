import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, test } from 'vitest';
import Switch from './Switch.svelte';

describe('Switch', () => {
	test('No accessibility violations', async () => {
		const { container } = render(Switch);

		expect(await axe(container)).toHaveNoViolations();
	});
});
