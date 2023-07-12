import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	kbd,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { derived, get, writable } from 'svelte/store';
import type { AccordionItemProps, CreateAccordionProps } from './types';

type AccordionParts = 'trigger' | 'item' | 'content';
const { name, selector } = createElHelpers<AccordionParts>('accordion');

const defaults = {
	type: 'single',
	defaultValue: '',
} satisfies Defaults<CreateAccordionProps>;

export const createAccordion = (props: CreateAccordionProps = {}) => {
	const withDefaults = { ...defaults, ...props } as CreateAccordionProps;
	const options = writable({
		disabled: withDefaults.disabled,
		type: withDefaults.type,
	});

	const { value: controlledValue, onValueChange } = withDefaults;

	const value = controlledValue ?? writable(withDefaults.defaultValue);

	const isSelected = (key: string, v: string | string[] | undefined) => {
		if (v === undefined) return false;
		if (typeof v === 'string') return v === key;
		return v.includes(key);
	};

	const isSelectedStore = derived(value, ($value) => {
		return (key: string) => isSelected(key, $value);
	});

	const ids = {
		root: generateId(),
	};

	const root = builder(name(), {
		returned: () => ({
			'data-melt-id': ids.root,
		}),
	});

	const parseItemProps = (props: AccordionItemProps) => {
		if (typeof props === 'string') {
			return { value: props };
		} else {
			return props;
		}
	};

	const item = builder(name('item'), {
		stores: value,
		returned: ($value) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue, disabled } = parseItemProps(props);

				return {
					'data-state': isSelected(itemValue, $value) ? 'open' : 'closed',
					'data-disabled': disabled ? true : undefined,
				};
			};
		},
	});

	const trigger = builder(name('trigger'), {
		stores: [value, options],
		returned: ([$value, $options]) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue, disabled } = parseItemProps(props);

				return {
					'aria-expanded': isSelected(itemValue, $value) ? true : false,
					disabled: $options.disabled || disabled,
					'data-disabled': disabled ? true : undefined,
					'data-value': itemValue,
					// TODO: aria-controls, aria-labelledby
				};
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'click', () => {
					const $options = get(options);
					const disabled = node.dataset.disabled === 'true';
					const itemValue = node.dataset.value;
					if (disabled || !itemValue) return;

					if (onValueChange) {
						const prev = get(value);
						const next = itemValue;
						onValueChange({ prev: get(value), next: itemValue });
					}

					value.update(($value) => {
						if ($options.type === 'single') {
							return $value === itemValue ? undefined : itemValue;
						} else {
							const arrValue = $value as string[] | undefined;
							if (arrValue === undefined) {
								return [itemValue];
							} else {
								return arrValue.includes(itemValue)
									? arrValue.filter((v) => v !== itemValue)
									: [...arrValue, itemValue];
							}
						}
					});
				}),
				addEventListener(node, 'keydown', (e) => {
					if (![kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END].includes(e.key)) {
						return;
					}
					e.preventDefault();

					const el = e.target as HTMLElement;
					const rootEl = getElementByMeltId(ids.root);
					if (!rootEl) return;
					const items = Array.from(rootEl.querySelectorAll(selector('trigger'))) as HTMLElement[];

					if (!items.length) return;
					const elIdx = items.indexOf(el);

					if (e.key === kbd.ARROW_DOWN) {
						items[(elIdx + 1) % items.length].focus();
					}
					if (e.key === kbd.ARROW_UP) {
						items[(elIdx - 1 + items.length) % items.length].focus();
					}
					if (e.key === kbd.HOME) {
						items[0].focus();
					}
					if (e.key === kbd.END) {
						items[items.length - 1].focus();
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const content = builder(name('content'), {
		stores: [value, options],
		returned: ([$value, $options]) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue } = parseItemProps(props);
				const selected = isSelected(itemValue, $value);
				return {
					'data-state': selected ? 'open' : 'closed',
					'data-disabled': $options.disabled ? true : undefined,
					hidden: selected ? undefined : true,
				};
			};
		},
	});

	return {
		root,
		value,
		item,
		trigger,
		content,
		isSelected: isSelectedStore,
		options,
	};
};
