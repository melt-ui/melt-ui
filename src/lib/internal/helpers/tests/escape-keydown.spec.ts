import { kbd } from '$lib/internal/helpers/keyboard.js';
import { vi } from 'vitest';
import { useEscapeKeydown } from '../../actions/escape-keydown/action.js';
import { noop } from '$lib/internal/helpers/callbacks.js';
import type {
	EscapeBehaviorType,
	EscapeKeydownConfig,
} from '../../actions/escape-keydown/types.js';
import { withGet } from '$lib/internal/helpers/withGet.js';

const dispatchKeydownEvent = (key: string) => {
	const event = new KeyboardEvent('keydown', { key, bubbles: true });
	document.documentElement.dispatchEvent(event);
};

const dispatchEscape = () => dispatchKeydownEvent(kbd.ESCAPE);

const setup = (config?: EscapeKeydownConfig) => {
	const node = document.createElement('div');
	const handler = vi.fn(noop);
	const action = useEscapeKeydown(node, { ...config, handler });
	return { action, handler };
};

const singleEscapeAssertions = [
	{
		behavior: 'close',
		shouldClose: true,
	},
	{
		behavior: 'ignore',
		shouldClose: false,
	},
	{
		behavior: 'defer-otherwise-close',
		shouldClose: true,
	},
	{
		behavior: 'defer-otherwise-ignore',
		shouldClose: false,
	},
] as const satisfies { behavior: EscapeBehaviorType; shouldClose: boolean }[];

const nestedEscapeAssertions = [
	{
		behaviors: ['close', 'close'],
		expectedInvocations: [false, true],
	},
	{
		behaviors: ['close', 'defer-otherwise-close'],
		expectedInvocations: [true, false],
	},
	{
		behaviors: ['close', 'defer-otherwise-ignore'],
		expectedInvocations: [true, false],
	},
	{
		behaviors: ['close', 'ignore'],
		expectedInvocations: [false, false],
	},
	{
		behaviors: ['defer-otherwise-close', 'defer-otherwise-close'],
		expectedInvocations: [true, false],
	},
	{
		behaviors: ['defer-otherwise-ignore', 'defer-otherwise-ignore'],
		expectedInvocations: [false, false],
	},
] as const satisfies { behaviors: EscapeBehaviorType[]; expectedInvocations: boolean[] }[];

describe('escape keydown', () => {
	describe('single layers', () => {
		for (const { behavior, shouldClose } of singleEscapeAssertions) {
			it(`provided '${behavior}', on escape ${shouldClose ? 'should' : 'should not'} close`, () => {
				const { handler, action } = setup({ behaviorType: behavior });
				expect(handler).not.toHaveBeenCalled();
				dispatchEscape();
				expect(handler).toHaveBeenCalledTimes(shouldClose ? 1 : 0);
				action.destroy();
			});
		}
	});

	describe('nested layers', () => {
		for (const { behaviors, expectedInvocations } of nestedEscapeAssertions) {
			it(`provided behaviors '${behaviors}', expected invocations '${expectedInvocations}'`, () => {
				const layers = behaviors.map((behaviorType) => setup({ behaviorType }));
				layers.forEach(({ handler }) => expect(handler).not.toHaveBeenCalled());

				dispatchEscape();
				layers.forEach(({ handler }, idx) => {
					const shouldInvoke = expectedInvocations[idx];
					expect(handler).toHaveBeenCalledTimes(shouldInvoke ? 1 : 0);
				});
				layers.forEach(({ action }) => action.destroy());
			});
		}
	});

	it('does not call handler after unmounting', () => {
		const { handler, action } = setup({ behaviorType: 'close' });
		expect(handler).toHaveBeenCalledTimes(0);
		action.destroy();
		dispatchEscape();
		expect(handler).toHaveBeenCalledTimes(0);
	});

	it('does not call handler when other key is pressed', () => {
		const { handler, action } = setup({ behaviorType: 'close' });
		dispatchKeydownEvent(kbd.SPACE);
		expect(handler).toHaveBeenCalledTimes(0);
		action.destroy();
	});

	it('correctly unmounts event listener and calls handler of top-most layer', () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);

		action2.destroy();
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
		action1.destroy();
	});

	it('does not change position of layer in the stack when options update', () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);

		action1.update({ behaviorType: 'ignore', handler: handler1 });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(2);
		action2.destroy();
		action1.destroy();
	});

	it('does not change position of layer in the stack when updating behaviorType store', () => {
		const w1 = withGet.writable<EscapeBehaviorType>('close');
		const { handler: handler1, action: action1 } = setup({ behaviorType: w1 });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);

		w1.set('ignore');
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(2);
		action2.destroy();
		action1.destroy();
	});

	it('respects updated behaviorType', () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'defer-otherwise-close' });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(0);

		action2.update({ behaviorType: 'close', handler: handler2 });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();
		action1.destroy();
	});

	it('respects updated behaviorType store', () => {
		const w2 = withGet.writable<EscapeBehaviorType>('defer-otherwise-close');
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: w2 });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(0);

		w2.set('close');
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();
		action1.destroy();
	});

	it('respects updating behaviorType from string value to store', () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);

		const w2 = withGet.writable<EscapeBehaviorType>('ignore');
		action2.update({ behaviorType: w2, handler: handler2 });
		dispatchEscape();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();
		action1.destroy();
	});
});
