import {
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	omit,
	styleToString,
} from '$lib/internal/helpers';
import { derived, get, writable } from 'svelte/store';

type CreateSliderArgs = {
	value: number[];
	min?: number;
	max?: number;
	step?: number;
	orientation?: 'horizontal' | 'vertical';
	disabled?: boolean;
};

const defaults = {
	value: [],
	min: 0,
	max: 100,
	step: 1,
	orientation: 'horizontal',
	disabled: false,
} satisfies CreateSliderArgs;

export const createSlider = (args: CreateSliderArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const options = writable(omit(withDefaults, 'value'));

	const value = writable(withDefaults.value);

	const isActive = writable(false);
	const currentThumbIndex = writable<number>(0);
	const activeThumb = writable<{ thumb: HTMLElement; index: number } | null>(null);

	const root = elementDerived(options, ($options) => {
		return {
			disabled: $options.disabled,
			'data-orientation': $options.orientation,
			style: 'touch-action: none;',
		};
	});

	const range = derived([value, options], ([$value, $options]) => {
		const orientationStyles =
			$options.orientation === 'horizontal'
				? {
						left: `${$value.length > 1 ? Math.min(...$value) ?? 0 : 0}%`,
						right: `calc(${100 - (Math.max(...$value) ?? 0)}%)`,
				  }
				: {
						top: `${$value.length > 1 ? Math.min(...$value) ?? 0 : 0}%`,
						bottom: `calc(${100 - (Math.max(...$value) ?? 0)}%)`,
				  };

		return {
			style: styleToString({
				position: 'absolute',
				...orientationStyles,
			}),
		};
	});

	const updatePosition = (val: number, index: number) => {
		value.update((prev) => {
			if (!prev) return [val];

			const isFirst = index === 0;
			const isLast = index === prev.length - 1;

			if (!isLast && val > prev[index + 1]) {
				prev[index] = prev[index + 1];
			} else if (!isFirst && val < prev[index - 1]) {
				prev[index] = prev[index - 1];
			} else {
				prev[index] = val;
			}

			return prev.map(Math.abs);
		});
	};

	const thumb = elementMultiDerived(
		[value, options],
		([$value, $options], { attach, index, getAllElements }) => {
			return () => {
				const { min: $min, max: $max, disabled: $disabled } = $options;

				const currentThumb = get(currentThumbIndex);

				if (currentThumb < $value.length) {
					currentThumbIndex.update((prev) => prev + 1);
				}

				attach('keydown', (event) => {
					if ($disabled) return;

					const target = event.currentTarget as HTMLElement;
					const thumbs = getAllElements();
					if (!thumbs) return;

					const index = thumbs.indexOf(target);
					currentThumbIndex.set(index);

					if (
						![
							kbd.ARROW_LEFT,
							kbd.ARROW_RIGHT,
							kbd.ARROW_UP,
							kbd.ARROW_DOWN,
							kbd.HOME,
							kbd.END,
						].includes(event.key)
					) {
						return;
					}

					event.preventDefault();

					const step = $options.step;
					const $value = get(value);

					switch (event.key) {
						case kbd.HOME: {
							updatePosition($min, index);
							break;
						}
						case kbd.END: {
							updatePosition($max, index);
							break;
						}
						case kbd.ARROW_LEFT: {
							if ($value[index] > $min && $options.orientation === 'horizontal') {
								const newValue = $value[index] - step;
								updatePosition(newValue, index);
							}
							break;
						}
						case kbd.ARROW_RIGHT: {
							if ($value[index] < $max && $options.orientation === 'horizontal') {
								const newValue = $value[index] + step;
								updatePosition(newValue, index);
							}
							break;
						}
						case kbd.ARROW_UP: {
							if ($value[index] > $min && $options.orientation === 'vertical') {
								const newValue = $value[index] - step;
								updatePosition(newValue, index);
							} else if ($value[index] < $max) {
								const newValue = $value[index] + step;
								updatePosition(newValue, index);
							}
							break;
						}
						case kbd.ARROW_DOWN: {
							if ($value[index] < $max && $options.orientation === 'vertical') {
								const newValue = $value[index] + step;
								updatePosition(newValue, index);
							} else if ($value[index] > $min) {
								const newValue = $value[index] - step;
								updatePosition(newValue, index);
							}
							break;
						}
					}
				});

				return {
					role: 'slider',
					'aria-label': 'Volume',
					'aria-valuemin': $min,
					'aria-valuemax': $max,
					'aria-valuenow': $value[index],
					'data-melt-part': 'thumb',
					style: styleToString({
						position: 'absolute',
						...($options.orientation === 'horizontal'
							? { left: `${$value[index]}%;`, translate: '-50% 0' }
							: { top: `${$value[index]}%;`, translate: '0 -50%`' }),
					}),
					tabindex: $disabled ? -1 : 0,
				};
			};
		}
	);

	const getAllThumbs = () => thumb.getAllElements().filter(Boolean) as HTMLElement[];

	effect([root, options], ([$root, $options]) => {
		const { min: $min, max: $max, disabled: $disabled } = $options;
		if (!isBrowser || $disabled) return;

		const applyPosition = (
			clientXY: number,
			activeThumbIdx: number,
			leftOrTop: number,
			rightOrBottom: number
		) => {
			const percent = (clientXY - leftOrTop) / (rightOrBottom - leftOrTop);
			const val = Math.round(percent * ($max - $min) + $min);

			if (val < $min || val > $max) return;
			const step = $options.step;
			const newValue = Math.round(val / step) * step;

			updatePosition(newValue, activeThumbIdx);
		};

		const getClosestThumb = (e: PointerEvent) => {
			const thumbs = getAllThumbs();
			if (!thumbs) return;
			thumbs.forEach((thumb) => thumb?.blur());

			const distances = thumbs.map((thumb) => {
				if ($options.orientation === 'horizontal') {
					const { left, right } = thumb.getBoundingClientRect();
					return Math.abs(e.clientX - (left + right) / 2);
				} else {
					const { top, bottom } = thumb.getBoundingClientRect();
					return Math.abs(e.clientY - (top + bottom) / 2);
				}
			});

			const thumb = thumbs[distances.indexOf(Math.min(...distances))];
			const index = thumbs.indexOf(thumb);

			return { thumb, index };
		};

		const pointerDown = (e: PointerEvent) => {
			const sliderEl = getElementByMeltId($root['data-melt-id']) as HTMLElement;
			const closestThumb = getClosestThumb(e);
			if (!closestThumb || !sliderEl) return;

			if (!sliderEl.contains(e.target as HTMLElement)) return;
			e.preventDefault();

			activeThumb.set(closestThumb);
			closestThumb.thumb.focus();
			isActive.set(true);

			if ($options.orientation === 'horizontal') {
				const { left, right } = sliderEl.getBoundingClientRect();
				applyPosition(e.clientX, closestThumb.index, left, right);
			} else {
				const { top, bottom } = sliderEl.getBoundingClientRect();
				applyPosition(e.clientY, closestThumb.index, top, bottom);
			}
		};

		const pointerUp = () => {
			isActive.set(false);
		};

		const pointerMove = (e: PointerEvent) => {
			if (!get(isActive)) return;

			const sliderEl = getElementByMeltId($root['data-melt-id']) as HTMLElement;
			const closestThumb = get(activeThumb);
			if (!sliderEl || !closestThumb) return;

			closestThumb.thumb.focus();

			if ($options.orientation === 'horizontal') {
				const { left, right } = sliderEl.getBoundingClientRect();
				applyPosition(e.clientX, closestThumb.index, left, right);
			} else {
				const { top, bottom } = sliderEl.getBoundingClientRect();
				applyPosition(e.clientY, closestThumb.index, top, bottom);
			}
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
		options,
	};
};
