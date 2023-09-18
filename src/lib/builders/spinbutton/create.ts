import {
	addMeltEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	kbd,
	toWritableStores,
} from '$lib/internal/helpers';
import { get, readonly, writable } from 'svelte/store';
import type { CreateSpinbuttonProps } from './types';
import type { MeltActionReturn } from '$lib/internal/types';
import type { SpinbuttonEvents } from './events';

// TODO: replace this with the correct configs
const defaults = {
	minValue: 0,
	maxValue: 0,
	steps: 4,
} satisfies CreateSpinbuttonProps;

const { name } = createElHelpers('spinbutton');

export function createSpinButton(props?: CreateSpinbuttonProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSpinbuttonProps;
	const options = toWritableStores(withDefaults);

	const { minValue, maxValue, steps: step } = options;

	const currentValue = writable<number>(undefined);
	currentValue.set(get(minValue));

	const ids = {
		label: generateId(),
	};

	function handleDecrease(step = 1) {
		if (get(currentValue) === get(minValue)) currentValue.set(get(maxValue));
		else currentValue.update((value) => value - step);
	}

	function handleIncrease(step = 1) {
		if (get(currentValue) === get(maxValue)) currentValue.set(get(minValue));
		else currentValue.update((value) => value + step);
	}

	const root = builder(name(''), {
		returned: () => {
			return {
				role: 'group',
				'aria-labelledby': `spinbutton-label-${ids.label}`,
			};
		},
	});

	const label = builder(name('label'), {
		returned: () => ({
			id: 'spinbutton-label-' + ids.label,
		}),
	});

	const value = builder(name('value'), {
		returned: () => ({
			tabindex: '0',
		}),
	});

	const spinbutton = builder(name('spinbutton'), {
		stores: [minValue, maxValue, currentValue],
		returned: ([$minValue, $maxValue, $currentValue]) => ({
			role: 'spinbutton',
			tabindex: '0',
			'aria-valuenow': $currentValue,
			'aria-valuemin': $minValue,
			'aria-valuemax': $maxValue,
			'aria-invalid': $currentValue > $maxValue || $currentValue < $minValue,
		}),
		action: (node: HTMLElement): MeltActionReturn<SpinbuttonEvents['spinbutton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					e.preventDefault();

					switch (e.key) {
						case kbd.ARROW_UP:
							handleIncrease();
							break;
						case kbd.ARROW_DOWN:
							handleDecrease();
							break;
						case kbd.PAGE_UP:
							handleIncrease(get(step));
							break;
						case kbd.PAGE_DOWN:
							handleDecrease(get(step));
							break;
						case kbd.HOME:
							currentValue.set(get(minValue));
							break;
						case kbd.END:
							currentValue.set(get(maxValue));
							break;

						default:
							break;
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const increase = builder(name('increase'), {
		returned: () => ({
			type: 'button',
			tabindex: '-1',
		}),
		action: (node: HTMLElement): MeltActionReturn<SpinbuttonEvents['increaseTrigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					e.stopPropagation();
					handleIncrease();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const decrease = builder(name('decrease'), {
		returned: () => ({
			type: 'button',
			tabindex: '-1',
		}),
		action: (node: HTMLElement): MeltActionReturn<SpinbuttonEvents['increaseTrigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					e.stopPropagation();
					handleDecrease();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	return {
		elements: {
			root,
			label,
			value,
			spinbutton,
			increase,
			decrease,
		},
		states: {
			currentValue: readonly(currentValue),
		},
		options,
	};
}
