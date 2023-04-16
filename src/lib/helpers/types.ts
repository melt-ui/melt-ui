/* -------------*/
/* Helper types */
/* -------------*/

// Check if type are equal or just extends
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
	G
>() => G extends U ? 1 : 2
	? Y
	: N;

// Type that maps a record of custom events to their payload
// e.g. Detailed<{change: CustomEvent<string>}> should be {change: string}
export type Detailed<T> = {
	[K in keyof T]: T[K] extends CustomEvent<infer U> ? U : T[K];
};
