import { get, writable } from 'svelte/store';

interface Machine<S> {
	[k: string]: { [k: string]: S };
}
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

// 🤯 https://fettblog.eu/typescript-union-to-intersection/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
	x: infer R
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any
	? R
	: never;

/**
 * Creates a state machine with the given initial state and machine definition.
 * @param initialState - The initial state of the machine.
 * @param machine - The definition of the state machine, mapping states to possible transitions.
 * @returns An object containing the state store and a dispatch function for state transitions.
 */
export function createStateMachine<M>(
	initialState: MachineState<M>,
	machine: M & Machine<MachineState<M>>
) {
	// init a store with the initial state
	const state = writable(initialState);

	function reducer(event: MachineEvent<M>) {
		const $state = get(state);

		// Get next state based on the current state & event,
		// or keep current state if no transition is defined.
		// @ts-expect-error $state is keyof M
		const nextState = machine[$state][event];
		return nextState ?? $state;
	}

	const dispatch = (event: MachineEvent<M>) => {
		state.set(reducer(event));
	};

	return {
		state,
		dispatch,
	};
}
