import type { Meta, StoryObj } from '@storybook/svelte';
import html from 'svelte-htm'

import AccordionStyled from './AccordionStyled.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
	title: 'Components/Accordion',
	component: html`<${AccordionStyled} />`,
	tags: ['autodocs'],
	argTypes: {
		type: { control: 'radio', options: ['single', 'multiple'] }
	},
} satisfies Meta<AccordionStyled>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Styled: Story = {
	args: { type: 'single' },
	render: (args) => ({
		Component: html`<${AccordionStyled} type=${args.type} />`,
		props: args
	})
};


