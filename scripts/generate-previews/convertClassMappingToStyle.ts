import type { ClassMapping } from './types.ts';

export const convertClassMappingToStyle = (mapping: ClassMapping) => {
	let style = '';
	for (const [key, value] of Object.entries(mapping)) {
		style += `
.${key} {
    @apply ${value};
}
`;
	}
	return style;
};
