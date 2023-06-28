<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas';
	export let data;
	const features = [
		'Can be controlled or uncontrolled.',
		'Supports submenus with configurable reading direction.',
		'Customize menu positioning.',
		'Optionally render a pointing arrow.',
		'Fully managed focus.',
		'Full keyboard navigation.',
		'Typeahead support',
	];
</script>

<Docs.H1>Dropdown Menu</Docs.H1>
<Docs.Description>
	Displays a menu to the user, which can consist of links or functions, triggered by a button.
</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction>More examples and documentation coming soon!</Docs.Construction>

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The button which toggles the menu's open state.</Docs.Li>
	<Docs.Li><b>Menu:</b> The root container for the popover menu</Docs.Li>
	<Docs.Li><b>Item:</b> A menuitem which can be a link or a function.</Docs.Li>
	<Docs.Li><b>Checkbox Item:</b> A menu item which can be checked or unchecked.</Docs.Li>
	<Docs.Li><b>Radio Group:</b> A group of radio items.</Docs.Li>
	<Docs.Li><b>Radio Item:</b> A menu item which can be selected from a group of items.</Docs.Li>
	<Docs.Li><b>Sub Trigger:</b> A button which toggles the submenu's open state.</Docs.Li>
	<Docs.Li><b>Sub Menu:</b> A menu which is nested inside another menu.</Docs.Li>
	<Docs.Li><b>Separator:</b> A visual divider between menu items.</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.menu} />
<Docs.API schema={schemas.trigger} />
<Docs.API schema={schemas.item} />
<Docs.API schema={schemas.checkboxItem} />
<Docs.API schema={schemas.radioGroupBuilder} />
<Docs.API schema={schemas.radioGroup} />
<Docs.API schema={schemas.radioItem} />
<Docs.API schema={schemas.submenuBuilder} />
<Docs.API schema={schemas.submenu} />
<Docs.API schema={schemas.subTrigger} />
<Docs.API schema={schemas.separator} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"
		>Menu WAI-ARIA design pattern</Docs.A
	> & <Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/"
		>Menu Button WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
