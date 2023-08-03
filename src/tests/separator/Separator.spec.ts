import { render } from '@testing-library/svelte';
import { describe } from 'vitest';
import SeparatorTest from './SeparatorTest.svelte';

describe('Separator', async () => {
	it('should render an horizontal separator', async () => {
		const { getByTestId } = await render(SeparatorTest);
		await expect(getByTestId('horizontal')).toBeVisible();
	});

	it('should render a vertical separator', async () => {
		const { getByTestId } = await render(SeparatorTest, { orientation: 'vertical' });
		await expect(getByTestId('vertical')).toBeVisible();
	});

	it('should have a role of separator', async () => {
		const { getByTestId } = await render(SeparatorTest, { orientation: 'vertical' });
		await expect(getByTestId('vertical')).toHaveAttribute('role', 'separator');
	});

	it('should have a role of none when decorative is true', async () => {
		const { getByTestId } = await render(SeparatorTest);
		await expect(getByTestId('horizontal')).toHaveAttribute('role', 'none');
	});
});
