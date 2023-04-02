import type { Meta, StoryObj } from '@storybook/svelte';

import CollapsibleStyled from './CollapsibleStyled.svelte';
import { Collapsible } from '../';
import html from 'svelte-htm'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/svelte/writing-stories/introduction
const meta = {
	title: 'components/Collapsible',
	component: html`<${CollapsibleStyled}>`,
	tags: ['autodocs'],
} satisfies Meta<CollapsibleStyled>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/svelte/writing-stories/args
export const Styled: Story = {
	args: {
		open: false,
		disabled: false
	},
	argTypes: {
		open: { control: 'boolean' },
		disabled: { control: 'boolean' }
	}
};

export const Simple: Story = {
	render: (args) => ({
		Component: html`
		<${Collapsible.Root} open=${args.open} disabled=${args.disabled}>
			<${Collapsible.Trigger}>Trigger</${Collapsible.Trigger}>
			<${Collapsible.Content}>Content</${Collapsible.Content}>
		</${Collapsible.Root}>`,
	}),
	args: {
		open: false,
		disabled: false
	},
	argTypes: {
		open: { control: 'boolean' },
		disabled: { control: 'boolean' }
	}
}


export const Animated: Story = {
	render: (args) => ({
		Component: html`
		<${Collapsible.Root} open=${args.open}>
			<${Collapsible.Trigger}>Trigger</${Collapsible.Trigger}>
			<${Collapsible.Content} transition=${{ duration: 300 }}>Content</${Collapsible.Content}>
		</${Collapsible.Root}>`,
	}),
}
