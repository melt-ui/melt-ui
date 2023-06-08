export async function load() {
	const componentsGlob = await import.meta.glob('./components/**/+page.svelte');

	const components = Object.keys(componentsGlob).map((path) => {
		const name = path.match(/\.\/components\/(.+)\/\+page\.svelte$/)?.[1];
		return {
			name,
			href: `/docs/components/${name}`,
		};
	});

	return {
		components,
	};
}
