import type { BuilderReturn, Orientation } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createTabs } from './create';
import type { ChangeFn } from '@melt-ui/svelte/internal/helpers';

export type CreateTabsProps = {
	/**
	 * The uncontrolled default value of the tabs.
	 */
	defaultValue?: string;

	/**
	 * The controlled value store for the tabs.
	 * If provided, this will override the value passed to `defaultValue`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	value?: Writable<string>;

	/**
	 * The callback invoked when the value store of the tabs changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<string>;

	/**
	 * The orientation of the tabs.
	 *
	 * @default 'horizontal'
	 */
	orientation?: Orientation;

	/**
	 * Whether or not the tabs should activate when the trigger is focused.
	 *
	 * @default true
	 */
	activateOnFocus?: boolean;

	/**
	 * Whether or not the tabs should loop around when the end is reached.
	 */
	loop?: boolean;

	/**
	 * In case no value is set on initialization, sets the value to the first tab
	 */
	autoSet?: boolean;
};

export type TabsTriggerProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;

export type Tabs = BuilderReturn<typeof createTabs>;
export type TabsElements = Tabs['elements'];
export type TabsOptions = Tabs['options'];
export type TabsStates = Tabs['states'];
