import type { BuilderElements, BuilderReturn } from '$lib/internal/types';
import type { createLabel } from './create';

export type Label = BuilderReturn<typeof createLabel>;
export type LabelElements = BuilderElements<Label>;
