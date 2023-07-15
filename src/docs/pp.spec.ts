import { test, expect } from 'vitest';
import { extractMeltAttribute, processMeltAttributes } from './pp';

const extractMeltAttributeCases = [
	{ input: 'melt={$trigger(id)}', expected: { builder: 'trigger', args: 'id' } },
	{ input: 'melt={$trigger}', expected: { builder: 'trigger', args: null } },
	{
		input: "melt={$trigger({helpme: 'god'} )}",
		expected: { builder: 'trigger', args: "{helpme: 'god'} " },
	},
	{
		input: "melt={$trigger({helpme: 'god'} )} awesome={coolio}",
		expected: { builder: 'trigger', args: "{helpme: 'god'} " },
	},
];

extractMeltAttributeCases.forEach(({ input, expected }) => {
	test(`extractMeltAttribute - ${input}`, () => {
		expect(extractMeltAttribute(input)).toEqual(expected);
	});
});

const processMeltAttributesCases = [
	{
		input: 'melt={$trigger(id)} awesome={coolio}',
		expected: '{...$trigger(id)} use:trigger awesome={coolio}',
	},
	{ input: 'melt={$trigger}', expected: '{...$trigger} use:trigger' },
	{
		input: "melt={$trigger({helpme: 'god'} )}",
		expected: "{...$trigger({helpme: 'god'} )} use:trigger",
	},
	{
		input: "melt={$trigger({helpme: 'god'} )} awesome={coolio}",
		expected: "{...$trigger({helpme: 'god'} )} use:trigger awesome={coolio}",
	},
];

processMeltAttributesCases.forEach(({ input, expected }) => {
	test(`processMeltAttributes - ${input}`, () => {
		expect(processMeltAttributes(input)).toEqual(expected);
	});
});
