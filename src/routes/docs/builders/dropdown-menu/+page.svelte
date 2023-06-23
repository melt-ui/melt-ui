<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Dropdown Menu</Docs.H1>
<Docs.Description>
	Displays a menu to the user, which can consist of links or functions, triggered by a button.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />
<Docs.Construction />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
	<Docs.Li>Can be controlled or uncontrolled.</Docs.Li>
	<Docs.Li>Supports submenus with configurable reading direction.</Docs.Li>
	<Docs.Li>Customize menu positioning.</Docs.Li>
	<Docs.Li>Optionally render a pointing arrow.</Docs.Li>
	<Docs.Li>Fully managed focus.</Docs.Li>
	<Docs.Li>Full keyboard navigation.</Docs.Li>
	<Docs.Li>Typeahead support</Docs.Li>
</Docs.Ul>

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
