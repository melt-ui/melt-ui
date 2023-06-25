<script lang="ts">
	import { Docs } from '$routes/(components)';
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
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The button which toggles the menu's open state.</Docs.Li>
	<Docs.Li><b>Menu:</b> The root container for the popover menu</Docs.Li>
	<Docs.Li>
		<b>Item:</b> A menuitem which can be a link or a function.
	</Docs.Li>
	<Docs.Li>
		<b>SubTrigger:</b> A button which toggles the submenu's open state.
	</Docs.Li>
	<Docs.Li>
		<b>SubMenu:</b> A menu which is nested inside another menu.
	</Docs.Li>
</Docs.Ul>
