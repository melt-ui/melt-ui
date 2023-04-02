type RadixComponent = Record<string, unknown>;

export type PreviewSchema<T extends RadixComponent> = {
	title: string;
	description: string;
	example: unknown;
	props: PreviewProps<T>;
};

export type PreviewProps<T extends RadixComponent> = {
	// I'd want this to be strongly typed using ComponentProps
	[K in keyof T]: Record<string, { type: 'boolean' | 'string' | 'number'; default?: unknown }>;
};

export type ResolvedProps<T> = {
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

export function getPropsObj<P extends PreviewProps<RadixComponent>>(props: P) {
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
