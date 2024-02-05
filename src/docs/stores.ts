import type { Highlighter } from 'shikiji';
import { writable } from 'svelte/store';

export const highlighterStore = writable<Highlighter | null>(null);
