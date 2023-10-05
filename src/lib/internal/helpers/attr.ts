export function disabledAttr(disabled: boolean | undefined) {
	return disabled ? true : undefined;
}

export function ariaDisabledAttr(disabled: boolean | undefined) {
	return disabled ? 'true' : undefined;
}
