import type { Meta, StoryObj } from '@storybook/svelte';

import Collapsible from './Collapsible.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: 'Components/Collapsible',
	component: Collapsible,
	argTypes: {
		open: { control: 'boolean', defaultValue: false },
		disabled: { control: 'boolean' },
	},
} satisfies Meta<Collapsible>;

export default meta;
export type Story = StoryObj<typeof meta>;
export type StoryProps = Story['args'];

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Example: Story = {
	args: {
		open: false,
		disabled: false,
	},
};
