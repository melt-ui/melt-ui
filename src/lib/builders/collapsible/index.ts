import { getElementById, isBrowser, uuid } from '$lib/internal/helpers';
import { derivedWithUnsubscribe } from '$lib/internal/stores';
import { tick } from 'svelte';
import { derived, writable } from 'svelte/store';

type CreateCollapsibleArgs = {
	open?: boolean;
	onChange?: (open: boolean) => void;
	disabled?: boolean;
};

const defaults = {
	open: false,
	disabled: false,
} satisfies CreateCollapsibleArgs;

export function createCollapsible(args?: CreateCollapsibleArgs) {
	const options = { ...defaults, ...args };

	const open = writable(options.open);
	open.subscribe((open) => {
		options.onChange?.(open);
	});

	// Root
	const root = derived(open, ($open) => ({
		'data-state': $open ? 'open' : 'closed',
		'data-disabled': options.disabled ? 'true' : 'undefined',
	}));

	// Trigger
	const trigger = derivedWithUnsubscribe(open, ($open, onUnsubscribe) => {
		const id = uuid();

		if (isBrowser && !options.disabled) {
			const onClick = () => {
				open.set(!$open);
			};

			tick().then(() => {
				const el = getElementById(id);
				console.log('el', el, id);
				el?.addEventListener('click', onClick);
			});

			onUnsubscribe(() => {
				const el = getElementById(id);
				el?.removeEventListener('click', onClick);
			});
		}

		return {
			'data-state': $open ? 'open' : 'closed',
			'data-disabled': options.disabled ? 'true' : undefined,
			'data-radix-id': id,
		};
	});

	// Content
	const content = derived(open, ($open) => ({
		'data-state': $open ? 'open' : 'closed',
		'data-disabled': options.disabled ? 'true' : undefined,
		hidden: $open ? undefined : true,
	}));

	return {
		root,
		trigger,
		content,
		open,
	};
}
