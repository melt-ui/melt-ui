import { test, expect } from 'vitest';
import { extractMeltAttribute, processMeltAttributes } from './pp.js';

const extractMeltAttributeCases = [
	{
		input: 'use:melt={$trigger(id)}',
		expected: { builder: '$trigger', args: 'id' },
	},
	{
		input: 'use:melt={$trigger}',
		expected: { builder: '$trigger' },
	},
	{
		input: "use:melt={$trigger({helpme: 'god'} )}",
		expected: { builder: '$trigger', args: "{helpme: 'god'} " },
	},
	{
		input: "use:melt={$trigger({helpme: 'god'} )} awesome={coolio}",
		expected: { builder: '$trigger', args: "{helpme: 'god'} " },
	},
	{
		input: 'use:melt={$thumbs[0]}',
		expected: { builder: '$thumbs', index: '0' },
	},
	{
		input: 'use:melt={thumb}',
		expected: { builder: 'thumb' },
	},
];

extractMeltAttributeCases.forEach(({ input, expected }) => {
	test(`extractMeltAttribute - ${input}`, () => {
		expect(extractMeltAttribute(input)).toEqual(expected);
	});
});

const processMeltAttributesCases = [
	{
		input: 'use:melt={$trigger(id)} awesome={coolio}',
		expected: '{...$trigger(id)} use:trigger awesome={coolio}',
	},
	{ input: 'use:melt={$trigger}', expected: '{...$trigger} use:trigger' },
	{
		input: "use:melt={$trigger({helpme: 'god'} )}",
		expected: "{...$trigger({helpme: 'god'} )} use:trigger",
	},
	{
		input: "use:melt={$trigger({helpme: 'god'} )} awesome={coolio}",
		expected: "{...$trigger({helpme: 'god'} )} use:trigger awesome={coolio}",
	},
	{
		input: 'use:melt={$thumbs[0]}',
		expected: '{...$thumbs[0]} use:thumbs',
	},
	{
		input: 'use:melt={thumb}',
		expected: '{...thumb} use:thumb.action',
	},
];

processMeltAttributesCases.forEach(({ input, expected }) => {
	test(`processMeltAttributes - ${input}`, () => {
		expect(processMeltAttributes(input)).toEqual(expected);
	});
});
