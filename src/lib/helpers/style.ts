// style object to string
export function styleToString(style: Record<string, number | string>): string {
	return Object.keys(style).reduce((str, key) => {
		return str + `${key}:${style[key]};`;
	}, '');
}
