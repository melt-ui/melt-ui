import {
	effect,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	uuid,
} from '$lib/internal/helpers';
import { derived, get, writable } from 'svelte/store';

type CreateSliderArgs = {
	value: number[];
	min?: number;
	max?: number;
	step?: number;
};

const defaults = {
	value: [],
	min: 0,
	max: 100,
	step: 1,
} satisfies CreateSliderArgs;

export const createSlider = (args: CreateSliderArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const value = writable(withDefaults.value);
	const max = writable(withDefaults.max);
	const min = writable(withDefaults.min);

	const isActive = writable(false);
	const currentThumbIndex = writable<number>(0);
	const activeThumb = writable<{ thumb: HTMLElement; index: number } | null>(null);

	const root = {
		'data-melt-id': uuid(),
	};

	const range = derived(value, ($value) => {
		return {
			style: `position: absolute;
			left: ${$value.length > 1 ? Math.min(...$value) ?? 0 : 0}%;
			right: calc(${100 - (Math.max(...$value) ?? 0)}%)`,
		};
	});

	const getAllThumbs = () => {
		const rootEl = getElementByMeltId(root['data-melt-id']) as HTMLElement;
		if (!rootEl) return;

		return Array.from(rootEl.querySelectorAll('[data-melt-part="thumb"]')) as Array<HTMLElement>;
	};

	const updatePosition = (val: number, index: number, target: HTMLElement) => {
		value.update((prev) => {
			if (!prev) return [val];

			prev[index] = val;

			target.style.left = `${val}%`;
			target.setAttribute('aria-valuenow', val.toString());
			return prev.map(Math.abs);
		});
	};

	const thumb = elementMultiDerived([min, max], ([$min, $max], { attach }) => {
		return () => {
			const currentThumb = get(currentThumbIndex);

			if (currentThumb < withDefaults.value.length) {
				currentThumbIndex.update((prev) => prev + 1);
			}

			attach('keydown', (event) => {
				const target = event.currentTarget as HTMLElement;

				const thumbs = getAllThumbs();
				if (!thumbs) return;

				const index = thumbs.indexOf(target);
				currentThumbIndex.set(index);

				if (![kbd.ARROW_LEFT, kbd.ARROW_RIGHT].includes(event.key)) return;

				const step = withDefaults.step;
				const $value = get(value);

				if ($value[index] < $max && kbd.ARROW_RIGHT === event.key) {
					const newValue = $value[index] + step;
					updatePosition(newValue, index, target);
				} else if ($value[index] > $min && kbd.ARROW_LEFT === event.key) {
					const newValue = $value[index] - step;
					updatePosition(newValue, index, target);
					target.style.left = `${newValue}%`;
				}
			});

			return {
				role: 'slider',
				'aria-label': 'Volume',
				'aria-valuemin': $min,
				'aria-valuemax': $max,
				'aria-valuenow': withDefaults.value[currentThumb],
				'data-melt-part': 'thumb',
				style: `position: absolute;  left: ${withDefaults.value[currentThumb]}%; translate: -50% 0`,
				tabindex: 0,
			};
		};
	});

	effect([min, max], ([$min, $max]) => {
		if (!isBrowser) return;

		const applyPosition = (
			clientX: number,
			activeThumbIdx: number,
			activeThumb: HTMLElement,
			left: number,
			right: number
		) => {
			const percent = (clientX - left) / (right - left);
			const val = Math.round(percent * ($max - $min) + $min);

			if (val < $min || val > $max) return;

			updatePosition(val, activeThumbIdx, activeThumb);
		};

		const getClosestThumb = (clientX: number) => {
			const thumbs = getAllThumbs();
			if (!thumbs) return;

			thumbs.forEach((thumb) => thumb.blur());

			const distances = thumbs.map((thumb) => {
				const { left, right } = thumb.getBoundingClientRect();
				return Math.abs(clientX - (left + right) / 2);
			});

			const thumb = thumbs[distances.indexOf(Math.min(...distances))];
			const index = thumbs.indexOf(thumb);

			return { thumb, index };
		};

		const pointerDown = (e: PointerEvent) => {
			e.preventDefault();

			const sliderEl = getElementByMeltId(root['data-melt-id']) as HTMLElement;
			const closestThumb = getClosestThumb(e.clientX);
			if (!closestThumb || !sliderEl) return;

			if (!sliderEl.contains(e.target as HTMLElement)) return;

			activeThumb.set(closestThumb);
			closestThumb.thumb.focus();
			isActive.set(true);

			const { left, right } = sliderEl.getBoundingClientRect();
			applyPosition(e.clientX, closestThumb.index, closestThumb.thumb, left, right);
		};

		const pointerUp = () => {
			isActive.set(false);
		};

		const pointerMove = (event: PointerEvent) => {
			if (!get(isActive)) return;

			const { clientX } = event;

			const sliderEl = getElementByMeltId(root['data-melt-id']) as HTMLElement;
			const closestThumb = get(activeThumb);
			if (!sliderEl || !closestThumb) return;

			closestThumb.thumb.focus();

			const { left, right } = sliderEl.getBoundingClientRect();
			applyPosition(clientX, closestThumb.index, closestThumb.thumb, left, right);
		};

		document.addEventListener('pointerdown', pointerDown);
		document.addEventListener('pointerup', pointerUp);
		document.addEventListener('pointerleave', pointerUp);
		document.addEventListener('pointermove', pointerMove);

		return () => {
			document.removeEventListener('pointerdown', pointerDown);
			document.removeEventListener('pointerup', pointerUp);
			document.removeEventListener('pointerleave', pointerUp);
			document.removeEventListener('pointermove', pointerMove);
		};
	});

	return {
		root,
		slider: root,
		range,
		thumb,
		value,
	};
};
