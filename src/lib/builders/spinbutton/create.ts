import {
	addMeltEventListener,
	builder,
	createElHelpers,
	disabledAttr,
	effect,
	executeCallbacks,
	generateId,
	kbd,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers';
import { get, readonly, writable } from 'svelte/store';
import type { SpinbuttonValue, CreateSpinbuttonProps } from './types';
import type { MeltActionReturn } from '$lib/internal/types';
import type { SpinbuttonEvents } from './events';

const defaults = {
	values: [],
	steps: 4,
	disabled: false,
} satisfies CreateSpinbuttonProps;

const { name } = createElHelpers('spinbutton');

export function createSpinButton(props?: CreateSpinbuttonProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSpinbuttonProps;
	const options = toWritableStores(omit(withDefaults, 'value'));

	const { values, steps: step, disabled } = options;

	const valueWritable = writable<SpinbuttonValue>(
		withDefaults.defaultValue ? withDefaults.defaultValue : get(values)[0]
	);
	const spinbuttonValue = overridable<SpinbuttonValue>(valueWritable, withDefaults.onValueChange);

	// const currentValue = derived(spinbuttonValue, ($spinbuttonValue) => {
	//   get(values).indexOf($spinbuttonValue) + 1
	// }) as Readable<SpinbuttonValue>

	const currentIdx = get(values).indexOf(get(spinbuttonValue));
	const currentValue = writable<number>(currentIdx + 1);

	const valueCount = get(values).length;
	const minValue = 1;
	const maxValue = valueCount;

	const ids = {
		label: generateId(),
	};

	effect(currentValue, ($currentValue) => {
		// TODO: check if this is ok to do
		spinbuttonValue.set(get(values)[$currentValue - 1]);
	});

	function handleDecrease(step = 1) {
		if (get(currentValue) === minValue) currentValue.set(maxValue);
		else currentValue.update((value) => value - step);
	}

	function handleIncrease(step = 1) {
		if (get(currentValue) === maxValue) currentValue.set(minValue);
		else currentValue.update((value) => value + step);
	}

	const root = builder(name(''), {
		stores: [disabled],
		returned: ([$disabled]) => {
			return {
				role: 'group',
				'data-disabled': disabledAttr($disabled),
				'aria-labelledby': `spinbutton-label-${ids.label}`,
			};
		},
	});

	const label = builder(name('label'), {
		returned: () => ({
			id: 'spinbutton-label-' + ids.label,
		}),
	});

	// const value = builder(name('value'), {
	// 	returned: () => ({
	// 		tabindex: '0',
	// 	}),
	// });

	const spinbutton = builder(name('spinbutton'), {
		stores: [currentValue, disabled],
		returned: ([$currentValue, $disabled]) => ({
			role: 'spinbutton',
			tabindex: '0',
      disabled: disabledAttr($disabled),
			'data-disabled': disabledAttr($disabled),
			'aria-valuenow': $currentValue,
			'aria-valuemin': minValue,
			'aria-valuemax': maxValue,
			'aria-invalid': $currentValue > maxValue || $currentValue < minValue,
		}),
		action: (node: HTMLElement): MeltActionReturn<SpinbuttonEvents['spinbutton']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					const disabled = node.dataset.disabled !== undefined;
					if (disabled) return;

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
							currentValue.set(minValue);
							break;
						case kbd.END:
							currentValue.set(maxValue);
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
    stores: [disabled],
		returned: ([$disabled]) => ({
			// type: 'button',
			tabindex: '-1',
      disabled: disabledAttr($disabled),
			'data-disabled': disabledAttr($disabled),
		}),
		action: (node: HTMLElement): MeltActionReturn<SpinbuttonEvents['increaseTrigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
          const disabled = node.dataset.disabled !== undefined;
          if (disabled) return;

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
    stores: [disabled],
		returned: ([$disabled]) => ({
			type: 'button',
			tabindex: '-1',
      disabled: disabledAttr($disabled),
			'data-disabled': disabledAttr($disabled),
		}),
		action: (node: HTMLElement): MeltActionReturn<SpinbuttonEvents['increaseTrigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
          const disabled = node.dataset.disabled !== undefined;
          if (disabled) return;

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
			spinbutton,
			increase,
			decrease,
		},
		states: {
			value: readonly(spinbuttonValue),
			values: readonly(values),
			// TODO: return the previousValue & the nextValue
		},
		options,
	};
}
