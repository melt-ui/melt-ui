import type { ChangeFn, IdObj } from '$lib/internal/helpers';
import type { Writable } from 'svelte/store';
import type { TreeIdParts, createTreeView } from './create';
import type { Expand } from '$lib/internal/types';

export type CreateTreeViewProps = {
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

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Expand<IdObj<TreeIdParts>>;
};

export type TreeParts = 'label' | 'item' | 'group';

export type ItemDescription = {
	hasChildren: boolean;
	childrenIdxs: number[];
};

export type TreeView = ReturnType<typeof createTreeView>;
export type TreeViewElements = TreeView['elements'];
export type TreeViewStates = TreeView['states'];
export type TreeViewHelpers = TreeView['helpers'];
