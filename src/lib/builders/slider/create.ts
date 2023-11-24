import {
	addEventListener,
	addMeltEventListener,
	ariaDisabledAttr,
	builder,
	createElHelpers,
	disabledAttr,
	effect,
	executeCallbacks,
	getElementByMeltId,
	isBrowser,
	isHTMLElement,
	kbd,
	omit,
	overridable,
	snapValueToStep,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { derived, get, writable } from 'svelte/store';
import { generateIds } from '../../internal/helpers/id';
import type { SliderEvents } from './events.js';

import type { CreateSliderProps } from './types.js';

const defaults = {
	defaultValue: [],
	min: 0,
	max: 100,
	step: 1,
	orientation: 'horizontal',
	disabled: false,
} satisfies CreateSliderProps;

const { name } = createElHelpers('slider');

export const createSlider = (props?: CreateSliderProps) => {
	const withDefaults = { ...defaults, ...props } satisfies CreateSliderProps;

	const options = toWritableStores(omit(withDefaults, 'value', 'onValueChange', 'defaultValue'));
	const { min, max, step, orientation, disabled } = options;

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

	const isActive = writable(false);
	const currentThumbIndex = writable<number>(0);
	const activeThumb = writable<{ thumb: HTMLElement; index: number } | null>(null);

	const meltIds = generateIds(['root'] as const);

	// Helpers
	const updatePosition = (val: number, index: number) => {
		value.update((prev) => {
			if (!prev) return [val];
			if (prev[index] === val) return prev;
			const newValue = [...prev];

			const direction = newValue[index] > val ? -1 : +1;
			function swap() {
				newValue[index] = newValue[index + direction];
				newValue[index + direction] = val;
				const thumbs = getAllThumbs();
				if (thumbs) {
					thumbs[index + direction].focus();
					activeThumb.set({ thumb: thumbs[index + direction], index: index + direction });
				}
			}
			if (direction === -1 && val < newValue[index - 1]) {
				swap();
				return newValue;
			} else if (direction === 1 && val > newValue[index + 1]) {
				swap();
				return newValue;
			}
			const $min = get(min);
			const $max = get(max);
			const $step = get(step);
			newValue[index] = snapValueToStep(val, $min, $max, $step);

			return newValue;
		});
	};

	const getAllThumbs = () => {
		const root = getElementByMeltId(meltIds.root);
		if (!root) return null;

		return Array.from(root.querySelectorAll('[data-melt-part="thumb"]')).filter(
			(thumb): thumb is HTMLElement => isHTMLElement(thumb)
		);
	};

	// States
	const position = derived([min, max], ([$min, $max]) => {
		return (val: number) => {
			const pos = ((val - $min) / ($max - $min)) * 100;
			return pos;
		};
	});

	const ticks = derived([min, max, step], ([$min, $max, $step]) => {
		const difference = $max - $min;

		// min = 0, max = 8, step = 3:
		// ----------------------------
		// 0, 3, 6
		// (8 - 0) / 3 = 2.666... = 3 ceiled
		let count = Math.ceil(difference / $step);

		// min = 0, max = 9, step = 3:
		// ---------------------------
		// 0, 3, 6, 9
		// (9 - 0) / 3 = 3
		// We need to add 1 because `difference` is a multiple of `step`.
		if (difference % $step == 0) {
			count++;
		}

		return count;
	});

	// Elements
	const root = builder(name(), {
		stores: [disabled, orientation],
		returned: ([$disabled, $orientation]) => {
			return {
				disabled: disabledAttr($disabled),
				'aria-disabled': ariaDisabledAttr($disabled),
				'data-orientation': $orientation,
				style: $disabled
					? undefined
					: `touch-action: ${$orientation === 'horizontal' ? 'pan-y' : 'pan-x'}`,

				'data-melt-id': meltIds.root,
			};
		},
	});

	const range = builder(name('range'), {
		stores: [value, orientation, position],
		returned: ([$value, $orientation, $position]) => {
			const minimum = $value.length > 1 ? $position(Math.min(...$value) ?? 0) : 0;
			const maximum = 100 - $position(Math.max(...$value) ?? 0);

			const orientationStyles =
				$orientation === 'horizontal'
					? { left: `${minimum}%`, right: `${maximum}%` }
					: { top: `${maximum}%`, bottom: `${minimum}%` };

			return {
				style: styleToString({
					position: 'absolute',
					...orientationStyles,
				}),
			};
		},
	});

	const thumb = builder(name('thumb'), {
		stores: [value, position, min, max, disabled, orientation],
		returned: ([$value, $position, $min, $max, $disabled, $orientation]) => {
			let index = -1;

			return () => {
				index++;

				const currentThumb = get(currentThumbIndex);

				if (currentThumb < $value.length) {
					currentThumbIndex.update((prev) => prev + 1);
				}

				const thumbValue = $value[index];
				const thumbPosition = `${$position(thumbValue)}%`;
				return {
					role: 'slider',
					'aria-valuemin': $min,
					'aria-valuemax': $max,
					'aria-valuenow': thumbValue,
					'data-melt-part': 'thumb',
					'data-value': thumbValue,
					style: styleToString({
						position: 'absolute',
						...($orientation === 'horizontal'
							? { left: thumbPosition, translate: '-50% 0' }
							: { bottom: thumbPosition, translate: '0 50%' }),
					}),
					tabindex: $disabled ? -1 : 0,
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<SliderEvents['thumb']> => {
			const unsub = addMeltEventListener(node, 'keydown', (event) => {
				const $min = get(min);
				const $max = get(max);
				if (get(disabled)) return;

				const target = event.currentTarget;
				if (!isHTMLElement(target)) return;
				const thumbs = getAllThumbs();
				if (!thumbs?.length) return;

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

				const $step = get(step);
				const $value = get(value);
				const $orientation = get(orientation);

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
						if ($orientation !== 'horizontal') break;

						if (event.metaKey) {
							updatePosition($min, index);
						} else if ($value[index] > $min) {
							const newValue = $value[index] - $step;
							updatePosition(newValue, index);
						}
						break;
					}
					case kbd.ARROW_RIGHT: {
						if ($orientation !== 'horizontal') break;

						if (event.metaKey) {
							updatePosition($max, index);
						} else if ($value[index] < $max) {
							const newValue = $value[index] + $step;

							if (newValue <= $max) {
								updatePosition(newValue, index);
							}
						}
						break;
					}
					case kbd.ARROW_UP: {
						if (event.metaKey) {
							updatePosition($max, index);
						} else if ($value[index] > $min && $orientation === 'vertical') {
							const newValue = $value[index] + $step;
							updatePosition(newValue, index);
						} else if ($value[index] < $max) {
							const newValue = $value[index] + $step;
							if (newValue <= $max) {
								updatePosition(newValue, index);
							}
						}
						break;
					}
					case kbd.ARROW_DOWN: {
						if (event.metaKey) {
							updatePosition($min, index);
						} else if ($value[index] < $max && $orientation === 'vertical') {
							const newValue = $value[index] - $step;
							updatePosition(newValue, index);
						} else if ($value[index] > $min) {
							const newValue = $value[index] - $step;
							updatePosition(newValue, index);
						}
						break;
					}
				}
			});

			return {
				destroy: unsub,
			};
		},
	});

	const tick = builder(name('tick'), {
		stores: [ticks, value, min, max, step, orientation],
		returned: ([$ticks, $value, $min, $max, $step, $orientation]) => {
			let index = -1;
			return () => {
				index++;

				const horizontal = $orientation === 'horizontal';
				const style: Record<string, string | number | undefined> = {
					position: 'absolute',
				};

				// The track is divided into sections of ratio `step / (max - min)`
				const positionPercentage = index * ($step / ($max - $min)) * 100;
				style[horizontal ? 'left' : 'bottom'] = `${positionPercentage}%`;

				// Offset each tick by half its size to center it, except for
				// the first tick as it would be rendered outside the slider.
				//
				// As for the last tick, offset it by its full size rather than
				// half also to prevent it from being rendered outside.
				if (index === $ticks - 1) {
					// Left is negative, down is positive.
					style.translate = horizontal ? '-100% 0' : '0 100%';
				} else if (index !== 0) {
					style.translate = horizontal ? '-50% 0' : '0 50%';
				}

				const tickValue = $min + index * $step;
				const bounded =
					$value.length === 1
						? tickValue <= $value[0]
						: $value[0] <= tickValue && tickValue <= $value[$value.length - 1];

				return {
					'data-bounded': bounded ? true : undefined,
					'data-value': tickValue,
					style: styleToString(style),
				};
			};
		},
	});

	// Effects
	effect(
		[root, min, max, disabled, orientation, step],
		([$root, $min, $max, $disabled, $orientation, $step]) => {
			if (!isBrowser || $disabled) return;

			const applyPosition = (
				clientXY: number,
				activeThumbIdx: number,
				leftOrBottom: number,
				rightOrTop: number
			) => {
				const percent = (clientXY - leftOrBottom) / (rightOrTop - leftOrBottom);
				const val = percent * ($max - $min) + $min;

				if (val < $min) {
					updatePosition($min, activeThumbIdx);
				} else if (val > $max) {
					updatePosition($max, activeThumbIdx);
				} else {
					const step = $step;
					const min = $min;

					const currentStep = Math.floor((val - min) / step);
					const midpointOfCurrentStep = min + currentStep * step + step / 2;
					const midpointOfNextStep = min + (currentStep + 1) * step + step / 2;
					const newValue =
						val >= midpointOfCurrentStep && val < midpointOfNextStep
							? (currentStep + 1) * step + min
							: currentStep * step + min;

					if (newValue <= $max) {
						updatePosition(newValue, activeThumbIdx);
					}
				}
			};

			const getClosestThumb = (e: PointerEvent) => {
				const thumbs = getAllThumbs();
				if (!thumbs) return;
				thumbs.forEach((thumb) => thumb.blur());

				const distances = thumbs.map((thumb) => {
					if ($orientation === 'horizontal') {
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

			const pointerMove = (e: PointerEvent) => {
				if (!get(isActive)) return;
				e.preventDefault();
				e.stopPropagation();

				const sliderEl = getElementByMeltId($root['data-melt-id']);
				const closestThumb = get(activeThumb);
				if (!sliderEl || !closestThumb) return;

				closestThumb.thumb.focus();

				if ($orientation === 'horizontal') {
					const { left, right } = sliderEl.getBoundingClientRect();
					applyPosition(e.clientX, closestThumb.index, left, right);
				} else {
					const { top, bottom } = sliderEl.getBoundingClientRect();
					applyPosition(e.clientY, closestThumb.index, bottom, top);
				}
			};

			const pointerDown = (e: PointerEvent) => {
				if (e.button !== 0) return;

				const sliderEl = getElementByMeltId($root['data-melt-id']);
				const closestThumb = getClosestThumb(e);
				if (!closestThumb || !sliderEl) return;

				const target = e.target;
				if (!isHTMLElement(target) || !sliderEl.contains(target)) {
					return;
				}
				e.preventDefault();

				activeThumb.set(closestThumb);
				closestThumb.thumb.focus();
				isActive.set(true);

				pointerMove(e);
			};

			const pointerUp = () => {
				isActive.set(false);
			};

			const unsub = executeCallbacks(
				addEventListener(document, 'pointerdown', pointerDown),
				addEventListener(document, 'pointerup', pointerUp),
				addEventListener(document, 'pointerleave', pointerUp),
				addEventListener(document, 'pointermove', pointerMove)
			);

			return () => {
				unsub();
			};
		}
	);

	effect([step, min, max, value], function fixValue([$step, $min, $max, $value]) {
		const isValidValue = (v: number) => {
			const snappedValue = snapValueToStep(v, $min, $max, $step);
			return snappedValue === v;
		};

		const gcv = (v: number) => {
			return snapValueToStep(v, $min, $max, $step);
		};

		if ($value.some((v) => !isValidValue(v))) {
			value.update((prev) => {
				return prev.map(gcv);
			});
		}
	});

	return {
		elements: {
			root,
			thumb,
			range,
			tick,
		},
		states: {
			value,
			ticks,
		},
		options,
	};
};
