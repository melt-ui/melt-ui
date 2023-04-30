<script lang="ts" context="module">
	import {
		collectionContext,
		next,
		prev,
		reactiveContext,
		useActions,
	} from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	type Type = 'single' | 'multiple';
	type Orientation = 'horizontal' | 'vertical';
	type Direction = 'ltr' | 'rtl';

	type SingleToggleGroupRootProps = {
		type?: 'single';
		value?: string | null;
	};

	type MultipleToggleGroupRootProps = {
		type: 'multiple';
		value?: string[];
	};

	export type ToggleGroupRootProps = BaseProps<'div'> &
		(SingleToggleGroupRootProps | MultipleToggleGroupRootProps) & {
			disabled?: boolean;
			rovingFocus?: boolean;
			loop?: boolean;
			orientation?: Orientation;
			dir?: Direction;
		};

	const defaults = {
		type: 'single',
		orientation: 'horizontal',
		dir: 'ltr',
		loop: true,
		rovingFocus: true,
		disabled: false,
	} satisfies {
		[key in keyof ToggleGroupRootProps]?: ToggleGroupRootProps[key];
	};

	type ToggleGroupRootContext = {
		readonly type: Type;
		readonly orientation: Orientation;
		readonly dir: Direction;
		readonly loop: boolean;
		readonly rovingFocus: boolean;
		readonly disabled: ToggleGroupRootProps['disabled'];
		value: ToggleGroupRootProps['value'];
	};

	const { getContext, setContext } = reactiveContext<ToggleGroupRootContext>();
	export const getToggleGroupRootContext = getContext;

	const itemCollection = collectionContext();
	export const getToggleGroupItemCollection = itemCollection.getContext;
</script>

<script lang="ts">
	type $$Props = ToggleGroupRootProps;
	export let type: $$Props['type'] = defaults.type;
	export let value: $$Props['value'] = null;
	export let rovingFocus: $$Props['rovingFocus'] = defaults.rovingFocus;
	export let orientation: $$Props['orientation'] = defaults.orientation;
	export let dir: $$Props['dir'] = defaults.dir;
	export let loop: $$Props['loop'] = defaults.loop;
	export let disabled: $$Props['disabled'] = defaults.disabled;

	const ctx = setContext({
		type: [type ?? defaults.type],
		orientation: [orientation ?? defaults.orientation],
		dir: [dir ?? defaults.dir],
		loop: [loop ?? defaults.loop],
		rovingFocus: [rovingFocus ?? defaults.rovingFocus],
		disabled: [false],
		value: [value, (v) => (value = v)],
	});
	$: ctx.set({
		type: type ?? defaults.type,
		orientation: orientation ?? defaults.orientation,
		dir: dir ?? defaults.dir,
		loop: loop ?? defaults.loop,
		rovingFocus: rovingFocus ?? defaults.rovingFocus,
		disabled: disabled ?? defaults.disabled,
		value,
	});

	// Item logic
	const itemStore = itemCollection.createContext();

	$: nextKey = {
		horizontal: dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight',
		vertical: 'ArrowDown',
	}[orientation ?? 'horizontal'];

	$: prevKey = {
		horizontal: dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft',
		vertical: 'ArrowUp',
	}[orientation ?? 'horizontal'];

	const listeners = new Map();
	itemStore.subscribe((items) => {
		const enabledItems = items.filter((i) => !i.dataset.disabled);

		items.forEach((item, index) => {
			const prevCallback = listeners.get(index);
			if (prevCallback) {
				item.removeEventListener('keydown', prevCallback);
			}

			const enabledIdx = enabledItems.indexOf(item);
			const listener = (e: KeyboardEvent) => {
				if (!rovingFocus) return;
				if (e.key === nextKey) {
					e.preventDefault();
					next(enabledItems, enabledIdx, loop)?.focus();
				} else if (e.key === prevKey) {
					e.preventDefault();
					prev(enabledItems, enabledIdx, loop)?.focus();
				}
			};

			listeners.set(index, listener);
			item.addEventListener('keydown', listener);
		});
	});
</script>

<div {dir} {...$$restProps} use:useActions={$$restProps.use} data-orientation={orientation}>
	<slot />
</div>
