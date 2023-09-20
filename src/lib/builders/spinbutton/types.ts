import type { ChangeFn } from '$lib/internal/helpers';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createSpinButton } from './create';

export type SpinbuttonValue = number | string;
export type CreateSpinbuttonProps = {
  values: SpinbuttonValue[];
  defaultValue?: SpinbuttonValue;
  value?: Writable<SpinbuttonValue>;
	steps?: number;
  disabled?: boolean;

  onValueChange?: ChangeFn<SpinbuttonValue>;
  // TODO: add disabled? and readonly? props
  // https://visage.design/components/spin-button
};

export type SpinButton = BuilderReturn<typeof createSpinButton>;
export type SpinButtonElements = SpinButton['elements'];
export type SpinButtonStates = SpinButton['states'];
export type SpinButtonOptions = SpinButton['options'];
