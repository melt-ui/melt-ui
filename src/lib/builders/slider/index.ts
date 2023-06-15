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
import { derived, get, writable, type Readable } from 'svelte/store';

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
		return { disabled: $options.disabled, 'data-orientation': $options.orientation };
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

	const getAllThumbs = derived(root, ($root) => {
		return () => {
			const rootEl = getElementByMeltId($root['data-melt-id']) as HTMLElement;
			if (!rootEl) return;

			return Array.from(rootEl.querySelectorAll('[data-melt-part="thumb"]')) as Array<HTMLElement>;
		};
	}) as Readable<() => HTMLElement[]>;

	const updatePosition = (val: number, index: number, target: HTMLElement) => {
		value.update((prev) => {
			if (!prev) return [val];

			prev[index] = val;

			if (withDefaults.orientation === 'horizontal') target.style.left = `${val}%`;
			else target.style.top = `${val}%`;

			target.setAttribute('aria-valuenow', val.toString());
			return prev.map(Math.abs);
		});
	};

	const thumb = elementMultiDerived(
		[getAllThumbs, options],
		([$allThumbs, { min: $min, max: $max, disabled: $disabled }], { attach }) => {
			return () => {
				const currentThumb = get(currentThumbIndex);

				if (currentThumb < withDefaults.value.length) {
					currentThumbIndex.update((prev) => prev + 1);
				}

				attach('keydown', (event) => {
					if ($disabled) return;

					const target = event.currentTarget as HTMLElement;
					const thumbs = $allThumbs();

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

					const step = withDefaults.step;
					const $value = get(value);

					switch (event.key) {
						case kbd.HOME: {
							updatePosition($min, index, target);
							break;
						}
						case kbd.END: {
							updatePosition($max, index, target);
							break;
						}
						case kbd.ARROW_LEFT: {
							if ($value[index] > $min && withDefaults.orientation === 'horizontal') {
								const newValue = $value[index] - step;
								updatePosition(newValue, index, target);
							}
							break;
						}
						case kbd.ARROW_RIGHT: {
							if ($value[index] < $max && withDefaults.orientation === 'horizontal') {
								const newValue = $value[index] + step;
								updatePosition(newValue, index, target);
							}
							break;
						}
						case kbd.ARROW_UP: {
							if ($value[index] > $min && withDefaults.orientation === 'vertical') {
								const newValue = $value[index] - step;
								updatePosition(newValue, index, target);
							} else if ($value[index] < $max) {
								const newValue = $value[index] + step;
								updatePosition(newValue, index, target);
							}
							break;
						}
						case kbd.ARROW_DOWN: {
							if ($value[index] < $max && withDefaults.orientation === 'vertical') {
								const newValue = $value[index] + step;
								updatePosition(newValue, index, target);
							} else if ($value[index] > $min) {
								const newValue = $value[index] - step;
								updatePosition(newValue, index, target);
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
					'aria-valuenow': withDefaults.value[currentThumb],
					'data-melt-part': 'thumb',
					style: styleToString({
						position: 'absolute',
						...(withDefaults.orientation === 'horizontal'
							? { left: `${withDefaults.value[currentThumb]}%;`, translate: '-50% 0' }
							: { top: `${withDefaults.value[currentThumb]}%;`, translate: '0 -50%`' }),
					}),
					tabindex: $disabled ? -1 : 0,
				};
			};
		}
	);

	effect(
		[root, getAllThumbs, options],
		([$root, $allThumbs, { min: $min, max: $max, disabled: $disabled }]) => {
			if (!isBrowser || $disabled) return;

			const applyPosition = (
				clientXY: number,
				activeThumbIdx: number,
				activeThumb: HTMLElement,
				leftOrTop: number,
				rightOrBottom: number
			) => {
				const percent = (clientXY - leftOrTop) / (rightOrBottom - leftOrTop);
				const val = Math.round(percent * ($max - $min) + $min);

				if (val < $min || val > $max) return;

				updatePosition(val, activeThumbIdx, activeThumb);
			};

			const getClosestThumb = (e: PointerEvent) => {
				const thumbs = $allThumbs();
				thumbs.forEach((thumb) => thumb.blur());

				const distances = thumbs.map((thumb) => {
					if (withDefaults.orientation === 'horizontal') {
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
				e.preventDefault();

				const sliderEl = getElementByMeltId($root['data-melt-id']) as HTMLElement;
				const closestThumb = getClosestThumb(e);
				if (!closestThumb || !sliderEl) return;

				if (!sliderEl.contains(e.target as HTMLElement)) return;

				activeThumb.set(closestThumb);
				closestThumb.thumb.focus();
				isActive.set(true);

				if (withDefaults.orientation === 'horizontal') {
					const { left, right } = sliderEl.getBoundingClientRect();
					applyPosition(e.clientX, closestThumb.index, closestThumb.thumb, left, right);
				} else {
					const { top, bottom } = sliderEl.getBoundingClientRect();
					applyPosition(e.clientY, closestThumb.index, closestThumb.thumb, top, bottom);
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

				if (withDefaults.orientation === 'horizontal') {
					const { left, right } = sliderEl.getBoundingClientRect();
					applyPosition(e.clientX, closestThumb.index, closestThumb.thumb, left, right);
				} else {
					const { top, bottom } = sliderEl.getBoundingClientRect();
					applyPosition(e.clientY, closestThumb.index, closestThumb.thumb, top, bottom);
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
		}
	);

	return {
		root,
		slider: root,
		range,
		thumb,
		value,
		options,
	};
};
