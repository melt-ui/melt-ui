import type { Meta, StoryObj } from '@storybook/svelte';

import Collapsible from './Collapsible.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
	title: 'components/Collapsible',
	component: Collapsible,
	tags: ['autodocs'],
	argTypes: {
		open: { control: 'boolean' },
		disabled: { control: 'boolean' }
	}
} satisfies Meta<Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Default: Story = {
	args: {
		open: false,
		disabled: false
	}
};
