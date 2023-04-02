type RadixComponent = Record<string, unknown>;

export type PreviewSchema<T extends RadixComponent> = {
	title: string;
	description: string;
	example: unknown;
	props: PreviewProps<T>;
};

export type PreviewProps<T extends RadixComponent> = {
	// I'd want this to be strongly typed using ComponentProps
	[K in keyof T]: Record<string, { type: 'boolean' | 'string' | 'number' }>;
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

export function getPropsObj<P extends PreviewProps<RadixComponent>>(props: P) {
	return Object.entries(props).reduce<P>(
		(acc, [subCmp, props]) => ({
			...acc,
			[subCmp]: Object.keys(props).reduce((acc, propName) => ({ ...acc, [propName]: false }), {})
		}),
		{} as P
	) as unknown as ResolvedProps<P>;
}
