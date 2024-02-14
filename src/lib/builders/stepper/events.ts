import type { GroupedEvents, MeltComponentEvents } from '$lib/internal/types.js';

export const stepperEvents = {
	stepper: ['keydown'],
	incrementer: ['click'],
	decrementer: ['click'],
} as const;

export type StepperEvents = GroupedEvents<typeof stepperEvents>;
export type StepperComponentEvents = MeltComponentEvents<StepperEvents>;
