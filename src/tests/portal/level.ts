import { getContext, setContext } from 'svelte';

export const initLevel = () => {
	const level = (getContext('level') || 0) as number;
	setContext('level', level + 1);
	return level;
};
