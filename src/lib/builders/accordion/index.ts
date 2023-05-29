import { uuid } from '$lib/internal/helpers';
import { elementDerived } from '$lib/internal/stores';
import { derived, writable } from 'svelte/store';

type BaseAccordionArgs = {
	disabled?: boolean;
	onChange?: (value: string | string[] | undefined) => void;
};

type SingleAccordionArgs = {
	value?: string;
	type?: 'single';
};

type MultipleAccordionArgs = {
	value?: string[];
	type: 'multiple';
};

type CreateAccordionArgs = BaseAccordionArgs & (SingleAccordionArgs | MultipleAccordionArgs);

const defaults = {
	type: 'single',
} satisfies CreateAccordionArgs;

export const createAccordion = (args?: CreateAccordionArgs) => {
	const options = { ...defaults, ...args } as CreateAccordionArgs;

	const value = writable<string | string[] | undefined>(options.value);
	value.subscribe((value) => {
		options.onChange?.(value);
	});

	const isSelected = (key: string, v: string | string[] | undefined) => {
		if (v === undefined) return false;
		if (typeof v === 'string') return v === key;
		return v.includes(key);
	};

	const isSelectedStore = derived(value, ($value) => {
		return (key: string) => isSelected(key, $value);
	});

	type ItemArgs =
		| {
				value: string;
				disabled?: boolean;
		  }
		| string;

	const parseItemArgs = (args: ItemArgs) => {
		if (typeof args === 'string') {
			return { value: args };
		} else {
			return args;
		}
	};

	const item = derived(value, ($value) => {
		return (args: ItemArgs) => {
			const { value: itemValue, disabled } = parseItemArgs(args);

			return {
				'data-state': isSelected(itemValue, $value) ? 'open' : 'closed',
				'data-disabled': disabled ? 'true' : undefined,
			};
		};
	});

	const trigger = elementDerived(value, ($value, attach) => {
		return (args: ItemArgs) => {
			const { value: itemValue } = parseItemArgs(args);
			const id = uuid();
			attach(id, 'click', () => {
				if (options.type === 'single') {
					value.set($value === itemValue ? undefined : itemValue);
				} else {
					const arrValue = $value as string[] | undefined;
					if (arrValue === undefined) {
						value.set([itemValue]);
					} else {
						value.set(
							arrValue.includes(itemValue)
								? arrValue.filter((v) => v !== itemValue)
								: [...arrValue, itemValue]
						);
					}
				}
			});

			return {
				'data-radix-id': id,
			};
		};
	});

	const content = derived(value, ($value) => {
		return (args: ItemArgs) => {
			const { value: itemValue } = parseItemArgs(args);
			const selected = isSelected(itemValue, $value);
			return {
				'data-state': selected ? 'open' : 'closed',
				'data-disabled': options.disabled ? 'true' : undefined,
				hidden: selected ? undefined : true,
			};
		};
	});

	return {
		value,
		item,
		trigger,
		content,
		isSelected: isSelectedStore,
	};
};
