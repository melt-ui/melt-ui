import type { BuilderReturn } from '$lib/internal/types.js';
import type { createLabel } from './create.js';
export type { LabelComponentEvents } from './events.js';

export type CreateLabelProps = {
	for?: string;
	id?: string;
};

export type Label = BuilderReturn<typeof createLabel>;
export type LabelElements = Label['elements'];
