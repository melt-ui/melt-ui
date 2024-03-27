import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	disabledAttr,
	executeCallbacks,
	generateId,
	generateIds,
	getElementByMeltId,
	isHTMLElement,
	kbd,
	omit,
	overridable,
	styleToString,
	toWritableStores,
	type ChangeFn,
} from '$lib/internal/helpers/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import { tick } from 'svelte';
import { derived, writable } from 'svelte/store';
import type { AccordionEvents } from './events.js';
import type { AccordionHeadingProps, AccordionItemProps, CreateAccordionProps } from './types.js';

type AccordionParts = 'trigger' | 'item' | 'content' | 'heading';

const { name, selector } = createElHelpers<AccordionParts>('accordion');

const defaults = {
	multiple: false,
	disabled: false,
	forceVisible: false,
} satisfies CreateAccordionProps;

export const createAccordion = <Multiple extends boolean = false>(
	props?: CreateAccordionProps<Multiple>
) => {
	const withDefaults = { ...defaults, ...props };
	const options = toWritableStores(omit(withDefaults, 'value', 'onValueChange', 'defaultValue'));

	const meltIds = generateIds(['root']);

	const { disabled, forceVisible } = options;

	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);

	const value = overridable<string | string[] | undefined>(
		valueWritable,
		withDefaults?.onValueChange as ChangeFn<string | string[] | undefined>
	);

	const isSelected = (key: string, v: string | string[] | undefined) => {
		if (v === undefined) return false;
		if (typeof v === 'string') return v === key;
		return v.includes(key);
	};

	const isSelectedStore = derived(value, ($value) => {
		return (key: string) => isSelected(key, $value);
	});

	const root = makeElement(name(), {
		returned: () =>
			({
				'data-melt-id': meltIds.root,
			} as const),
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

	const item = makeElement(name('item'), {
		stores: value,
		returned: ($value) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue, disabled } = parseItemProps(props);

				return {
					'data-state': isSelected(itemValue, $value) ? 'open' : 'closed',
					'data-disabled': disabledAttr(disabled),
				} as const;
			};
		},
	});

	const trigger = makeElement(name('trigger'), {
		stores: [value, disabled],
		returned: ([$value, $disabled]) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue, disabled } = parseItemProps(props);
				// generate the content ID here so that we can grab it in the content
				// builder action to ensure the values match.
				return {
					disabled: disabledAttr($disabled || disabled),
					'aria-expanded': isSelected(itemValue, $value) ? true : false,
					'aria-disabled': disabled ? true : false,
					'data-disabled': disabledAttr(disabled),
					'data-value': itemValue,
					'data-state': isSelected(itemValue, $value) ? 'open' : 'closed',
				} as const;
			};
		},
		action: (node: HTMLElement): MeltActionReturn<AccordionEvents['trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					const disabled = node.dataset.disabled === 'true';
					const itemValue = node.dataset.value;
					if (disabled || !itemValue) return;

					handleValueUpdate(itemValue);
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (![kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END].includes(e.key)) {
						return;
					}
					e.preventDefault();

					if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
						const disabled = node.dataset.disabled === 'true';
						const itemValue = node.dataset.value;
						if (disabled || !itemValue) return;
						handleValueUpdate(itemValue);
						return;
					}

					const el = e.target;
					const rootEl = getElementByMeltId(meltIds.root);
					if (!rootEl || !isHTMLElement(el)) return;

					const items = Array.from(rootEl.querySelectorAll(selector('trigger')));
					const candidateItems = items.filter((item): item is HTMLElement => {
						if (!isHTMLElement(item)) return false;
						return item.dataset.disabled !== 'true';
					});

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

	const content = makeElement(name('content'), {
		stores: [value, disabled, forceVisible],
		returned: ([$value, $disabled, $forceVisible]) => {
			return (props: AccordionItemProps) => {
				const { value: itemValue } = parseItemProps(props);
				const isVisible = isSelected(itemValue, $value) || $forceVisible;
				return {
					'data-state': isVisible ? 'open' : 'closed',
					'data-disabled': disabledAttr($disabled),
					'data-value': itemValue,
					hidden: isVisible ? undefined : true,
					style: styleToString({
						display: isVisible ? undefined : 'none',
					}),
				} as const;
			};
		},
		action: (node: HTMLElement) => {
			tick().then(() => {
				const contentId = generateId();
				const triggerId = generateId();

				const parentTrigger = document.querySelector(
					`${selector('trigger')}, [data-value="${node.dataset.value}"]`
				);
				if (!isHTMLElement(parentTrigger)) return;

				node.id = contentId;
				parentTrigger.setAttribute('aria-controls', contentId);
				parentTrigger.id = triggerId;
			});
		},
	});

	const heading = makeElement(name('heading'), {
		returned: () => {
			return (props: AccordionHeadingProps) => {
				const { level } = parseHeadingProps(props);
				return {
					role: 'heading',
					'aria-level': level,
					'data-heading-level': level,
				} as const;
			};
		},
	});

	function handleValueUpdate(itemValue: string) {
		value.update(($value) => {
			if ($value === undefined) {
				return withDefaults.multiple ? [itemValue] : itemValue;
			}

			if (Array.isArray($value)) {
				if ($value.includes(itemValue)) {
					return $value.filter((v) => v !== itemValue);
				}
				$value.push(itemValue);
				return $value;
			}

			return $value === itemValue ? undefined : itemValue;
		});
	}

	return {
		ids: meltIds,
		elements: {
			root,
			item,
			trigger,
			content,
			heading,
		},
		states: {
			value: value as NonNullable<CreateAccordionProps<Multiple>['value']>,
		},
		helpers: {
			isSelected: isSelectedStore,
		},
		options,
	};
};
