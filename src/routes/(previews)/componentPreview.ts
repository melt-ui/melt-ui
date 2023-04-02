import type { SvelteComponent } from "svelte";

type RadixComponent = Record<string, typeof SvelteComponent>;

export type ComponentPreview<T extends RadixComponent> = {
  title: string;
  description: string;


  example: typeof SvelteComponent;
  props: {
    // I'd want this to be strongly typed using ComponentProps
    [K in keyof T]: Record<string, { type: 'boolean' }>
  }
}

