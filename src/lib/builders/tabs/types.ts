import type { createTabs } from './create';

export type CreateTabsArgs = {
	value?: string;
	onChange?: (value: string) => void;
	orientation?: 'horizontal' | 'vertical';
	activateOnFocus?: boolean;
	loop?: boolean;
	/** In case no value is set on initialization, sets the value to the first tab */
	autoSet?: boolean;
};

export type CreateTabsReturn = ReturnType<typeof createTabs>;
