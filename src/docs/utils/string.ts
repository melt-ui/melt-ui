export function formatStr(s: string) {
	// Capitalize and remove dashes
	return s
		.split('-')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

export function toKebabCase(str: string) {
	return str.split(' ').join('-').toLowerCase();
}
