import { DESCRIPTIONS } from '$docs/constants.js';
import type {
	APISchema,
	CustomEvents,
	DataAttributes,
	Prop,
	Props,
	ReturnedProps,
} from '$docs/types.js';
import { stringifiedIdObjType } from '$lib/internal/helpers';

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

function genIds(ids: string[] | readonly string[]): ReturnedProps {
	return ids.map((id) => {
		return {
			name: id,
			description: `The writable store that represents the id of the ${id} element.`,
			type: 'Writable<string>',
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
	ids?: string[] | readonly string[];
};

type ElementSchema = {
	title?: string;
	description: string;
	props?: PropGen[];
	dataAttributes?: DataAttributes;
	events?: readonly string[];
};

export function builderSchema(name: string, schema: BuilderSchema): APISchema {
	const { title, description, props, elements, helpers, states, builders, actions, options, ids } =
		schema;

	const localProps = props ? [...props] : [];
	if (ids) {
		localProps?.push({
			name: 'ids',
			type: stringifiedIdObjType(ids),
			description: 'Override the internally generated ids for the elements.',
		});
	}

	return {
		title: title ?? name,
		description: description ?? DESCRIPTIONS.BUILDER(name),
		isBuilder: true,
		props: localProps ? genProps(name, localProps) : undefined,
		elements: elements ? genElements(name, elements) : undefined,
		helpers,
		states,
		builders,
		actions,
		options: options ? propsToOptions(name, options) : undefined,
		ids: ids ? genIds(ids) : undefined,
	};
}

function eventToCustomEvent(event: string): CustomEvents[0] {
	return {
		name: `m-${event}`,
		payload: '(e: CustomEvent) => void',
	};
}

export function elementSchema(name: string, schema: ElementSchema): APISchema {
	const { title, description, props, dataAttributes, events } = schema;
	const customEvents = events ? events.map(eventToCustomEvent) : undefined;

	return {
		title: title ?? name,
		description,
		props: props ? genProps(name, props) : undefined,
		dataAttributes,
		events: customEvents,
	};
}
