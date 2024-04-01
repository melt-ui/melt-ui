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

const setup = (config?: InteractOutsideConfig) => {
	const node = document.createElement('div');
	const handler = vi.fn(noop);
	const action = useInteractOutside(node, { ...config, onInteractOutside: handler });
	return { action, handler };
};

describe('interact outside', () => {
	it.only('calls handler on outside interaction provided `behaviorType: close`', async () => {
		const { handler, action } = setup({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler).toHaveBeenCalledTimes(1);
		action.destroy();
	});

	it('does not call handler after unmounting', async () => {
		const { handler, action } = setup({ behaviorType: 'close' });
		expect(handler).toHaveBeenCalledTimes(0);
		action.destroy();
		await dispatchOutsideClick();
		expect(handler).toHaveBeenCalledTimes(0);
	});

	it('does not call handler provided `behaviorType: ignore`', async () => {
		const { handler, action } = setup({ behaviorType: 'ignore' });
		await dispatchOutsideClick();
		expect(handler).toHaveBeenCalledTimes(0);
		action.destroy();
	});

	it('does not call handler provided `behaviorType: defer`', async () => {
		const { handler, action } = setup({ behaviorType: 'defer' });
		await dispatchOutsideClick();
		expect(handler).toHaveBeenCalledTimes(0);
		action.destroy();
	});

	it('calls handler of top-most layer', async () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);
		action1.destroy();
		action2.destroy();
	});

	it('calls handler of top-most layer with `behaviorType: close`', async () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);
		action1.destroy();
		action2.destroy();
	});

	it('does not call handler of top-most layer with `behaviorType: ignore`', async () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'ignore' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(0);
		action1.destroy();
		action2.destroy();
	});

	it('correctly unmounts event listener and calls handler of top-most layer', async () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(0);
		expect(handler2).toHaveBeenCalledTimes(1);
		action2.destroy();

		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(1);

		action1.destroy();
	});

	it('calls handler of top-most layer ignoring layers with `behaviorType: defer`', async () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'defer' });
		const { handler: handler3, action: action3 } = setup({ behaviorType: 'defer' });
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(1);
		expect(handler2).toHaveBeenCalledTimes(0);
		expect(handler3).toHaveBeenCalledTimes(0);

		action3.destroy();
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(2);
		expect(handler2).toHaveBeenCalledTimes(0);
		expect(handler3).toHaveBeenCalledTimes(0);

		action2.destroy();
		await dispatchOutsideClick();
		expect(handler1).toHaveBeenCalledTimes(3);
		expect(handler2).toHaveBeenCalledTimes(0);
		expect(handler3).toHaveBeenCalledTimes(0);
		action1.destroy();
	});

	it('does not change position of layer in the stack when options update', async () => {
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
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
		const { handler: handler1, action: action1 } = setup({ behaviorType: w1 });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
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
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'defer' });
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
		const w2 = withGet.writable<ClickOutsideBehaviorType>('defer');
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: w2 });
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
		const { handler: handler1, action: action1 } = setup({ behaviorType: 'close' });
		const { handler: handler2, action: action2 } = setup({ behaviorType: 'close' });
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
