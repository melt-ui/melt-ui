import type { ClassMapping } from './types.ts';

export const processHtml = (html: string) => {
	const mapping: ClassMapping = {};
	const regex =
		/<(\w+)([^>]*)\bclass\s*=\s*(['"])(.*?)\3([^>]*)\bdata-class\s*=\s*(['"])(.*?)\6([^>]*)>/g;

	const modifiedHtml = html.replace(
		regex,
		(
			_match,
			tagName,
			beforeClass,
			_classQuote,
			classValue,
			betweenAttrs,
			_dataClassQuote,
			dataClassValue,
			afterDataClass
		) => {
			if ((classValue && !dataClassValue) || (!classValue && dataClassValue)) {
				throw new Error(
					`Class and data-class attributes must be provided together for ${tagName} element.`
				);
			}

			// Mapping data-class attributes to class attributes
			mapping[dataClassValue] = classValue;

			// Replace class attribute with data-class value and remove data-class attribute
			return `<${tagName}${beforeClass} class="${dataClassValue}"${betweenAttrs}${afterDataClass}>`;
		}
	);

	return { mapping, modifiedHtml };
};
