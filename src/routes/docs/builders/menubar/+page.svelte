<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
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

<Docs.H1>Menubar</Docs.H1>
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

<Docs.H2>Usage</Docs.H2>
<Docs.P class="mt-4"
	>The first thing you'll need to do is create a menubar using the <Docs.Code
		>createMenubar</Docs.Code
	> builder function.</Docs.P
>
<Docs.CodeBlock code={snippets.usage} />

<Docs.P class="mt-4">
	This function returns an object containing the <Docs.Code>menubar</Docs.Code> attributes object, and
	a <Docs.Code>createMenu</Docs.Code> function. The <Docs.Code>createMenu</Docs.Code> function is used
	the same way as the <Docs.Code>createDropdownMenu</Docs.Code> builder from the <Docs.A
		href="/docs/builders/dropdown-menu">Dropdown Menu</Docs.A
	> builder. The only difference is that using this function keeps the menu scoped to the menubar which
	happens behind the scenes.
</Docs.P>

<Docs.P class="mt-4">
	Now that we have a menubar and menu builder function, we can create a menu using the <Docs.Code
		>createMenu</Docs.Code
	> function and wrap it in a <Docs.Code>menubar</Docs.Code> element.
</Docs.P>

<Docs.CodeBlock code={snippets.usage2} />

<Docs.P class="mt-4">
	This isn't much of a "menubar" though, as typically a menubar consists of multiple menus, so let's
	add a couple more.
</Docs.P>

<Docs.P class="mt-4">
	Since each <Docs.Code>menu</Docs.Code> needs to have it's own "scope", we'll need to call the <Docs.Code
		>createMenu</Docs.Code
	> function again for each menu we want to create. If you're doing this all in one file, it can get
	a bit messy, so I'd recommend componentizing each menu. But for the sake of this example, we'll just
	rename the returned variables to prevent any naming conflicts.
</Docs.P>

<Docs.CodeBlock code={snippets.usage3} />

<Docs.P>
	Now we have a menubar with three menus, each with their own items and scopes. As mentioned
	previously, the functionality of <Docs.Code>createMenu</Docs.Code> is the exact same as <Docs.Code
		>createDropdownMenu</Docs.Code
	>, so you can refer to the <Docs.A href="/docs/builders/dropdown-menu">Dropdown Menu</Docs.A> documentation
	for more information on how to use it.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.menuBuilder} />
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
