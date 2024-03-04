import { render, waitFor, fireEvent } from '@testing-library/svelte';
import { describe, it } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import ScrollAreaTest from './ScrollAreaTest.svelte';
import type { CreateScrollAreaProps } from '$lib/index.js';

function setup(
	props?: CreateScrollAreaProps & {
		height?: string;
		width?: string;
	}
) {
	const user = userEvent.setup();
	const returned = render(ScrollAreaTest, { props });
	const root = returned.getByTestId('root');
	const scrollbarX = returned.getByTestId('scrollbar-x');
	const scrollbarY = returned.getByTestId('scrollbar-y');
	const content = returned.getByTestId('content');
	const thumbX = returned.getByTestId('thumb-x');
	const thumbY = returned.getByTestId('thumb-y');

	return {
		user,
		elements: {
			scrollbarX,
			scrollbarY,
			content,
			thumbX,
			thumbY,
			root,
		},
		...returned,
	};
}

describe('Scroll Area', () => {
	it('Displays the scrollbars when `type` is "always"', async () => {
		const { elements } = setup({
			type: 'always',
		});

		expect(elements.scrollbarX).toBeVisible();
		expect(elements.scrollbarY).toBeVisible();
	});

	it('Displays the x scrollbar when `type` is "auto" and content overflows', async () => {
		const { elements } = setup({
			type: 'always',
			width: '10px',
		});

		expect(elements.scrollbarX).toBeVisible();
	});

	it('Displays the y scrollbar when `type` is "auto" and content overflows', async () => {
		const { elements } = setup({
			type: 'always',
			height: '10px',
		});

		expect(elements.scrollbarY).toBeVisible();
	});

	it("Doesn't display the scrollbars when `type` is 'auto' and content doesn't overflow", async () => {
		const { elements } = setup({
			type: 'auto',
			width: '5000px',
			height: '5000px',
		});

		await waitFor(() => expect(elements.scrollbarX).not.toBeVisible());
		await waitFor(() => expect(elements.scrollbarY).not.toBeVisible());
	});

	// I hate vitest/testing library sometimes.
	it.skip('Displays the scrollbars on hover', async () => {
		const { elements } = setup({
			type: 'hover',
			width: '10px',
			height: '10px',
		});

		await waitFor(() => expect(elements.scrollbarX).not.toBeVisible());
		await waitFor(() => expect(elements.scrollbarY).not.toBeVisible());

		await fireEvent.pointerEnter(elements.root);

		await waitFor(() => expect(elements.scrollbarX).toBeVisible());
		await waitFor(() => expect(elements.scrollbarY).toBeVisible());

		await fireEvent.pointerLeave(elements.root);

		await waitFor(() => expect(elements.scrollbarX).not.toBeVisible());
		await waitFor(() => expect(elements.scrollbarY).not.toBeVisible());
	});
});
