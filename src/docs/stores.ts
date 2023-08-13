import type { Highlighter } from 'shiki';
import { writable } from 'svelte/store';

export const highlighterStore = writable<Highlighter | null>(null);
