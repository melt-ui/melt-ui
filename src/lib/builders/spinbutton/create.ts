import {
	addMeltEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
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
} satisfies CreateSpinbuttonProps;

const { name } = createElHelpers('spinbutton');

export function createSpinButton(props?: CreateSpinbuttonProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSpinbuttonProps;
	const options = toWritableStores(withDefaults);

	const { minValue, maxValue } = options;

	const currentValue = writable<number>(undefined);
	currentValue.set(get(minValue));

	const ids = {
		label: generateId(),
	};

	function handleDecrease() {
		if (get(currentValue) === get(minValue)) currentValue.set(get(maxValue));
    else currentValue.update((value) => value - 1);
	}

	function handleIncrease() {
		if (get(currentValue) === get(maxValue)) currentValue.set(get(minValue));
    else currentValue.update((value) => value + 1);
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
		}),
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
