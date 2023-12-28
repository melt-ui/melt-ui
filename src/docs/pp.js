/**
 * @typedef {Object} Builder
 * @property {string} builder - The builder of the melt attribute.
 *
 * @typedef {Object} Args
 * @property {string} args - The arguments of the melt attribute.
 *
 * @typedef {Object} Index
 * @property {string} index - The index of the melt attribute in the string.
 *
 * @typedef {Builder | Builder & Args | Builder & Index} MeltAttribute
 */

/**
 * Extracts the builder and arguments from a melt attribute in a string.
 *
 * @param {string} input - The string containing the melt attribute.
 * @returns {MeltAttribute | null} - The builder and arguments of the melt attribute, or null if no melt attribute is found.
 */
export function extractMeltAttribute(input) {
	const meltStart = input.indexOf('use:melt={');
	if (meltStart === -1) return null;

	const substring = input.slice(meltStart + 10);
	let balance = 1;
	let index = 0;

	while (balance !== 0 && index < substring.length) {
		if (substring[index] === '{') balance++;
		else if (substring[index] === '}') balance--;
		index++;
	}

	if (balance !== 0) return null;

	const meltContent = substring.slice(0, index - 1);
	const argStart = meltContent.indexOf('(');
	const argEnd = meltContent.lastIndexOf(')');

	// If there are arguments
	if (argStart !== -1 && argEnd !== -1) {
		const builder = meltContent.slice(0, argStart);
		const args = meltContent.slice(argStart + 1, argEnd);
		return { builder, args };
	}

	const indexStart = meltContent.indexOf('[');
	const indexEnd = meltContent.lastIndexOf(']');

	// If there is an index
	if (indexStart !== -1 && indexEnd !== -1) {
		const builder = meltContent.slice(0, indexStart);
		const index = meltContent.slice(indexStart + 1, indexEnd);
		return { builder, index };
	}

	return { builder: meltContent };
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

	let tries = 0;
	while (meltAttribute !== null && tries < 100000) {
		tries++;
		const { builder } = meltAttribute;
		const store = builder.startsWith('$') ? builder.slice(1) : builder;

		let /** @type {string} */ oldMelt, /** @type {string} */ newMelt;
		if ('args' in meltAttribute) {
			const { args } = meltAttribute;
			oldMelt = `use:melt={${builder}(${args})}`;
			newMelt = `{...${builder}(${args})} use:${store}`;
		} else if ('index' in meltAttribute) {
			const { index } = meltAttribute;
			oldMelt = `use:melt={${builder}[${index}]}`;
			newMelt = `{...${builder}[${index}]} use:${store}`;
		} else if (builder.startsWith('$')) {
			oldMelt = `use:melt={${builder}}`;
			newMelt = `{...${builder}} use:${store}`;
		} else {
			oldMelt = `use:melt={${builder}}`;
			newMelt = `{...${builder}} use:${builder}.action`;
		}

		output = output.replace(oldMelt, newMelt);
		meltAttribute = extractMeltAttribute(output);
	}
	if (tries >= 100000) throw new Error('Too many tries');

	return output;
}
