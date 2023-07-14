/**
 * @typedef {Object} MeltAttribute
 * @property {string} builder - The builder of the melt attribute.
 * @property {string|null} args - The arguments of the melt attribute.
 */

/**
 * Extracts the builder and arguments from a melt attribute in a string.
 *
 * @param {string} input - The string containing the melt attribute.
 * @returns {MeltAttribute|null} - The builder and arguments of the melt attribute, or null if no melt attribute is found.
 */
export function extractMeltAttribute(input) {
	const meltStart = input.indexOf('melt={');
	if (meltStart === -1) return null;

	const substring = input.slice(meltStart + 6);
	let balance = 1;
	let index = 0;

	while (balance !== 0 && index < substring.length) {
		if (substring[index] === '{') balance++;
		else if (substring[index] === '}') balance--;
		index++;
	}

	if (balance !== 0) return null;

	const meltContent = substring.slice(1, index - 1);
	const argStart = meltContent.indexOf('(');
	const argEnd = meltContent.lastIndexOf(')');

	// If there are no arguments
	if (argStart === -1 || argEnd === -1) {
		return { builder: meltContent, args: null };
	}

	// If there are arguments
	const builder = meltContent.slice(0, argStart);
	const args = meltContent.slice(argStart + 1, argEnd);

	return { builder, args };
}

/**
 * Processes a string containing melt attributes, replacing each melt attribute with a new format.
 *
 * @param {string} input - The string containing the melt attributes.
 * @returns {string} - The processed string.
 */
export function processMeltAttributes(input) {
	let output = input;
	let meltAttribute = extractMeltAttribute(output);

	while (meltAttribute !== null) {
		const oldMelt = `melt={$${
			meltAttribute.args !== null
				? `${meltAttribute.builder}(${meltAttribute.args})`
				: meltAttribute.builder
		}}`;
		const newMelt = `{...$${
			meltAttribute.args !== null
				? `${meltAttribute.builder}(${meltAttribute.args})`
				: meltAttribute.builder
		}} use:${meltAttribute.builder}`;

		output = output.replace(oldMelt, newMelt);
		meltAttribute = extractMeltAttribute(output);
	}

	return output;
}
