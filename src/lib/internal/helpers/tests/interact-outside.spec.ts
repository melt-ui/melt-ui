import { vi } from 'vitest';
import { noop } from '$lib/internal/helpers/callbacks.js';
import { withGet } from '$lib/internal/helpers/withGet.js';
import {
	useInteractOutside,
	type ClickOutsideBehaviorType,
	type InteractOutsideConfig,
} from '$lib/internal/actions/index.js';
import { sleep } from '../sleep.js';

const dispatchOutsideClick = async () => {
	const mousedown = new MouseEvent('mousedown', { bubbles: true });
	const mouseup = new MouseEvent('mouseup', { bubbles: true });
	document.documentElement.dispatchEvent(mousedown);
	document.documentElement.dispatchEvent(mouseup);
	await sleep(20);
};

const mountLayer = (config?: InteractOutsideConfig) => {
	const node = document.createElement('div');
	const handler = vi.fn(noop);
	const action = useInteractOutside(node, { ...config, onInteractOutside: handler });
	return { action, handler };
};
const singleLayerAssertions = [
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
] satisfies { behavior: ClickOutsideBehaviorType; shouldClose: boolean }[];

const nestedLayerAssertions = [
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
] satisfies { behaviors: ClickOutsideBehaviorType[]; expectedInvocations: boolean[] }[];

describe('interact outside', () => {
	describe('single layers', () => {
		for (const { behavior, shouldClose } of singleLayerAssertions) {
			it(`provided '${behavior}', on outside interaction ${
				shouldClose ? 'should' : 'should not'
			} close`, async () => {
				const { handler, action } = mountLayer({ behaviorType: behavior });
				expect(handler).not.toHaveBeenCalled();
				await dispatchOutsideClick();
				expect(handler).toHaveBeenCalledTimes(shouldClose ? 1 : 0);
				action.destroy();
			});
		}
	});

	describe('nested layers', () => {
		for (const { behaviors, expectedInvocations } of nestedLayerAssertions) {
			it(`provided behaviors '${behaviors}', expected invocations '${expectedInvocations}'`, async () => {
				const layers = behaviors.map((behaviorType) => mountLayer({ behaviorType }));
				layers.forEach(({ handler }) => expect(handler).not.toHaveBeenCalled());

				await dispatchOutsideClick();
				layers.forEach(({ handler }, idx) => {
					const shouldInvoke = expectedInvocations[idx];
					expect(handler).toHaveBeenCalledTimes(shouldInvoke ? 1 : 0);
				});
				layers.forEach(({ action }) => action.destroy());
			});
		}
	});

	it('does not call handler after unmounting', async () => {
		const { handler, action } = mountLayer({ behaviorType: 'close' });
		expect(handler).toHaveBeenCalledTimes(0);
		action.destroy();
		await dispatchOutsideClick();
		expect(handler).toHaveBeenCalledTimes(0);
	});

	it('correctly unmounts event listener and calls handler of top-most layer', async () => {
		const { handler: handler1, action: action1 } = mountLayer({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = mountLayer({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();

		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
		action1.destroy();
	});

	it('does not change position of layer in the stack when options update', async () => {
		const { handler: handler1, action: action1 } = mountLayer({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = mountLayer({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);

		action1.update({ behaviorType: 'ignore', onInteractOutside: handler1 });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(2);
		action2.destroy();
		action1.destroy();
	});

	it('does not change position of layer in the stack when updating behaviorType store', async () => {
		const w1 = withGet.writable<ClickOutsideBehaviorType>('close');
		const { handler: handler1, action: action1 } = mountLayer({ behaviorType: w1 });
		const { handler: handler2, action: action2 } = mountLayer({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);

		w1.set('ignore');
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(2);
		action2.destroy();
		action1.destroy();
	});

	it('respects updated behaviorType', async () => {
		const { handler: handler1, action: action1 } = mountLayer({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = mountLayer({
			behaviorType: 'defer-otherwise-close',
		});
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(0);

		action2.update({ behaviorType: 'close', onInteractOutside: handler2 });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();
		action1.destroy();
	});

	it('respects updated behaviorType store', async () => {
		const w2 = withGet.writable<ClickOutsideBehaviorType>('defer-otherwise-close');
		const { handler: handler1, action: action1 } = mountLayer({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = mountLayer({ behaviorType: w2 });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(0);

		w2.set('close');
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();
		action1.destroy();
	});

	it('respects updating behaviorType from string value to store', async () => {
		const { handler: handler1, action: action1 } = mountLayer({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = mountLayer({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);

		const w2 = withGet.writable<ClickOutsideBehaviorType>('ignore');
		action2.update({ behaviorType: w2, onInteractOutside: handler2 });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();
		action1.destroy();
	});
});
