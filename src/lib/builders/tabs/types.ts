import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { createTabs } from './create.js';
export type { TabsComponentEvents } from './events.js';

export type CreateTabsProps = {
	/**
	 * The uncontrolled default value of the tabs.
	 *
	 * @default undefined
	 */
	value?: ReadableProp<string>;

	/**
	 * The orientation of the tabs.
	 *
	 * @default 'horizontal'
	 */
	orientation?: ReadableProp<Orientation>;

	/**
	 * Whether or not the tabs should activate when the trigger is focused.
	 *
	 * @default true
	 */
	activateOnFocus?: ReadableProp<boolean>;

	/**
	 * Whether or not the tabs should loop around when the end is reached.
	 */
	loop?: ReadableProp<boolean>;

	/**
	 * In case no value is set on initialization, sets the value to the first tab
	 */
	autoSet?: ReadableProp<boolean>;
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
