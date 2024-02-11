import { withGet } from '../withGet.js';

export interface Machine<S> {
	[k: string]: { [k: string]: S };
}
export type MachineState<T> = keyof T;
export type MachineEvent<T> = {
	[K in keyof T]: keyof T[K];
}[keyof T];

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
	const state = withGet.writable(initialState);

	function reducer(event: MachineEvent<M>) {
		const $state = state.get();

		// Get next state based on the current state & event,
		// or keep current state if no transition is defined.
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
