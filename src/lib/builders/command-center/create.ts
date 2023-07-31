import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	debounce,
	generateId,
	isMac,
} from '@melt-ui/svelte/internal/helpers';
import type { MeltActionReturn } from '@melt-ui/svelte/internal/types';
import { derived, writable } from 'svelte/store';
import { createDialog } from '../dialog';

type BaseCommand = {
	callback: () => void;
	label?: string;
	disabled?: boolean;
	forceEnable?: boolean;
	group?: string;
	icon?: string;
	rank?: number;
	keepOpen?: boolean;
};

type KeyedCommand = BaseCommand & {
	keys: string[];
	/* Ctrl on Windows/Linux, Meta on Mac */
	ctrl?: boolean;
	shift?: boolean;
	/* Alt on Windows/Linux, Option on Mac */
	alt?: boolean;
};

function isKeyedCommand(command: Command): command is KeyedCommand {
	return 'keys' in command;
}

export type Command = KeyedCommand | BaseCommand;

type Parts = 'search';
const { name } = createElHelpers<Parts>('command-center');

export const createCommandCenter = () => {
	// Commands
	const commandMap = writable<Map<string, Command[]>>(new Map());

	const commands = derived(commandMap, ($commandMap) => {
		return Array.from($commandMap.values()).flat();
	});

	const registerCommands = {
		subscribe(runner: (cb: (newCommands: Command[]) => void) => void) {
			const uuid = generateId();

			runner((newCommands: Command[]) => {
				commandMap.update((curr) => {
					curr.set(uuid, newCommands);
					return curr;
				});
			});

			return () => {
				commandMap.update((curr) => {
					curr.delete(uuid);
					return curr;
				});
			};
		},
	};

	// Disabled
	const disabledMap = writable<Map<string, boolean>>(new Map());

	const commandsEnabled = derived(disabledMap, ($disabledMap) => {
		// If there's an item on the disabledMap that's true, then disable the command center
		return Array.from($disabledMap.values()).every((disabled) => !disabled);
	});

	const disableCommands = {
		subscribe(runner: (cb: (disabled: boolean) => void) => void) {
			const uuid = generateId();

			runner((disabled: boolean) => {
				disabledMap.update((curr) => {
					curr.set(uuid, disabled);
					return curr;
				});
			});

			return () => {
				disabledMap.update((curr) => {
					curr.delete(uuid);
					return curr;
				});
			};
		},
	};

	// Group ranks
	type CommandGroupRanks = Partial<Record<string, number>>;

	type GroupRanksMap = Map<string, CommandGroupRanks>;
	const groupRanksMap = writable<GroupRanksMap>(new Map());

	const updateCommandGroupRanks = {
		subscribe(runner: (cb: (updater: CommandGroupRanks) => void) => void) {
			const uuid = generateId();

			runner((groupRank: CommandGroupRanks) => {
				groupRanksMap.update((curr) => {
					curr.set(uuid, groupRank);
					return curr;
				});
			});

			return () => {
				groupRanksMap.update((curr) => {
					curr.delete(uuid);
					return curr;
				});
			};
		},
	};

	const commandGroupRanks = derived(groupRanksMap, ($groupRankTransformations) => {
		// TODO: Initial ranks
		const transformations = Array.from($groupRankTransformations.values());
		return transformations.reduce((prev, curr) => ({ ...prev, ...curr }), {});
	});

	// Keydown handler
	function getCommandRank(command: KeyedCommand) {
		const { keys, ctrl: meta, shift, alt } = command;
		const modifiers = [meta, shift, alt].filter(Boolean).length;
		return keys.length + modifiers * 10;
	}

	function hasDisputing(command: KeyedCommand, allCommands: Command[]) {
		return allCommands.some((otherCommand) => {
			if (command === otherCommand) {
				return false;
			}
			if (!isKeyedCommand(otherCommand)) {
				return false;
			}
			const keysString = command.keys.join('+');
			const otherKeysString = otherCommand.keys.join('+');

			const cmdRank = getCommandRank(command);
			const otherCmdRank = getCommandRank(otherCommand);

			return (
				(keysString.includes(otherKeysString) || otherKeysString.includes(keysString)) &&
				cmdRank <= otherCmdRank
			);
		});
	}

	function isInputEvent(event: KeyboardEvent) {
		return ['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName);
	}

	const commandCenterKeyDownHandler = derived(
		[commandMap, commandsEnabled],
		([$commandMap, enabled]) => {
			const commandsArr = Array.from($commandMap.values()).flat();
			let recentKeyCodes: number[] = [];
			let validCommands: KeyedCommand[] = [];

			const reset = debounce(() => {
				recentKeyCodes = [];
				validCommands = [];
			}, 1000);

			const getHighestPriorityCommand = () => {
				if (!validCommands.length) return;

				if (validCommands.length === 1) {
					return validCommands[0];
				}
				// Rank commands by how many keys and modifiers they have.
				// Each key is worth 1 point, each modifier is worth 10 points.
				// The command with the highest score wins.
				const rankedCommands = validCommands.map((command) => {
					return { command, score: getCommandRank(command) };
				});

				const highestScore = Math.max(...rankedCommands.map(({ score }) => score));
				const highestScoreCommands = rankedCommands.filter(({ score }) => score === highestScore);

				if (highestScoreCommands.length === 1) {
					return highestScoreCommands[0].command;
				}

				// If there's still a tie, the command with the most modifiers wins.
				// And if even that's a tie, the first command wins.
				const mostModifiers = Math.max(
					...highestScoreCommands.map(({ command }) => {
						const { ctrl: meta, shift, alt } = command;
						return [meta, shift, alt].filter(Boolean).length;
					})
				);
				const mostModifiersCommands = highestScoreCommands.filter(({ command }) => {
					const { ctrl: meta, shift, alt } = command;
					return [meta, shift, alt].filter(Boolean).length === mostModifiers;
				});

				return mostModifiersCommands[0]?.command;
			};

			const rankAndExecute = debounce(() => {
				const command = getHighestPriorityCommand();
				command?.callback();
				reset.immediate();
			}, 200);

			const execute = (command: KeyedCommand) => {
				if (hasDisputing(command, commandsArr)) {
					validCommands.push(command);
					rankAndExecute();
				} else {
					command.callback();
					reset.immediate();
				}
			};

			return (event: KeyboardEvent) => {
				recentKeyCodes.push(event.keyCode);
				reset();

				for (const command of commandsArr) {
					if (!isKeyedCommand(command)) continue;
					if (!command.forceEnable) {
						if (command.disabled) continue;
						if (!enabled) continue;
						if (isInputEvent(event)) continue;
					}

					const { keys, ctrl: meta, shift, alt } = command;

					const isMetaPressed = meta
						? isMac()
							? event.metaKey
							: event.ctrlKey
						: !(isMac() ? event.metaKey : event.ctrlKey);
					const isShiftPressed = shift ? event.shiftKey : !event.shiftKey;
					const isAltPressed = alt ? event.altKey : !event.altKey;

					const commandKeyCodes = keys.map((key) => key.toUpperCase().charCodeAt(0));
					const allKeysPressed = recentKeyCodes.join('').includes(commandKeyCodes.join(''));

					if (allKeysPressed && isMetaPressed && isShiftPressed && isAltPressed) {
						event.preventDefault();
						execute(command);
					}
				}
			};
		}
	);

	// Elements
	const searchValue = writable<string>('');
	const search = builder(name('search'), {
		action: (node: HTMLInputElement): MeltActionReturn<'input'> => {
			const destroy = addMeltEventListener(node, 'input', () => {
				searchValue.set(node.value);
			});

			return {
				destroy,
			};
		},
	});

	const dialog = createDialog();

	return {
		states: {
			...dialog.states,
			commands,
			commandsEnabled,
			commandGroupRanks,
			searchValue,
		},
		helpers: {
			registerCommands,
			disableCommands,
			updateCommandGroupRanks,
			commandCenterKeyDownHandler,
		},
		elements: {
			...dialog.elements,
			search,
		},
	};
};
