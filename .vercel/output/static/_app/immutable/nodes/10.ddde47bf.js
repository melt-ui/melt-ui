import{s as Gt,n as ot,e as j,c as W,b as nt,f as d,J as tt,i as $,A as st,M as Xt,N as ht,t as A,a as k,k as x,d as y,h as Nt,j as Z,u as Zt,O as te,g as xt}from"../chunks/scheduler.2943ef39.js";import{S as Jt,i as Kt,t as m,g as ee,b as p,e as ne,f as Bt,c as g,a as _,m as v,d as w}from"../chunks/index.c70d9825.js";import{e as Ot}from"../chunks/each.83bf9e7b.js";import{g as At,a as oe}from"../chunks/spread.8a54911c.js";import{c as se}from"../chunks/create.77639715.js";import"../chunks/index.a1398546.js";import{s as Ut}from"../chunks/index.8e0124f5.js";import{T as ie}from"../chunks/tailwind.config.ebd62547.js";import{G as re}from"../chunks/globals_raw.27244441.js";import{D as b}from"../chunks/index.5e8f8c6b.js";function Vt(a,t,n){const o=a.slice();return o[10]=t[n].id,o[11]=t[n].title,o[12]=t[n].description,o[14]=n,o}function Ft(a){let t,n,o=a[12]+"",i,s,r,f=[{class:"overflow-hidden bg-neutral-100 text-sm text-neutral-900"},a[3](a[10])],u={};for(let c=0;c<f.length;c+=1)u=ot(u,f[c]);return{c(){t=j("div"),n=j("div"),i=A(o),this.h()},l(c){t=W(c,"DIV",{class:!0});var h=nt(t);n=W(h,"DIV",{class:!0});var z=nt(n);i=x(z,o),z.forEach(d),h.forEach(d),this.h()},h(){Nt(n,"class","px-5 py-4"),tt(t,u)},m(c,h){$(c,t,h),Z(t,n),Z(n,i),r=!0},p(c,h){tt(t,u=At(f,[{class:"overflow-hidden bg-neutral-100 text-sm text-neutral-900"},h&8&&c[3](c[10])]))},i(c){r||(c&&te(()=>{r&&(s||(s=Bt(t,Ut,{},!0)),s.run(1))}),r=!0)},o(c){c&&(s||(s=Bt(t,Ut,{},!1)),s.run(0)),r=!1},d(c){c&&d(t),c&&s&&s.end()}}}function Lt(a){let t,n,o,i=a[11]+"",s,r,f,u=a[2](a[10]),c,h,z,S=[{id:r=a[14]===0?"trigger":void 0},a[1](a[10]),{class:"flex h-12 flex-1 cursor-pointer items-center justify-between bg-white px-5 text-base font-medium leading-none text-magnum-700 shadow-[0_1px_0] transition-colors hover:bg-opacity-95"}],C={};for(let I=0;I<S.length;I+=1)C=ot(C,S[I]);let T=u&&Ft(a),Y=[a[0](a[10]),{class:"mt-px overflow-hidden transition-colors first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:ring focus-within:ring-magnum-400"}],D={};for(let I=0;I<Y.length;I+=1)D=ot(D,Y[I]);return{c(){t=j("div"),n=j("h2"),o=j("button"),s=A(i),f=k(),T&&T.c(),c=k(),this.h()},l(I){t=W(I,"DIV",{class:!0});var P=nt(t);n=W(P,"H2",{class:!0});var R=nt(n);o=W(R,"BUTTON",{id:!0,class:!0});var F=nt(o);s=x(F,i),F.forEach(d),R.forEach(d),f=y(P),T&&T.l(P),c=y(P),P.forEach(d),this.h()},h(){tt(o,C),Nt(n,"class","flex"),tt(t,D)},m(I,P){$(I,t,P),Z(t,n),Z(n,o),Z(o,s),o.autofocus&&o.focus(),Z(t,f),T&&T.m(t,null),Z(t,c),h||(z=Zt(a[6].call(null,o)),h=!0)},p(I,P){tt(o,C=At(S,[{id:r},P&2&&I[1](I[10]),{class:"flex h-12 flex-1 cursor-pointer items-center justify-between bg-white px-5 text-base font-medium leading-none text-magnum-700 shadow-[0_1px_0] transition-colors hover:bg-opacity-95"}])),P&4&&(u=I[2](I[10])),u?T?(T.p(I,P),P&4&&m(T,1)):(T=Ft(I),T.c(),m(T,1),T.m(t,c)):T&&(ee(),p(T,1,1,()=>{T=null}),ne()),tt(t,D=At(Y,[P&1&&I[0](I[10]),{class:"mt-px overflow-hidden transition-colors first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:ring focus-within:ring-magnum-400"}]))},d(I){I&&d(t),T&&T.d(),h=!1,z()}}}function ae(a){let t,n=Ot(a[9]),o=[];for(let r=0;r<n.length;r+=1)o[r]=Lt(Vt(a,n,r));let i=[{class:"mx-auto w-full max-w-md rounded-md shadow-lg"},a[8]],s={};for(let r=0;r<i.length;r+=1)s=ot(s,i[r]);return{c(){t=j("div");for(let r=0;r<o.length;r+=1)o[r].c();this.h()},l(r){t=W(r,"DIV",{class:!0});var f=nt(t);for(let u=0;u<o.length;u+=1)o[u].l(f);f.forEach(d),this.h()},h(){tt(t,s)},m(r,f){$(r,t,f);for(let u=0;u<o.length;u+=1)o[u]&&o[u].m(t,null)},p(r,[f]){if(f&527){n=Ot(r[9]);let u;for(u=0;u<n.length;u+=1){const c=Vt(r,n,u);o[u]?o[u].p(c,f):(o[u]=Lt(c),o[u].c(),o[u].m(t,null))}for(;u<o.length;u+=1)o[u].d(1);o.length=n.length}},i:st,o:st,d(r){r&&d(t),Xt(o,r)}}}function le(a,t,n){let o,i,s,r;const{content:f,item:u,trigger:c,isSelected:h,root:z}=se();return ht(a,f,C=>n(3,r=C)),ht(a,u,C=>n(0,o=C)),ht(a,c,C=>n(1,i=C)),ht(a,h,C=>n(2,s=C)),[o,i,s,r,f,u,c,h,z,[{id:"item-1",title:"Is it accessible?",description:"Yes. It adheres to the WAI-ARIA design pattern."},{id:"item-2",title:"Is it unstyled?",description:"Yes. It's unstyled by default, giving you freedom over the look and feel."},{id:"item-3",title:"Can it be animated?",description:"Yes! You can use the transition prop to configure the animation."}]]}let ce=class extends Jt{constructor(t){super(),Kt(this,t,le,ae,Gt,{})}};const fe=`<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description: 'Yes! You can use the transition prop to configure the animation.',
		},
	];
<\/script>

<div class="mx-auto w-full max-w-md rounded-md shadow-lg" {...root}>
	{#each items as { id, title, description }, i}
		<div
			{...$item(id)}
			class="mt-px overflow-hidden transition-colors
			first:mt-0 first:rounded-t last:rounded-b focus-within:relative
			focus-within:z-10 focus-within:ring focus-within:ring-magnum-400"
		>
			<h2 class="flex">
				<button
					id={i === 0 ? 'trigger' : undefined}
					{...$trigger(id)}
					use:trigger
					class="flex h-12 flex-1 cursor-pointer items-center justify-between
				bg-white px-5 text-base font-medium leading-none text-magnum-700
					shadow-[0_1px_0] transition-colors hover:bg-opacity-95"
				>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class="overflow-hidden bg-neutral-100 text-sm text-neutral-900"
					{...$content(id)}
					transition:slide
				>
					<div class="px-5 py-4">{description}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
`,de=`<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description: 'Yes! You can use the transition prop to configure the animation.',
		},
	];
<\/script>

<div class="root" {...root}>
	{#each items as { id, title, description }, i}
		<div {...$item(id)} class="item">
			<h2>
				<button id={i === 0 ? 'trigger' : undefined} {...$trigger(id)} use:trigger class="trigger">
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div class="content" {...$content(id)} transition:slide>
					<div>{description}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.root {
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		max-width: var(--tw-width-md);
		border-radius: var(--tw-border-radius-md);
		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
	}

	.item {
		margin-top: var(--tw-size-px);
		overflow: hidden;
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.item:first-child {
		margin-top: var(--tw-size-0);
		border-top-left-radius: var(--tw-border-radius-default);
		border-top-right-radius: var(--tw-border-radius-default);
	}

	.item:last-child {
		border-bottom-right-radius: var(--tw-border-radius-default);
		border-bottom-left-radius: var(--tw-border-radius-default);
	}

	.item:focus-within {
		position: relative;
		z-index: 10;
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
			var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
			var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
		--tw-ring-opacity: 1;
		--tw-ring-color: rgb(var(--tw-color-magnum-400) / var(--tw-ring-opacity));
	}

	.item > h2 {
		display: flex;
	}

	.trigger {
		display: flex;
		height: var(--tw-size-12);
		flex: 1 1 0%;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-white) / var(--tw-bg-opacity));
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		font-size: var(--tw-font-size-base);
		line-height: var(--tw-line-height-6);
		font-weight: var(--tw-font-weight-medium);
		line-height: var(--tw-line-height-none);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-magnum-700) / var(--tw-text-opacity));
		--tw-shadow: 0 1px 0;
		--tw-shadow-colored: 0 1px 0 var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.trigger:hover {
		--tw-bg-opacity: 0.95;
	}

	.content {
		overflow: hidden;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-neutral-100) / var(--tw-bg-opacity));
		font-size: var(--tw-font-size-sm);
		line-height: var(--tw-line-height-5);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-neutral-900) / var(--tw-text-opacity));
	}

	.content > div {
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		padding-top: var(--tw-size-4);
		padding-bottom: var(--tw-size-4);
	}
</style>
`,$e={"index.svelte":fe,"tailwind.config.ts":ie},ue={"index.svelte":de,"globals.css":re},me={component:ce,code:{Tailwind:$e,CSS:ue}};async function pe(){return{preview:me}}const dn=Object.freeze(Object.defineProperty({__proto__:null,load:pe},Symbol.toStringTag,{value:"Module"})),ge=`<div class="accordion-item" {...$item({ value: 'item-3', disabled: true })}>
    Item 3
</div>
`,_e=`<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';

	let value: string | string[] | undefined = 'item-1';
	let disabled = false;

	const {
		content,
		item,
		trigger,
		root,
		value: valueStore,
		options,
	} = createAccordion({
		value,
		disabled,
	});

	$: valueStore.set(value);
	valueStore.subscribe((v) => (value = v));
	$: options.update((o) => ({ ...o, disabled }));
<\/script>

<button
	on:click={() => {
		const randPick = Math.floor(Math.random() * 3) + 1;
		value = \`item-\${randPick}\`;
	}}
>
	Trigger randomly
</button>

<p>Value: {value} Value Store: {$valueStore}</p>

<div {...root}>
	<div {...$item('item-1')}>
		<button {...$trigger('item-1')} use:trigger.action>Is it accessible?</button>
		<div {...$content('item-1')}>
			<div>Yes. It adheres to the WAI-ARIA design pattern.</div>
		</div>
	</div>

	<div {...$item('item-2')}>
		<button {...$trigger('item-2')} use:trigger.action>Is it accessible?</button>
		<div {...$content('item-2')}>
			<div>Yes. It adheres to the WAI-ARIA design pattern.</div>
		</div>
	</div>

	<div {...$item('item-3')}>
		<button {...$trigger('item-3')} use:trigger.action>Is it accessible?</button>
		<div {...$content('item-3')}>
			<div>Yes. It adheres to the WAI-ARIA design pattern.</div>
		</div>
	</div>
</div>
`,qt={disable:ge,controlled:_e},ve={title:"CreateAccordionArgs",description:"The configuration object passed to the `createAccordion` builder function.",args:[{label:"type",type:["'single'","'multiple'"],default:"'single'"},{label:"disabled",type:"boolean",default:!1},{label:"value",type:["string","string[]","undefined"]}]},we={title:"Root",description:"Contains all the parts of an accordion.",dataAttributes:[{label:"[data-orientation]",value:['"vertical"','"horizontal"']}]},be={title:"Item",description:"Contains all the parts of a collapsible section.",args:[{label:"value",type:"string"},{label:"disabled",type:"boolean",default:!1}],dataAttributes:[{label:"[data-state]",value:['"open"','"closed"']},{label:"[data-disabled]",value:["true","undefined"]}]},he={title:"Trigger",description:"Toggles the collapsed state of an item. It should be nested inside of its associated `item`.",args:[{label:"type",type:['"single"','"multiple"'],default:"'single'"},{label:"disabled",type:"boolean",default:!1},{label:"value",type:["string","string[]","undefined"]}],dataAttributes:[{label:"[data-melt-part]",value:["trigger"]},{label:"[data-disabled]",value:["true","undefined"]},{label:"[data-value]",value:"The value of the associated item."}]},Ae={title:"Content",description:"Contains the collapsible content for an accordion item.",args:[{label:"value",type:"string"},{label:"disabled",type:"boolean",default:!1}],dataAttributes:[{label:"[data-state]",value:['"open"','"closed"']},{label:"[data-disabled]",value:["true","undefined"]}]},xe={title:"Keyboard Interactions",description:"",keyboardInteractions:[{key:"Space",description:"When the `trigger` of a collapsed section is focused, expands the section."},{key:"Enter",description:"When the `trigger` of a collapsed section is focused, expands the section."},{key:"Tab",description:"Moves focus to the next focusable element."},{key:"Shift + Tab",description:"Moves focus to the previous focusable element"},{key:"ArrowDown",description:"Moves focus to the next `trigger` element."},{key:"ArrowUp",description:"Moves focus to the previous `trigger` element."},{key:"Home",description:"When focus is on a `trigger`, moves focus to the first `trigger`."},{key:"End",description:"When focus is on a `trigger`, moves focus to the last `trigger`."}]},et={builder:ve,content:Ae,root:we,item:be,trigger:he,keyboard:xe};function Ie(a){let t;return{c(){t=A("Accordion")},l(n){t=x(n,"Accordion")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function ke(a){let t;return{c(){t=A(`A vertically stacked set of interactive headings that each reveal an associated section of
	content.`)},l(n){t=x(n,`A vertically stacked set of interactive headings that each reveal an associated section of
	content.`)},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function ye(a){let t;return{c(){t=A("Anatomy")},l(n){t=x(n,"Anatomy")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Ce(a){let t,n="Root:",o;return{c(){t=j("b"),t.textContent=n,o=A(" The root container for the accordion")},l(i){t=W(i,"B",{["data-svelte-h"]:!0}),xt(t)!=="svelte-ss75j2"&&(t.textContent=n),o=x(i," The root container for the accordion")},m(i,s){$(i,t,s),$(i,o,s)},p:st,d(i){i&&(d(t),d(o))}}}function Te(a){let t,n="Trigger:",o;return{c(){t=j("b"),t.textContent=n,o=A(" The trigger for the accordion item")},l(i){t=W(i,"B",{["data-svelte-h"]:!0}),xt(t)!=="svelte-1igo93q"&&(t.textContent=n),o=x(i," The trigger for the accordion item")},m(i,s){$(i,t,s),$(i,o,s)},p:st,d(i){i&&(d(t),d(o))}}}function ze(a){let t,n="Content:",o;return{c(){t=j("b"),t.textContent=n,o=A(" The content area that is revealed when the trigger is clicked")},l(i){t=W(i,"B",{["data-svelte-h"]:!0}),xt(t)!=="svelte-tk2yx7"&&(t.textContent=n),o=x(i," The content area that is revealed when the trigger is clicked")},m(i,s){$(i,t,s),$(i,o,s)},p:st,d(i){i&&(d(t),d(o))}}}function Pe(a){let t,n,o,i;return t=new b.Li({props:{$$slots:{default:[Te]},$$scope:{ctx:a}}}),o=new b.Li({props:{$$slots:{default:[ze]},$$scope:{ctx:a}}}),{c(){g(t.$$.fragment),n=k(),g(o.$$.fragment)},l(s){_(t.$$.fragment,s),n=y(s),_(o.$$.fragment,s)},m(s,r){v(t,s,r),$(s,n,r),v(o,s,r),i=!0},p(s,r){const f={};r&4&&(f.$$scope={dirty:r,ctx:s}),t.$set(f);const u={};r&4&&(u.$$scope={dirty:r,ctx:s}),o.$set(u)},i(s){i||(m(t.$$.fragment,s),m(o.$$.fragment,s),i=!0)},o(s){p(t.$$.fragment,s),p(o.$$.fragment,s),i=!1},d(s){s&&d(n),w(t,s),w(o,s)}}}function Se(a){let t,n="Item:",o,i,s;return i=new b.Ul({props:{$$slots:{default:[Pe]},$$scope:{ctx:a}}}),{c(){t=j("b"),t.textContent=n,o=A(` The container for each accordion item
		`),g(i.$$.fragment)},l(r){t=W(r,"B",{["data-svelte-h"]:!0}),xt(t)!=="svelte-1je5gc7"&&(t.textContent=n),o=x(r,` The container for each accordion item
		`),_(i.$$.fragment,r)},m(r,f){$(r,t,f),$(r,o,f),v(i,r,f),s=!0},p(r,f){const u={};f&4&&(u.$$scope={dirty:f,ctx:r}),i.$set(u)},i(r){s||(m(i.$$.fragment,r),s=!0)},o(r){p(i.$$.fragment,r),s=!1},d(r){r&&(d(t),d(o)),w(i,r)}}}function Ye(a){let t,n,o,i;return t=new b.Li({props:{$$slots:{default:[Ce]},$$scope:{ctx:a}}}),o=new b.Li({props:{$$slots:{default:[Se]},$$scope:{ctx:a}}}),{c(){g(t.$$.fragment),n=k(),g(o.$$.fragment)},l(s){_(t.$$.fragment,s),n=y(s),_(o.$$.fragment,s)},m(s,r){v(t,s,r),$(s,n,r),v(o,s,r),i=!0},p(s,r){const f={};r&4&&(f.$$scope={dirty:r,ctx:s}),t.$set(f);const u={};r&4&&(u.$$scope={dirty:r,ctx:s}),o.$set(u)},i(s){i||(m(t.$$.fragment,s),m(o.$$.fragment,s),i=!0)},o(s){p(t.$$.fragment,s),p(o.$$.fragment,s),i=!1},d(s){s&&d(n),w(t,s),w(o,s)}}}function Re(a){let t;return{c(){t=A("Usage")},l(n){t=x(n,"Usage")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function je(a){let t;return{c(){t=A("createAccordion")},l(n){t=x(n,"createAccordion")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function We(a){let t,n,o,i;return n=new b.Code({props:{$$slots:{default:[je]},$$scope:{ctx:a}}}),{c(){t=A("To create an accordion, use the "),g(n.$$.fragment),o=A(` builder function. Follow the
	anatomy or the example above to create your accordion.`)},l(s){t=x(s,"To create an accordion, use the "),_(n.$$.fragment,s),o=x(s,` builder function. Follow the
	anatomy or the example above to create your accordion.`)},m(s,r){$(s,t,r),v(n,s,r),$(s,o,r),i=!0},p(s,r){const f={};r&4&&(f.$$scope={dirty:r,ctx:s}),n.$set(f)},i(s){i||(m(n.$$.fragment,s),i=!0)},o(s){p(n.$$.fragment,s),i=!1},d(s){s&&(d(t),d(o)),w(n,s)}}}function De(a){let t;return{c(){t=A("Disabling a single item")},l(n){t=x(n,"Disabling a single item")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function He(a){let t;return{c(){t=A("To disable a single item, you can pass in an object instead of a string to the function.")},l(n){t=x(n,"To disable a single item, you can pass in an object instead of a string to the function.")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Ee(a){let t;return{c(){t=A("Opening multiple items at once")},l(n){t=x(n,"Opening multiple items at once")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Me(a){let t;return{c(){t=A("type")},l(n){t=x(n,"type")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Be(a){let t;return{c(){t=A("createAccordion")},l(n){t=x(n,"createAccordion")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Oe(a){let t;return{c(){t=A("'multiple'")},l(n){t=x(n,"'multiple'")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Ue(a){let t,n,o,i,s,r,f,u;return n=new b.Code({props:{$$slots:{default:[Me]},$$scope:{ctx:a}}}),i=new b.Code({props:{$$slots:{default:[Be]},$$scope:{ctx:a}}}),r=new b.Code({props:{$$slots:{default:[Oe]},$$scope:{ctx:a}}}),{c(){t=A("Pass in the "),g(n.$$.fragment),o=A(" arg to "),g(i.$$.fragment),s=A(` with a value
	of `),g(r.$$.fragment),f=A(".")},l(c){t=x(c,"Pass in the "),_(n.$$.fragment,c),o=x(c," arg to "),_(i.$$.fragment,c),s=x(c,` with a value
	of `),_(r.$$.fragment,c),f=x(c,".")},m(c,h){$(c,t,h),v(n,c,h),$(c,o,h),v(i,c,h),$(c,s,h),v(r,c,h),$(c,f,h),u=!0},p(c,h){const z={};h&4&&(z.$$scope={dirty:h,ctx:c}),n.$set(z);const S={};h&4&&(S.$$scope={dirty:h,ctx:c}),i.$set(S);const C={};h&4&&(C.$$scope={dirty:h,ctx:c}),r.$set(C)},i(c){u||(m(n.$$.fragment,c),m(i.$$.fragment,c),m(r.$$.fragment,c),u=!0)},o(c){p(n.$$.fragment,c),p(i.$$.fragment,c),p(r.$$.fragment,c),u=!1},d(c){c&&(d(t),d(o),d(s),d(f)),w(n,c),w(i,c),w(r,c)}}}function Ve(a){let t;return{c(){t=A("Controlled access")},l(n){t=x(n,"Controlled access")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Fe(a){let t;return{c(){t=A("value")},l(n){t=x(n,"value")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Le(a){let t;return{c(){t=A("options")},l(n){t=x(n,"options")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function qe(a){let t,n,o,i,s,r;return n=new b.Code({props:{$$slots:{default:[Fe]},$$scope:{ctx:a}}}),i=new b.Code({props:{$$slots:{default:[Le]},$$scope:{ctx:a}}}),{c(){t=A("To programatically control the Accordion, you can directly set the "),g(n.$$.fragment),o=A(` store.
	You can also update the `),g(i.$$.fragment),s=A(" store with new arguments.")},l(f){t=x(f,"To programatically control the Accordion, you can directly set the "),_(n.$$.fragment,f),o=x(f,` store.
	You can also update the `),_(i.$$.fragment,f),s=x(f," store with new arguments.")},m(f,u){$(f,t,u),v(n,f,u),$(f,o,u),v(i,f,u),$(f,s,u),r=!0},p(f,u){const c={};u&4&&(c.$$scope={dirty:u,ctx:f}),n.$set(c);const h={};u&4&&(h.$$scope={dirty:u,ctx:f}),i.$set(h)},i(f){r||(m(n.$$.fragment,f),m(i.$$.fragment,f),r=!0)},o(f){p(n.$$.fragment,f),p(i.$$.fragment,f),r=!1},d(f){f&&(d(t),d(o),d(s)),w(n,f),w(i,f)}}}function Ge(a){let t;return{c(){t=A("API Reference")},l(n){t=x(n,"API Reference")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Ne(a){let t;return{c(){t=A("Accessibility")},l(n){t=x(n,"Accessibility")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Je(a){let t;return{c(){t=A("Accordion WAI-ARIA design pattern")},l(n){t=x(n,"Accordion WAI-ARIA design pattern")},m(n,o){$(n,t,o)},d(n){n&&d(t)}}}function Ke(a){let t,n,o;return n=new b.A({props:{href:"https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",$$slots:{default:[Je]},$$scope:{ctx:a}}}),{c(){t=A(`Adheres to the
	`),g(n.$$.fragment)},l(i){t=x(i,`Adheres to the
	`),_(n.$$.fragment,i)},m(i,s){$(i,t,s),v(n,i,s),o=!0},p(i,s){const r={};s&4&&(r.$$scope={dirty:s,ctx:i}),n.$set(r)},i(i){o||(m(n.$$.fragment,i),o=!0)},o(i){p(n.$$.fragment,i),o=!1},d(i){i&&d(t),w(n,i)}}}function Qe(a){let t,n,o,i,s,r,f,u,c,h,z,S,C,T,Y,D,I,P,R,F,L,it,H,rt,E,at,M,lt,B,ct,q,ft,O,dt,G,$t,N,ut,J,mt,K,pt,Q,gt,U,_t,V,vt,X,wt;t=new b.H1({props:{$$slots:{default:[Ie]},$$scope:{ctx:a}}}),o=new b.Description({props:{$$slots:{default:[ke]},$$scope:{ctx:a}}});const bt=[a[0].preview,{fullwidth:!0}];let It={};for(let e=0;e<bt.length;e+=1)It=ot(It,bt[e]);return s=new b.Preview({props:It}),f=new b.Features({props:{features:a[1]}}),c=new b.H2({props:{$$slots:{default:[ye]},$$scope:{ctx:a}}}),z=new b.Ul({props:{$$slots:{default:[Ye]},$$scope:{ctx:a}}}),C=new b.H2({props:{$$slots:{default:[Re]},$$scope:{ctx:a}}}),Y=new b.P({props:{$$slots:{default:[We]},$$scope:{ctx:a}}}),I=new b.H3({props:{$$slots:{default:[De]},$$scope:{ctx:a}}}),R=new b.P({props:{$$slots:{default:[He]},$$scope:{ctx:a}}}),L=new b.CodeBlock({props:{code:qt.disable}}),H=new b.H3({props:{$$slots:{default:[Ee]},$$scope:{ctx:a}}}),E=new b.P({props:{$$slots:{default:[Ue]},$$scope:{ctx:a}}}),M=new b.H3({props:{$$slots:{default:[Ve]},$$scope:{ctx:a}}}),B=new b.P({props:{$$slots:{default:[qe]},$$scope:{ctx:a}}}),q=new b.CodeBlock({props:{code:qt.controlled}}),O=new b.H2({props:{$$slots:{default:[Ge]},$$scope:{ctx:a}}}),G=new b.API({props:{schema:et.builder}}),N=new b.API({props:{schema:et.root}}),J=new b.API({props:{schema:et.item}}),K=new b.API({props:{schema:et.trigger}}),Q=new b.API({props:{schema:et.content}}),U=new b.H2({props:{$$slots:{default:[Ne]},$$scope:{ctx:a}}}),V=new b.P({props:{$$slots:{default:[Ke]},$$scope:{ctx:a}}}),X=new b.API({props:{schema:et.keyboard}}),{c(){g(t.$$.fragment),n=k(),g(o.$$.fragment),i=k(),g(s.$$.fragment),r=k(),g(f.$$.fragment),u=k(),g(c.$$.fragment),h=k(),g(z.$$.fragment),S=k(),g(C.$$.fragment),T=k(),g(Y.$$.fragment),D=k(),g(I.$$.fragment),P=k(),g(R.$$.fragment),F=k(),g(L.$$.fragment),it=k(),g(H.$$.fragment),rt=k(),g(E.$$.fragment),at=k(),g(M.$$.fragment),lt=k(),g(B.$$.fragment),ct=k(),g(q.$$.fragment),ft=k(),g(O.$$.fragment),dt=k(),g(G.$$.fragment),$t=k(),g(N.$$.fragment),ut=k(),g(J.$$.fragment),mt=k(),g(K.$$.fragment),pt=k(),g(Q.$$.fragment),gt=k(),g(U.$$.fragment),_t=k(),g(V.$$.fragment),vt=k(),g(X.$$.fragment)},l(e){_(t.$$.fragment,e),n=y(e),_(o.$$.fragment,e),i=y(e),_(s.$$.fragment,e),r=y(e),_(f.$$.fragment,e),u=y(e),_(c.$$.fragment,e),h=y(e),_(z.$$.fragment,e),S=y(e),_(C.$$.fragment,e),T=y(e),_(Y.$$.fragment,e),D=y(e),_(I.$$.fragment,e),P=y(e),_(R.$$.fragment,e),F=y(e),_(L.$$.fragment,e),it=y(e),_(H.$$.fragment,e),rt=y(e),_(E.$$.fragment,e),at=y(e),_(M.$$.fragment,e),lt=y(e),_(B.$$.fragment,e),ct=y(e),_(q.$$.fragment,e),ft=y(e),_(O.$$.fragment,e),dt=y(e),_(G.$$.fragment,e),$t=y(e),_(N.$$.fragment,e),ut=y(e),_(J.$$.fragment,e),mt=y(e),_(K.$$.fragment,e),pt=y(e),_(Q.$$.fragment,e),gt=y(e),_(U.$$.fragment,e),_t=y(e),_(V.$$.fragment,e),vt=y(e),_(X.$$.fragment,e)},m(e,l){v(t,e,l),$(e,n,l),v(o,e,l),$(e,i,l),v(s,e,l),$(e,r,l),v(f,e,l),$(e,u,l),v(c,e,l),$(e,h,l),v(z,e,l),$(e,S,l),v(C,e,l),$(e,T,l),v(Y,e,l),$(e,D,l),v(I,e,l),$(e,P,l),v(R,e,l),$(e,F,l),v(L,e,l),$(e,it,l),v(H,e,l),$(e,rt,l),v(E,e,l),$(e,at,l),v(M,e,l),$(e,lt,l),v(B,e,l),$(e,ct,l),v(q,e,l),$(e,ft,l),v(O,e,l),$(e,dt,l),v(G,e,l),$(e,$t,l),v(N,e,l),$(e,ut,l),v(J,e,l),$(e,mt,l),v(K,e,l),$(e,pt,l),v(Q,e,l),$(e,gt,l),v(U,e,l),$(e,_t,l),v(V,e,l),$(e,vt,l),v(X,e,l),wt=!0},p(e,[l]){const kt={};l&4&&(kt.$$scope={dirty:l,ctx:e}),t.$set(kt);const yt={};l&4&&(yt.$$scope={dirty:l,ctx:e}),o.$set(yt);const Qt=l&1?At(bt,[oe(e[0].preview),bt[1]]):{};s.$set(Qt);const Ct={};l&4&&(Ct.$$scope={dirty:l,ctx:e}),c.$set(Ct);const Tt={};l&4&&(Tt.$$scope={dirty:l,ctx:e}),z.$set(Tt);const zt={};l&4&&(zt.$$scope={dirty:l,ctx:e}),C.$set(zt);const Pt={};l&4&&(Pt.$$scope={dirty:l,ctx:e}),Y.$set(Pt);const St={};l&4&&(St.$$scope={dirty:l,ctx:e}),I.$set(St);const Yt={};l&4&&(Yt.$$scope={dirty:l,ctx:e}),R.$set(Yt);const Rt={};l&4&&(Rt.$$scope={dirty:l,ctx:e}),H.$set(Rt);const jt={};l&4&&(jt.$$scope={dirty:l,ctx:e}),E.$set(jt);const Wt={};l&4&&(Wt.$$scope={dirty:l,ctx:e}),M.$set(Wt);const Dt={};l&4&&(Dt.$$scope={dirty:l,ctx:e}),B.$set(Dt);const Ht={};l&4&&(Ht.$$scope={dirty:l,ctx:e}),O.$set(Ht);const Et={};l&4&&(Et.$$scope={dirty:l,ctx:e}),U.$set(Et);const Mt={};l&4&&(Mt.$$scope={dirty:l,ctx:e}),V.$set(Mt)},i(e){wt||(m(t.$$.fragment,e),m(o.$$.fragment,e),m(s.$$.fragment,e),m(f.$$.fragment,e),m(c.$$.fragment,e),m(z.$$.fragment,e),m(C.$$.fragment,e),m(Y.$$.fragment,e),m(I.$$.fragment,e),m(R.$$.fragment,e),m(L.$$.fragment,e),m(H.$$.fragment,e),m(E.$$.fragment,e),m(M.$$.fragment,e),m(B.$$.fragment,e),m(q.$$.fragment,e),m(O.$$.fragment,e),m(G.$$.fragment,e),m(N.$$.fragment,e),m(J.$$.fragment,e),m(K.$$.fragment,e),m(Q.$$.fragment,e),m(U.$$.fragment,e),m(V.$$.fragment,e),m(X.$$.fragment,e),wt=!0)},o(e){p(t.$$.fragment,e),p(o.$$.fragment,e),p(s.$$.fragment,e),p(f.$$.fragment,e),p(c.$$.fragment,e),p(z.$$.fragment,e),p(C.$$.fragment,e),p(Y.$$.fragment,e),p(I.$$.fragment,e),p(R.$$.fragment,e),p(L.$$.fragment,e),p(H.$$.fragment,e),p(E.$$.fragment,e),p(M.$$.fragment,e),p(B.$$.fragment,e),p(q.$$.fragment,e),p(O.$$.fragment,e),p(G.$$.fragment,e),p(N.$$.fragment,e),p(J.$$.fragment,e),p(K.$$.fragment,e),p(Q.$$.fragment,e),p(U.$$.fragment,e),p(V.$$.fragment,e),p(X.$$.fragment,e),wt=!1},d(e){e&&(d(n),d(i),d(r),d(u),d(h),d(S),d(T),d(D),d(P),d(F),d(it),d(rt),d(at),d(lt),d(ct),d(ft),d(dt),d($t),d(ut),d(mt),d(pt),d(gt),d(_t),d(vt)),w(t,e),w(o,e),w(s,e),w(f,e),w(c,e),w(z,e),w(C,e),w(Y,e),w(I,e),w(R,e),w(L,e),w(H,e),w(E,e),w(M,e),w(B,e),w(q,e),w(O,e),w(G,e),w(N,e),w(J,e),w(K,e),w(Q,e),w(U,e),w(V,e),w(X,e)}}}function Xe(a,t,n){let{data:o}=t;const i=["Full keyboard navigation","Can expand one or multiple items","Can be controlled or uncontrolled"];return a.$$set=s=>{"data"in s&&n(0,o=s.data)},[o,i]}class $n extends Jt{constructor(t){super(),Kt(this,t,Xe,Qe,Gt,{data:0})}}export{$n as component,dn as universal};
