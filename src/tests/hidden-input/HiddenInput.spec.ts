import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { writable } from 'svelte/store';
import { test } from 'vitest';
import type { HiddenInputProps } from './HiddenInput.js';
import HiddenInputTest from './HiddenInputTest.svelte';
import { sleep } from '$lib/internal/helpers/sleep.js';

/**
 * Simple setup function to render the tooltip component and
 * return the user event object, trigger, content, and other
 * methods returned from the render function.
 */
function setup(props: HiddenInputProps) {
	const user = userEvent.setup();
	const returned = render(HiddenInputTest, { props });
	const input = returned.getByTestId('input') as HTMLInputElement;

	return {
		...returned,
		user,
		input,
	};
}

describe('Hidden Input', () => {
	test('It has the correct attributes', async () => {
		const value = writable('test');
		const name = writable('test');
		const disabled = writable(false);
		const required = writable(false);
		const { input } = setup({ value, name, disabled, required });

		expect(input.value).toBe('test');
		value.set('new value');
		expect(input.value).toBe('new value');

		expect(input.name).toBe('test');
		name.set('new name');
		await sleep(1);
		expect(input.name).toBe('new name');

		expect(input.disabled).toBe(false);
		disabled.set(true);
		await sleep(1);
		expect(input.disabled).toBe(true);

		expect(input.required).toBe(false);
		required.set(true);
		await sleep(1);
		expect(input.required).toBe(true);
	});

	test('When value is changed, an event is emitted', async () => {
		const value = writable('test');
		let called = 0;
		setup({ value, onChange: () => called++ });

		value.set('new value');
		expect(called).toBe(1);
	});
});
