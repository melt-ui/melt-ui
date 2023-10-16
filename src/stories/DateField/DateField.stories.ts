import type { Meta, StoryObj } from '@storybook/svelte';

import DateField from './DateField.svelte';
import { CalendarDate, CalendarDateTime, getLocalTimeZone, now } from '@internationalized/date';

const calendarDate = new CalendarDate(2021, 1, 1);
const calendarDateTime = new CalendarDateTime(2021, 1, 1, 0, 0, 0);
const zonedDateTime = now(getLocalTimeZone());

const dateOptions = {
	CalendarDate: calendarDate,
	CalendarDateTime: calendarDateTime,
	ZonedDateTime: zonedDateTime,
};

const meta = {
	title: 'Components/DateField',
	component: DateField,
	argTypes: {
		defaultPlaceholder: {
			options: Object.keys(dateOptions),
			mapping: dateOptions,
			control: 'select',
			labels: {
				CalendarDate: 'CalendarDate',
				CalendarDateTime: 'CalendarDateTime',
				ZonedDateTime: 'ZonedDateTime',
			},
		},
		disabled: { control: 'boolean' },
	},
} satisfies Meta<DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => ({
		Component: DateField,
		props: args,
	}),
};

export const DateTime: Story = {
	render: (args) => ({
		Component: DateField,
		props: args,
	}),
	args: {
		defaultPlaceholder: new CalendarDateTime(2021, 1, 1),
	},
};
export const ZonedDateTime: Story = {
	render: (args) => ({
		Component: DateField,
		props: args,
	}),
	args: {
		defaultPlaceholder: now(getLocalTimeZone()),
	},
};
