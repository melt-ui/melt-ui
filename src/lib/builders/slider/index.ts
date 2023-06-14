import {
	effect,
	elementDerived,
	elementMultiDerived,
	getElementByMeltId,
	isBrowser,
	kbd,
	uuid,
} from '$lib/internal/helpers';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';

type CreateSliderArgs = {
	value?: number;
	min?: number;
	max?: number;
	step?: number;
};

const defaults = {
	min: 0,
	max: 100,
	step: 1,
} satisfies CreateSliderArgs;

export const createSlider = (args: CreateSliderArgs = defaults) => {
	const withDefaults = { ...defaults, ...args };
	const value = writable(withDefaults.value ?? null);
	const max = writable(withDefaults.max);
	const min = writable(withDefaults.min);
	const isActive = writable(false);

	const root = elementDerived(
		[value, min, max],
		([$value, $min, $max], { attach, addUnsubscriber }) => {
			return {
				value: $value,
				max: $max,
				role: 'meter',
				'aria-valuemin': $min,
				'aria-valuemax': $max,
				'aria-valuenow': $value,
				'data-value': $value,
				'data-min': $min,
				'data-max': $max,
			};
		}
	);

	const range = derived([value, min, max, isActive], ([$value, $min, $max]) => {
		return { style: `position: absolute; left: 0; right: calc(${100 - ($value ?? 0)}%)` };
	});

	const thumb = elementDerived([value, min, max], ([$value, $min, $max]) => {
		return {
			max: $max,
			'aria-valuemin': $min,
			'aria-valuemax': $max,
			'aria-valuenow': $value,
			'data-value': $value,
			'data-min': $min,
			'data-max': $max,
		};
	});

	effect([isActive, root, thumb, min, max], ([$isActive, $root, $thumb, $min, $max]) => {
		if (!isBrowser) return;

		const applyPosition = (clientX: number, left: number, right: number) => {
			const percent = (clientX - left) / (right - left);
			const val = Math.round(percent * ($max - $min) + $min);

			if (val < $min || val > $max) return;

			value.set(val);
		};

		const pointerDown = (e: PointerEvent) => {
			e.preventDefault();
			const sliderEl = getElementByMeltId($root['data-melt-id']) as HTMLElement;
			const thumbEl = getElementByMeltId($thumb['data-melt-id']) as HTMLElement;
			thumbEl?.blur();

			if (!sliderEl?.contains(e.target as HTMLElement)) return;

			thumbEl.focus();

			isActive.update((prev) => {
				const active = !prev;
				if (active) {
					const { left, right } = sliderEl.getBoundingClientRect();
					applyPosition(e.clientX, left, right);
				}

				return active;
			});
		};

		const pointerUp = () => {
			isActive.set(false);
		};

		const pointerMove = (event: PointerEvent) => {
			if (!$isActive) return;

			const { clientX } = event;

			const sliderEl = getElementByMeltId($root['data-melt-id']) as HTMLElement;
			const { left, right } = sliderEl.getBoundingClientRect();
			applyPosition(clientX, left, right);
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
		value,
		max,
		root,
		slider: root,
		range,
		thumb,
	};
};
