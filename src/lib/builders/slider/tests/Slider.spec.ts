import { kbd } from '$lib/internal/helpers';
import { act, render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import Slider from './Slider.svelte';
import userEvent from '@testing-library/user-event';

const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

const IS_ENOUGH_CLOSE = 0.0001;

/**
 * Unfortunately sometimes floating point arithmetic still strikes
 * so we need to check that we are close enough rather than precisely
 */
function isCloseEnough(value: number, style: string) {
	const numStyle = parseFloat(style.replace('%', ''));
	return Math.abs(numStyle - value) < IS_ENOUGH_CLOSE;
}

function expectPercentage({
	percentage,
	thumb,
	range,
}: {
	percentage: number;
	thumb: HTMLElement;
	range: HTMLElement;
}) {
	expect(isCloseEnough(percentage, thumb.style.left)).toBeTruthy();
	expect(isCloseEnough(0, range.style.left)).toBeTruthy();
	expect(isCloseEnough(100 - percentage, range.style.right)).toBeTruthy();
}

describe.only('Slider (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(Slider);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Has a thumb positioned at 30% of the container', async () => {
		const { getByTestId } = render(Slider);

		const thumb = getByTestId('thumb');
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(30, thumb.style.left)).toBeTruthy();
	});
	test('Has a range that covers from 0 to 30%', async () => {
		const { getByTestId } = render(Slider);

		const range = getByTestId('range');
		expect(range).toBeInTheDocument();

		expect(isCloseEnough(0, range.style.left)).toBeTruthy();
		expect(isCloseEnough(70, range.style.right)).toBeTruthy();
	});

	test.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])('Change by 1% when pressing %s', async (key) => {
		const { getByTestId } = render(Slider);
		const user = userEvent.setup();

		const thumb = getByTestId('thumb');
		const range = getByTestId('range');

		await act(() => thumb.focus());
		await user.keyboard(`{${key}}`);

		expectPercentage({ percentage: 31, thumb, range });
	});

	test.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])('Change by 1% when pressing %s', async (key) => {
		const { getByTestId } = render(Slider);
		const user = userEvent.setup();

		const thumb = getByTestId('thumb');
		const range = getByTestId('range');

		await act(() => thumb.focus());
		await user.keyboard(`{${key}}`);

		expectPercentage({ percentage: 29, thumb, range });
	});

	test('Goes to minimum when pressing Home', async () => {
		const { getByTestId } = render(Slider);
		const user = userEvent.setup();

		const thumb = getByTestId('thumb');
		const range = getByTestId('range');

		await act(() => thumb.focus());
		await user.keyboard(`{${kbd.HOME}}`);

		expectPercentage({ percentage: 0, thumb, range });
	});

	test('Goes to maximum when pressing End', async () => {
		const { getByTestId } = render(Slider);
		const user = userEvent.setup();

		const thumb = getByTestId('thumb');
		const range = getByTestId('range');

		await act(() => thumb.focus());
		await user.keyboard(`{${kbd.END}}`);

		expectPercentage({ percentage: 100, thumb, range });
	});
});
