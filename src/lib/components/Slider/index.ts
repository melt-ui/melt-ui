import Range from './range.svelte';
import Root from './root.svelte';
import Thumb from './thumb.svelte';
import Track from './track.svelte';

export type { SliderRootProps } from './root.svelte';
export type { SliderRangeProps } from './range.svelte';
export type { SliderThumbProps } from './thumb.svelte';
export type { SliderTrackProps } from './track.svelte';
export const Slider = {
	Root,
	Track,
	Range,
	Thumb
};
