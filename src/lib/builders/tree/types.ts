import type { ChangeFn, WithGet } from '$lib/internal/helpers/index.js';
import type { Readable, Writable } from 'svelte/store';
import type { createTreeView } from './create.js';

export type CreateTreeViewProps = {
	/**
	 * If `true`, hidden elements will be visible.
	 *
	 * @default false
	 */
	forceVisible?: boolean;

	/**
	 * Which tree items are expanded by default.
	 *
	 * @default false
	 */
	defaultExpanded?: string[];

	/**
	 * Optionally pass a writable store to control the expanded items of the tree.
	 * If provided, this will override the value of the `defaultTree` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	expanded?: Writable<string[]>;

	/**
	 * A callback called when the value of the `expanded` store should be changed.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onExpandedChange?: ChangeFn<string[]>;
};

export type TreeParts = 'label' | 'item' | 'group';

export type ItemDescription = {
	hasChildren: boolean;
	childrenIdxs: number[];
};

export type TreeView = ReturnType<typeof createTreeView>;
export type TreeViewElements = TreeView['elements'];
export type TreeViewStates = {
	/** A store holding the expanded items of the tree. */
	expanded: WithGet<Writable<string[]>>;
	/** A store holding the currently selected item in the tree. */
	selectedId: WithGet<Writable<string | null>>;
};
export type TreeViewHelpers = {
	/** A helper store that determines if the tree view item with id === `itemId` is expanded. */
	isExpanded: Readable<(itemId: string) => boolean>;
	/** A helper store that determines if the tree view item with id === `itemId` is selected. */
	isSelected: Readable<(itemId: string) => boolean>;
};
