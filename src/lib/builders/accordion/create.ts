import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	getElementByMeltId,
	isHTMLElement,
	kbd,
	withMelt,
	omit,
	overridable,
	toWritableStores,
} from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { tick } from 'svelte';
import { derived, writable, type Writable } from 'svelte/store';
import type {
	AccordionHeadingProps,
	AccordionItemProps,
	AccordionType,
	CreateAccordionProps,
} from './types';
import type { ActionReturn } from 'svelte/action';

type AccordionParts = 'trigger' | 'item' | 'content' | 'heading';
const { name, selector } = createElHelpers<AccordionParts>('accordion');

const defaults = {
	type: 'single',
	value: undefined,
	disabled: undefined,
} satisfies Defaults<CreateAccordionProps>;

export const createAccordion = <T extends AccordionType = 'single'>(
	props?: CreateAccordionProps<T>
) => {
	const withDefaults = { ...defaults, ...props };
	const options = toWritableStores(omit(withDefaults, 'value'));
	const { disabled } = options;

	const valueWritable =
		withDefaults.value ?? writable<string | string[] | undefined>(withDefaults.value);
	const value = overridable(valueWritable, withDefaults?.onValueChange);

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

	const parseHeadingProps = (props: AccordionHeadingProps) => {
		if (typeof props === 'number') {
			return { level: props };
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

	type TriggerActionAttributes = {
		'on:m-click'?: (e: CustomEvent<{ cancel: () => void }>) => void;
	};

	const trigger = builder(name('trigger'), {
		stores: [value, disabled],
		returned: ([$value, $disabled]) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue, disabled } = parseItemProps(props);
				// generate the content ID here so that we can grab it in the content
				// builder action to ensure the values match.
				return {
					disabled: $disabled || disabled,
					'aria-expanded': isSelected(itemValue, $value) ? true : false,
					'aria-disabled': disabled ? true : false,
					'data-disabled': disabled ? true : undefined,
					'data-value': itemValue,
				};
			};
		},
		action: (node: HTMLElement): ActionReturn<unknown, TriggerActionAttributes> => {
			const unsub = executeCallbacks(
				addEventListener(
					node,
					'click',
					withMelt(() => {
						const disabled = node.dataset.disabled === 'true';
						const itemValue = node.dataset.value;
						if (disabled || !itemValue) return;

						value.update(($value) => {
							if (Array.isArray($value)) {
								return $value.includes(itemValue)
									? $value.filter((v) => v !== itemValue)
									: [...$value, itemValue];
							}

							if ($value === undefined) {
								return withDefaults.type === 'single' ? itemValue : [itemValue];
							}
							return $value === itemValue ? undefined : itemValue;
						});
					})
				),
				addEventListener(node, 'keydown', (e) => {
					if (![kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END].includes(e.key)) {
						return;
					}
					e.preventDefault();

					const el = e.target;
					if (!isHTMLElement(el)) return;
					const rootEl = getElementByMeltId(ids.root);
					if (!rootEl) return;
					const items = Array.from(rootEl.querySelectorAll<HTMLElement>(selector('trigger')));
					const candidateItems = items.filter((item) => item.dataset.disabled !== 'true');

					if (!candidateItems.length) return;
					const elIdx = candidateItems.indexOf(el);

					if (e.key === kbd.ARROW_DOWN) {
						candidateItems[(elIdx + 1) % candidateItems.length].focus();
					}
					if (e.key === kbd.ARROW_UP) {
						candidateItems[(elIdx - 1 + candidateItems.length) % candidateItems.length].focus();
					}
					if (e.key === kbd.HOME) {
						candidateItems[0].focus();
					}
					if (e.key === kbd.END) {
						candidateItems[candidateItems.length - 1].focus();
					}
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const content = builder(name('content'), {
		stores: [value, disabled],
		returned: ([$value, $disabled]) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue } = parseItemProps(props);
				const selected = isSelected(itemValue, $value);
				return {
					'data-state': selected ? 'open' : 'closed',
					'data-disabled': $disabled ? true : undefined,
					'data-value': itemValue,
					hidden: selected ? undefined : true,
				};
			};
		},
		action: (node: HTMLElement) => {
			tick().then(() => {
				const contentId = generateId();
				const triggerId = generateId();

				const parentTrigger = document.querySelector<HTMLElement>(
					`${selector('trigger')}, [data-value="${node.dataset.value}"]`
				);
				if (!parentTrigger) return;

				node.id = contentId;
				parentTrigger.setAttribute('aria-controls', contentId);
				parentTrigger.id = triggerId;
			});
		},
	});

	const heading = builder(name('heading'), {
		returned: () => {
			return (props: AccordionHeadingProps) => {
				const { level } = parseHeadingProps(props);
				return {
					role: 'heading',
					'aria-level': level,
					'data-heading-level': level,
				};
			};
		},
	});

	return {
		elements: {
			root,
			item,
			trigger,
			content,
			heading,
		},
		states: {
			value: value as Writable<CreateAccordionProps<T>['value']>,
		},
		helpers: {
			isSelected: isSelectedStore,
		},
		options,
	};
};
