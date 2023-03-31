import type { Meta, StoryObj } from '@storybook/svelte';

import Accordion from './Accordion.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
	title: 'Components/Accordion',
	component: Accordion,
	tags: ['autodocs'],
	argTypes: {}
} satisfies Meta<Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Default: Story = {
	args: {}
};
