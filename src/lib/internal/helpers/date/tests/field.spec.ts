import { render } from '@testing-library/svelte';
import { describe } from 'vitest';
import FieldTest from './FieldTest.svelte';
import { getSegments, getNextSegment, getPrevSegment } from '$lib/internal/helpers/date/index.js';

describe('Field', () => {
	it('should select only the segments we can navigate to', async () => {
		const { getByTestId } = render(FieldTest);
		const field = getByTestId('field');

		const segments = getSegments(field.id);
		expect(segments.length).toBe(8);
	});

	it('should get the next interactive segment', async () => {
		const { getByTestId } = render(FieldTest);
		const field = getByTestId('field');

		const segments = getSegments(field.id);
		const yearSegment = segments.find(
			(segment) => segment.dataset.segment === 'year'
		) as HTMLElement;
		expect(yearSegment).toBeDefined();
		const nextEl = yearSegment.nextElementSibling;
		const nextSegment = getNextSegment(yearSegment, segments);

		expect(nextSegment).not.toBe(nextEl);
		expect(nextSegment?.dataset.segment).toBe('hour');
	});

	it('should get the previous interactive segment', async () => {
		const { getByTestId } = render(FieldTest);
		const field = getByTestId('field');

		const segments = getSegments(field.id);
		const hourSegment = segments.find(
			(segment) => segment.dataset.segment === 'hour'
		) as HTMLElement;
		expect(hourSegment).toBeDefined();
		const prevEl = hourSegment.previousElementSibling;
		const prevSegment = getPrevSegment(hourSegment, segments);

		expect(prevSegment).not.toBe(prevEl);
		expect(prevSegment?.dataset.segment).toBe('year');
	});
});
