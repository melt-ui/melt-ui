import { builder, createElHelpers, generateId, toWritableStores } from '$lib/internal/helpers';
import { get, readonly, writable } from 'svelte/store';
import type { CreateSpinbuttonProps } from './types';

// TODO: replace this with the correct configs
const defaults = {
  minValue: 0,
  maxValue: 0,
} satisfies CreateSpinbuttonProps;

const { name } = createElHelpers('spinbutton');

export function createSpinButton(props?: CreateSpinbuttonProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateSpinbuttonProps;
  const options = toWritableStores(withDefaults)

  const {
    minValue,
    maxValue
  } = options

  const currentValue = writable<number>(undefined)
  currentValue.set(get(minValue))

	const ids = {
		label: generateId(),
	};

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
			'aria-valuemax': $maxValue
		}),
	});

  const increase = builder(name('increase'), {
    returned: () => ({
      type: 'button',
      tabindex: '-1'
    })
  })

  const decrease = builder(name('decrease'), {
    returned: () => ({
      type: 'button',
      tabindex: '-1'
    })
  })


	return {
		elements: {
			root,
			label,
			value,
			spinbutton,
      increase,
      decrease
		},
		states: {
      currentValue: readonly(currentValue)
    },
    options
	};
}
