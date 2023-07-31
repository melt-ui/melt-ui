import { DESCRIPTIONS } from '$docs/constants';
import type { APISchema, DataAttributes, Prop, Props, ReturnedProps } from '$docs/types';

export function propToOption(prop: Prop): ReturnedProps[0] {
	const type = Array.isArray(prop.type) ? prop.type.join(' | ') : prop.type;
	return {
		name: prop.name,
		type: `Writable<${type}>`,
		description: prop.description,
	};
}

export function propsToOptions(name: string, props: PropGen[]): ReturnedProps {
	return props.map((prop) => {
		if (typeof prop === 'function') {
			return propToOption(prop({ name }));
		}
		return propToOption(prop);
	});
}

type PropGen = ((props: { name: string; default?: string }) => Prop) | Prop;

export function genProps(name: string, props: PropGen[]): Props {
	return props.map((prop) => {
		if (typeof prop === 'function') {
			return prop({ name });
		}
		return prop;
	});
}

export function genElements(
	name: string,
	elements: { name: string; description: string; link?: string }[]
): ReturnedProps {
	return elements.map((element) => {
		return {
			name: element.name,
			description:
				element.description ?? `The builder store used to create the ${name} ${element.name}.`,
			link: element.link ?? `#${element.name.toLowerCase()}`,
		};
	});
}

type Element = {
	name: string;
	description: string;
	link?: string;
};

type BuilderSchema = {
	title: string;
	description?: string;
	props?: PropGen[];
	elements?: Element[];
	helpers?: ReturnedProps;
	states?: ReturnedProps;
	builders?: ReturnedProps;
	actions?: ReturnedProps;
	options?: PropGen[];
};

type ElementSchema = {
	title?: string;
	description: string;
	props?: PropGen[];
	dataAttributes?: DataAttributes;
};

export function builderSchema(name: string, schema: BuilderSchema): APISchema {
	const { title, description, props, elements, helpers, states, builders, actions, options } =
		schema;

	return {
		title: title ?? name,
		description: description ?? DESCRIPTIONS.BUILDER(name),
		isBuilder: true,
		props: props ? genProps(name, props) : undefined,
		elements: elements ? genElements(name, elements) : undefined,
		helpers,
		states,
		builders,
		actions,
		options: options ? propsToOptions(name, options) : undefined,
	};
}

export function elementSchema(name: string, schema: ElementSchema): APISchema {
	const { title, description, props, dataAttributes } = schema;

	return {
		title: title ?? name,
		description,
		props: props ? genProps(name, props) : undefined,
		dataAttributes,
	};
}
