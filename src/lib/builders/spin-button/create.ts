import { disabledAttr } from '$lib/internal/helpers/attr.js';
import { addMeltEventListener } from '$lib/internal/helpers/event.js';
import { kbd } from '$lib/internal/helpers/keyboard.js';
import { createElHelpers, makeElement } from '$lib/internal/helpers/makeElement.js';
import { modulo } from '$lib/internal/helpers/math.js';
import { omit } from '$lib/internal/helpers/object.js';
import { overridable } from '$lib/internal/helpers/overridable.js';
import { effect } from '$lib/internal/helpers/store/effect.js';
import { toWritableStores } from '$lib/internal/helpers/store/toWritableStores.js';
import { withGet } from '$lib/internal/helpers/withGet.js';
import { derived, writable } from 'svelte/store';
import { createHiddenInput } from '../hidden-input/create.js';
import type { CreateSpinButtonProps } from './types.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { SpinButtonEvents } from './events.js';

const defaults = {
	defaultValue: 0,
	min: undefined,
	max: undefined,
	step: 1,
	loop: false,
	disabled: false,
} satisfies CreateSpinButtonProps;

const { name } = createElHelpers('spin-button');

export function createSpinButton(props?: CreateSpinButtonProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSpinButtonProps;

	const value = overridable(
		withDefaults.value ?? writable(withDefaults.defaultValue),
		withDefaults.onValueChange
	);

	const options = toWritableStores(omit(withDefaults, 'value', 'defaultValue', 'onValueChange'));
	const { min, max, step, loop, disabled } = options;

	/**
	 * The previous value of the stepper, or `null` if there is no previous value.
	 *
	 * If `loop` is `true`, stepping before `min` loops back to `max`, instead.
	 */
	const previous = withGet.derived(
		[value, min, max, step, loop],
		([$value, $min, $max, $step, $loop]) => {
			const $previous = $value - $step;
			if ($min === undefined || $previous >= $min) {
				return $previous;
			}
			if ($loop && $max !== undefined) {
				const length = $max - $min + 1;
				const overstep = modulo($min - $previous, length);
				return $max - (overstep - 1);
			}
			return null;
		}
	);

	/**
	 * The next value of the stepper, or `null` if there is no next value.
	 *
	 * If `loop` is `true`, stepping after `max` loops back to `min` instead.
	 */
	const next = withGet.derived(
		[value, min, max, step, loop],
		([$value, $min, $max, $step, $loop]) => {
			const $next = $value + $step;
			if ($max === undefined || $next <= $max) {
				return $next;
			}
			if ($loop && $min !== undefined) {
				const length = $max - $min + 1;
				const overstep = modulo($next - $max, length);
				return $min + (overstep - 1);
			}
			return null;
		}
	);

	/**
	 * Increases the stepper's value by `step`.
	 */
	function increment() {
		const $next = next.get();
		if ($next !== null) {
			value.set($next);
		}
	}

	/**
	 * Decreases the stepper's value by `step`.
	 */
	function decrement() {
		const $previous = previous.get();
		if ($previous !== null) {
			value.set($previous);
		}
	}

	const root = makeElement(name('root'), {
		stores: [value, min, max, disabled],
		returned: ([$value, $min, $max, $disabled]) => {
			return {
				role: 'spinbutton',
				tabindex: 0,
				'aria-valuenow': $value,
				'aria-valuemin': $min,
				'aria-valuemax': $max,
				'aria-disabled': $disabled,
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<SpinButtonEvents['root']> => {
			function handleKeyDown(event: KeyboardEvent) {
				if (disabled.get()) return;

				switch (event.key) {
					case kbd.ARROW_UP: {
						preventDefaultStopPropogation(event);
						increment();
						break;
					}
					case kbd.ARROW_DOWN: {
						preventDefaultStopPropogation(event);
						decrement();
						break;
					}
					case kbd.HOME: {
						const $min = min.get();
						if ($min === undefined) break;
						preventDefaultStopPropogation(event);
						value.set($min);
						break;
					}
					case kbd.END: {
						const $max = max.get();
						if ($max === undefined) break;
						preventDefaultStopPropogation(event);
						value.set($max);
						break;
					}
				}
			}

			const destroy = addMeltEventListener(node, 'keydown', handleKeyDown);
			return {
				destroy,
			};
		},
	});

	const incrementer = makeElement(name('incrementer'), {
		stores: [disabled, next],
		returned: ([$disabled, $next]) => {
			return {
				type: 'button',
				tabindex: -1,
				disabled: disabledAttr($disabled || $next === null),
			} as const;
		},
		action: (node: HTMLElement): MeltActionReturn<SpinButtonEvents['incrementer']> => {
			function handleClick(event: MouseEvent) {
				if (disabled.get()) return;
				preventDefaultStopPropogation(event);
				increment();
			}

			const destroy = addMeltEventListener(node, 'click', handleClick);
			return {
				destroy,
			};
		},
	});

	const decrementer = makeElement(name('decrementer'), {
		stores: [disabled, previous],
		returned: ([$disabled, $previous]) => {
			return {
				type: 'button',
				tabindex: -1,
				disabled: disabledAttr($disabled || $previous === null),
			} as const;
		},
		action: (node: HTMLElement) => {
			function handleClick(event: MouseEvent) {
				if (disabled.get()) return;
				preventDefaultStopPropogation(event);
				decrement();
			}

			const destroy = addMeltEventListener(node, 'click', handleClick);
			return {
				destroy,
			};
		},
	});

	const hiddenInput = createHiddenInput({
		value: derived(value, ($value) => String($value)),
	});

	effect([value, min, max, step], ([$value, $min, $max, $step]) => {
		// Ensure $min <= $value <= $max
		if ($min !== undefined && $value < $min) {
			value.set($min);
		} else if ($max !== undefined && $value > $max) {
			// Find the largest n such that $min + n * step <= $max.
			// In other words, the largest n such that n <= ($max - $min) / step.
			//
			// If there is no minimum, just set the value to the maximum.
			if ($min === undefined) {
				value.set($max);
				return;
			}
			const n = Math.floor(($max - $min) / $step);
			value.set($min + n * $step);
		}
	});

	return {
		elements: {
			root,
			incrementer,
			decrementer,
			hiddenInput,
		},
		states: {
			value,
			previous,
			next,
		},
		options,
		helpers: {
			increment,
			decrement,
		},
	};
}

function preventDefaultStopPropogation(event: Event) {
	event.preventDefault();
	event.stopPropagation();
}
