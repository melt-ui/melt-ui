import { withGet } from '$lib/internal/helpers/withGet.js';
import type { Highlighter } from 'shikiji';

export const highlighterStore = withGet.writable<Highlighter | null>(null);
