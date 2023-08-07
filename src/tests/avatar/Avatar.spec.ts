import { render } from '@testing-library/svelte';
import { describe } from 'vitest';
import AvatarTest from './AvatarTest.svelte';

describe('Avatar', () => {
	test('renders the image with the correct src', () => {
		const { getByAltText } = render(AvatarTest, {
			props: { src: 'https://example.com/image.jpg' },
		});
		expect(getByAltText('Avatar')).toHaveAttribute('src', 'https://example.com/image.jpg');
	});

	test('renders the fallback with the correct text', () => {
		const { getByText } = render(AvatarTest, {
			props: { src: '' },
		});
		expect(getByText('RH')).toBeInTheDocument();
	});
});
