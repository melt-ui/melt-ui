/**
 * A utility function that converts a style object to a string.
 *
 * @param style - The style object to convert
 * @returns The style object as a string
 */
export function styleToString(style: StyleObject): string {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return str + `${key}:${style[key]};`;
	}, '');
}

export type StyleObject = Record<string, number | string | undefined>;
