import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createTabs } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
export type { TabsComponentEvents } from './events.js';

export type CreateTabsProps = {
	/**
	 * The uncontrolled default value of the tabs.
	 */
	defaultValue?: string | undefined;

	/**
	 * The controlled value store for the tabs.
	 * If provided, this will override the value passed to `defaultValue`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	value?: Writable<string> | undefined;

	/**
	 * The callback invoked when the value store of the tabs changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<string> | undefined;

	/**
	 * The orientation of the tabs.
	 *
	 * @default 'horizontal'
	 */
	orientation?: Orientation | undefined;

	/**
	 * Whether or not the tabs should activate when the trigger is focused.
	 *
	 * @default true
	 */
	activateOnFocus?: boolean | undefined;

	/**
	 * Whether or not the tabs should loop around when the end is reached.
	 */
	loop?: boolean | undefined;

	/**
	 * In case no value is set on initialization, sets the value to the first tab
	 */
	autoSet?: boolean | undefined;
};

export type TabsTriggerProps =
	| {
			value: string;
			disabled?: boolean | undefined;
	  }
	| string;

export type Tabs = BuilderReturn<typeof createTabs>;
export type TabsElements = Tabs['elements'];
export type TabsOptions = Tabs['options'];
export type TabsStates = Tabs['states'];
