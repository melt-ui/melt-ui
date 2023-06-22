// Source Reference: vite-plugin-svelte-purgecss v0.0.3 (2023-06-21)
// Source: https://github.com/AdrianGonz97/vite-plugin-svelte-purgecss
// https://github.com/AdrianGonz97/vite-plugin-svelte-purgecss/blob/main/src/types.ts

// References:
// Svelte: https://github.com/ota-meshi/svelte-eslint-parser/blob/main/docs/AST.md
// ESTree: https://github.com/estree/estree/blob/master/es5.md#identifier

// Selectors
export type ExtractedSelectors = [string, Selector][];
export type Selector = SelectorMarkup | SelectorStyle | SelectorFromIdentifier;

type SelectorMarkup = {
	type: 'Element' | 'Attribute' | 'Class';
};

type SelectorStyle = {
	type: 'PseudoClassSelector';
	name: 'global' | string;
};

type SelectorFromIdentifier = {
	type: 'FromIdentifier';
};

// Attributes
export type NodeClassAttribute = NodeClassAttributeMustacheTag | NodeClassAttributeText;

type NodeClassAttributeMustacheTag = {
	type: 'MustacheTag';
	expression?: {
		type: 'Identifier';
		name: string;
	};
};

type NodeClassAttributeText = {
	type: 'Text';
	data: string;
};

// Identifiers
export type ParentNode = NodeIdentifierLiteral | NodeIdentifierCallExpression;

type NodeIdentifierLiteral = {
	init?: {
		type: 'Literal';
		value: string;
	};
};

type NodeIdentifierCallExpression = {
	init?: {
		type: 'CallExpression';
		callee?: {
			object?: {
				elements?: Array<
					| { type: 'Literal'; value: string }
					| { type: 'LogicalExpression'; right?: { value: string } }
				>;
			};
		};
	};
};

// Nodes
export type Node =
	| NodeIdentifier
	| NodeElement
	| NodeAttribute
	| NodeClass
	| NodePseudoClassSelector
	| NodeLiteral
	| NodeTemplateElement;

type NodeIdentifier = {
	type: 'Identifier';
	name: string;
};

type NodeElement = {
	type: 'Element';
	name: string;
};

type NodeAttribute = {
	type: 'Attribute';
	name: string;
	value?: NodeClassAttribute[];
};

type NodeClass = {
	type: 'Class';
	name: string;
};

type NodePseudoClassSelector = {
	type: 'PseudoClassSelector';
	name: 'global' | string;
	children: [child?: { value: string }];
};

type NodeLiteral = {
	type: 'Literal';
	value: string;
};

type NodeTemplateElement = {
	type: 'TemplateElement';
	value: { raw: string };
};
