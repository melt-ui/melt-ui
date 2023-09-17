import type { BuilderReturn } from "$lib/internal/types";
import type { createSpinButton } from "./create";

export type CreateSpinbuttonProps = {
  minValue: number;
  maxValue: number;

	placeholder?: string;
	disabled?: boolean;
	editable?: boolean;
}

export type SpinButton = BuilderReturn<typeof createSpinButton>;
export type SpinButtonElements = SpinButton['elements'];
export type SpinButtonStates = SpinButton['states'];
export type SpinButtonOptions = SpinButton['options'];
// export type SpinButtonHelpers = SpinButton['helpers'];
