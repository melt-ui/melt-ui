import type { BuilderReturn } from '$lib/internal/types';
import type { createSpinButton } from './create';

export type SpinbuttonValue = number | string;
export type CreateSpinbuttonProps = {
	values: SpinbuttonValue[];
	defaultValue?: SpinbuttonValue;
	steps?: number;
	disabled?: boolean;
};

export type SpinButton = BuilderReturn<typeof createSpinButton>;
export type SpinButtonElements = SpinButton['elements'];
export type SpinButtonStates = SpinButton['states'];
export type SpinButtonOptions = SpinButton['options'];
