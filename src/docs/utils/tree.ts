export type Tree = {
	[key: string]: Tree | string;
};

type ConstructTreeArgs<T> = {
	paths: Record<string, T>;
	basePath: string;
};

export function constructTree<T>({ paths, basePath }: ConstructTreeArgs<T>): Tree {
	const tree: Tree = {};

	for (const path in paths) {
		const cleanPath = path.replace(basePath, '').replace('/+page.svelte', '');
		const segments = cleanPath.split('/');

		let currentLevel = tree;
		for (const segment of segments.slice(0, -1)) {
			if (!(segment in currentLevel)) {
				currentLevel[segment] = {} as Tree;
			}
			currentLevel = currentLevel[segment] as Tree;
		}

		const lastSegment = segments[segments.length - 1];
		currentLevel[lastSegment] = `/${cleanPath}`;
	}

	return tree;
}

export function getFromTree(path: string, tree: Tree) {
	const segments = path.split('/');

	let currentLevel = tree;
	for (const segment of segments) {
		if (!(segment in currentLevel)) {
			return null;
		}
		currentLevel = currentLevel[segment] as Tree;
	}

	return currentLevel;
}

type IsInTreeArgs = {
	path: string;
	tree: Tree;
};

export function isInTree({ path, tree }: IsInTreeArgs) {
	const segments = path.split('/');

	let currentLevel = tree;
	for (const segment of segments) {
		if (!(segment in currentLevel)) {
			return false;
		}
		currentLevel = currentLevel[segment] as Tree;
	}

	return true;
}
