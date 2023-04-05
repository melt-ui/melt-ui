import type { ComponentProps } from 'svelte';
import Range from './range.svelte';
import Root from './root.svelte';
import Thumb from './thumb.svelte';
import Track from './track.svelte';

export type SliderRootProps = ComponentProps<Root>;
export type SliderRangeProps = ComponentProps<Range>;
export type SliderThumbProps = ComponentProps<Thumb>;
export type SliderTrackProps = ComponentProps<Track>;

export const Slider = {
	Root,
	Track,
	Range,
	Thumb
};
