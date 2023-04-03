import type { ComponentProps, SvelteComponent } from "svelte";

type RadixComponentGroup = { [key: string]: typeof SvelteComponent }

export type PreviewSchema<T extends RadixComponentGroup> = {
	title: string;
	description: string;
	example: unknown;
	props: PreviewProps<T>;
};

type PreviewComponentProps<T extends SvelteComponent, P = ComponentProps<T>> = {
	[K in keyof P]: { type: 'boolean', default?: boolean } | { type: 'string', default?: string } | { type: 'number', default?: number };
};

export type PreviewProps<T extends RadixComponentGroup> = {
	[K in keyof T]: PreviewComponentProps<InstanceType<T[K]>>;
};

type ResolvedProps<T> = {
	[K in keyof T]: T[K] extends { type: 'boolean' }
	? boolean
	: T[K] extends { type: 'string' }
	? string
	: T[K] extends { type: 'number' }
	? number
	: T[K] extends object
	? ResolvedProps<T[K]>
	: never;
};

const typeDefaults = {
	boolean: false,
	string: '',
	number: 0
};

export function getPropsObj<P extends PreviewProps<RadixComponentGroup>>(props: P) {
	return Object.entries(props).reduce<P>(
		(acc, [subCmp, props]) => ({
			...acc,
			[subCmp]: Object.entries(props).reduce((acc, [propName, propConfig]) => {
				const defaultValue = propConfig.default ?? typeDefaults[propConfig.type];
				return { ...acc, [propName]: defaultValue };
			}, {})
		}),
		{} as P
	) as unknown as ResolvedProps<P>;
}
