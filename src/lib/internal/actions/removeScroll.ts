import type { Action } from 'svelte/action';

type Params = {
	disable?: boolean;
};

export const removeScroll = ((node, params) => {
	const update = (params: Params) => {
		if (!params.disable) document.body.style.top = `-${window.scrollY}px`;
		document.body.style.position = params.disable ? '' : 'fixed';
		document.body.style.overflowY = params.disable ? '' : 'scroll';
		document.body.style.width = params.disable ? '' : '100%';

		if (params.disable) {
			const top = document.body.style.top.replaceAll(/[^0-9]/g, '') as unknown as number;
			document.body.style.removeProperty('top');
			window.scrollTo(window.scrollX, top);
		}
	};

	update(params);

	return {
		update,
		destroy() {
			update({ disable: true });
		},
	};
}) satisfies Action;
