import { testKbd as kbd } from '../utils.js';
import { queryByText, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, test } from 'vitest';
import TagsInput from './TagsInput.svelte';

describe('TagsInput', () => {
	test('No accessibility violations', async () => {
		const { container } = render(TagsInput);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Default tags are present', async () => {
		const defaultTags = ['svelte', 'ts'];
		const { findByTestId } = render(TagsInput, {
			props: {
				defaultTags,
			},
		});

		for (let i = 0; i < defaultTags.length; i++) {
			const tag = await findByTestId(`tag-${i}`);
			expect(tag).toBeInTheDocument();
			expect(queryByText(tag, defaultTags[i])).toBeInTheDocument();
		}
	});

	test('New tag can be added', async () => {
		const { findByRole, queryByText } = render(TagsInput);

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		const newTag = 'new tag';
		await user.type(input, `${newTag}${kbd.ENTER}`);
		expect(input).not.toHaveValue();
		expect(queryByText(newTag)).toBeInTheDocument();
	});

	test('Respect uniqueness', async () => {
		const newTag = 'new tag';
		const { findByRole } = render(TagsInput, {
			props: {
				unique: true,
				defaultTags: [newTag],
			},
		});

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		await user.type(input, `${newTag}${kbd.ENTER}`);
		expect(input).toHaveValue();
	});

	test('Respect uniqueness with custom add function', async () => {
		const newTag = 'new tag';
		const { findByRole } = render(TagsInput, {
			props: {
				unique: true,
				defaultTags: [newTag],
				add(v) {
					return v.trim();
				},
				trim: false,
			},
		});

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		await user.type(input, `${newTag}   ${kbd.ENTER}`);
		expect(input).toHaveValue();
	});

	test('Auto trim', async () => {
		const newTag = 'new tag';
		const { findByRole, queryByText } = render(TagsInput, {
			props: {
				trim: true,
			},
		});

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		await user.type(input, `${newTag}   ${kbd.ENTER}`);
		expect(input).not.toHaveValue();
		expect(queryByText(newTag)).toBeInTheDocument();
	});

	test('Respect uniqueness with auto trim', async () => {
		const newTag = 'new tag';
		const { findByRole } = render(TagsInput, {
			props: {
				unique: true,
				defaultTags: [newTag],
				trim: true,
			},
		});

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		await user.type(input, `${newTag}   ${kbd.ENTER}`);
		expect(input).toHaveValue();
	});

	test('Respect allowed list', async () => {
		const newTag = 'new tag';
		const allowedTag = 'something else';
		const { findByRole, queryByText } = render(TagsInput, {
			props: {
				allowed: [allowedTag],
				trim: true,
			},
		});

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		await user.type(input, `${newTag}${kbd.ENTER}`);
		expect(input).toHaveValue();
		user.clear(input);
		await user.type(input, `${allowedTag}${kbd.ENTER}`);
		expect(input).not.toHaveValue();
		expect(queryByText(allowedTag)).toBeInTheDocument();
	});

	test('Respect allowed list with auto trim', async () => {
		const newTag = 'new tag';
		const allowedTag = 'something else';
		const { findByRole, queryByText } = render(TagsInput, {
			props: {
				allowed: [allowedTag],
				trim: true,
			},
		});

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		await user.type(input, `${newTag}   ${kbd.ENTER}`);
		expect(input).toHaveValue();
		user.clear(input);
		await user.type(input, `${allowedTag}    ${kbd.ENTER}`);
		expect(input).not.toHaveValue();
		expect(queryByText(allowedTag)).toBeInTheDocument();
	});

	test('Respect allowed list with custom add', async () => {
		const newTag = 'new tag';
		const allowedTag = 'something else';
		const { findByRole, queryByText } = render(TagsInput, {
			props: {
				allowed: [allowedTag],
				add(v) {
					return v.trim();
				},
			},
		});

		const input = await findByRole('textbox');
		const user = userEvent.setup();
		await user.type(input, `${newTag}   ${kbd.ENTER}`);
		expect(input).toHaveValue();
		user.clear(input);
		await user.type(input, `${allowedTag}    ${kbd.ENTER}`);
		expect(input).not.toHaveValue();
		expect(queryByText(allowedTag)).toBeInTheDocument();
	});
});
