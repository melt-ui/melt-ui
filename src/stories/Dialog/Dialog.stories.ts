import type { Meta, StoryObj } from '@storybook/svelte';

import Dialog from './Dialog.svelte';
import NestedDialog from './NestedDialog.svelte';
import WithSelectCmp from './WithSelect.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: 'Components/Dialog',
	component: Dialog,
	argTypes: {},
} satisfies Meta<Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Example: Story = {
	args: {},
};

export const Nested: Story = {
	render: () => ({
		Component: NestedDialog,
	}),
};

export const WithSelect: Story = {
	render: () => ({
		Component: WithSelectCmp,
	}),
};
