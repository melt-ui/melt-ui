/**
 * Context for registering child components
 */
import { get, writable, type Writable } from 'svelte/store';
import { uniqueContext } from './uniqueContext';
import type { SvelteHTMLActionType } from './useActions';

export function componentCollectionContext() {
	const initialContext = uniqueContext<Writable<Array<HTMLElement>>>();

	const createContext = () => {
		const store = writable<HTMLElement[]>([]);
		initialContext.setContext(store);
		return store;
	};

	return { ...initialContext, createContext };
}

export const useComponentCollection: SvelteHTMLActionType<{
	collection: Writable<HTMLElement[]>;
	onIndexChange?: (index: number) => void;
}> = (node, args) => {
	if (!args) throw new Error('No args provided');
	const { collection: store } = args;
	store.set([...get(store), node]);

	const unsubscribe = store.subscribe((nodes) => {
		if (args.onIndexChange) {
			args.onIndexChange(nodes.indexOf(node));
		}
	});

	return {
		destroy: () => {
			unsubscribe();
			store.set([...get(store).filter((n) => n !== node)]);
		}
	};
};
