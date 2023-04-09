import type { Action } from 'svelte/action';

type Params = {
	disable?: boolean;
};

export const removeScroll = ((node, params) => {
	const update = (params: Params) => {
		document.body.style.overflow = params.disable ? 'initial' : 'hidden';
	};

	update(params);

	return {
		update,
		destroy() {
			update({ disable: true });
		},
	};
}) satisfies Action;
