import type {
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createTabs } from './create';

export type CreateTabsProps = {
	value?: string;
	onChange?: (value: string) => void;
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean;
	loop?: boolean;
	/** In case no value is set on initialization, sets the value to the first tab */
	autoSet?: boolean;
};

export type TabsTriggerProps =
	| {
			value: string;
			disabled?: boolean;
	  }
	| string;

export type Tabs = BuilderReturn<typeof createTabs>;
export type TabsElements = BuilderElements<Tabs>;
export type TabsOptions = BuilderOptions<Tabs>;
export type TabsStates = BuilderStates<Tabs>;
