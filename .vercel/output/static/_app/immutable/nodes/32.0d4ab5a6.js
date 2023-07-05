import{s as ht,a as y,d as h,i as a,f as i,t as w,k as v,l as yt}from"../chunks/scheduler.2943ef39.js";import{S as Ct,i as St,c as m,a as _,m as d,t as c,b as u,d as g,g as Tt,e as Bt}from"../chunks/index.c70d9825.js";import{D as b}from"../chunks/index.5e8f8c6b.js";const It=`<script>
	import { createCollapsible } from '@melt-ui/svelte';
	const { open, root, content, trigger } = createCollapsible();
<\/script>

<div {...$root}>
	<button {...$trigger} use:trigger.action>{$open ? 'Close' : 'Open'}</button>
	<div {...$content}>Obi-Wan says: Hello there!</div>
</div>
`,At=`<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import Button from '$components/button.svelte';
	const { open, root, content, trigger } = createCollapsible();
<\/script>

<!-- Using Svelte Scoped Styles -->
<div class="root" {...$root}>
	<!-- Using an external component -->
	<Button on:click={() => console.log('clicked')} {...$trigger} action={trigger.action}>
		{$open ? 'Close' : 'Open'}
	</Button>
	<!-- Using an utility class library, such as Tailwind -->
	<div class="rounded-md p-4 text-orange-500 shadow-sm" {...$content}>
		Obi-Wan says: Hello there!
	</div>
</div>


<style>
    .root {
        display: flex;
        flex-direction: column;
    }
</style>

<!-- Button.svelte -->

<script lang="ts">
	import type { Action } from 'svelte/action';
    export let action: Action
<\/script>

<button use:action>
    <slot />
</button>`,Ut=`<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';

	const { root, content, trigger } = createCollapsible();
<\/script>

<div {...$root}>
	<button {...$trigger} use:trigger.action> Toggle </button>

	<div class="content" {...$content}>
		<p>sveltejs/svelte</p>
		<p>sveltejs/kit</p>
	</div>
</div>

<style>
	.content {
		display: block !important; /* Ignore the hidden attribute */
		transition: opacity 200ms ease;
	}

	.content[data-state='closed'] {
		opacity: 0;
	}
</style>
`,Ht=`<script lang="ts">
	import { createCollapsible } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { root, content, trigger, open } = createCollapsible();
<\/script>

<div {...$root}>
	<button {...$trigger} use:trigger.action> Toggle </button>

	{#if $open}
		<div class="content" {...$content} transition:slide|local>
			<p>sveltejs/svelte</p>
			<p>sveltejs/kit</p>
		</div>
	{/if}
</div>

<style>
	.content {
		display: block !important; /* Ignore the hidden attribute */
		transition: opacity 200ms ease;
	}

	.content[data-state='closed'] {
		opacity: 0;
	}
</style>
`,ot={builder:It,extensible:At,animation:Ut,svelteTransitions:Ht};function Mt($){let n;return{c(){n=w("Getting Started")},l(t){n=v(t,"Getting Started")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Pt($){let n;return{c(){n=w("Just a few steps to start using MeltUI in your projects")},l(t){n=v(t,"Just a few steps to start using MeltUI in your projects")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function jt($){let n;return{c(){n=w("Installation")},l(t){n=v(t,"Installation")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Dt($){let n;return{c(){n=w(`Alright, let's get started! To install Melt UI into your project, simply run this command in your
	terminal:`)},l(t){n=v(t,`Alright, let's get started! To install Melt UI into your project, simply run this command in your
	terminal:`)},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Ot($){let n,t;return n=new b.CodeBlock({props:{code:"pnpm install @melt-ui/svelte"}}),{c(){m(n.$$.fragment)},l(s){_(n.$$.fragment,s)},m(s,f){d(n,s,f),t=!0},i(s){t||(c(n.$$.fragment,s),t=!0)},o(s){u(n.$$.fragment,s),t=!1},d(s){g(n,s)}}}function xt($){let n,t;return n=new b.CodeBlock({props:{code:"yarn add @melt-ui/svelte"}}),{c(){m(n.$$.fragment)},l(s){_(n.$$.fragment,s)},m(s,f){d(n,s,f),t=!0},i(s){t||(c(n.$$.fragment,s),t=!0)},o(s){u(n.$$.fragment,s),t=!1},d(s){g(n,s)}}}function Yt($){let n,t;return n=new b.CodeBlock({props:{code:"npm install @melt-ui/svelte"}}),{c(){m(n.$$.fragment)},l(s){_(n.$$.fragment,s)},m(s,f){d(n,s,f),t=!0},i(s){t||(c(n.$$.fragment,s),t=!0)},o(s){u(n.$$.fragment,s),t=!1},d(s){g(n,s)}}}function zt($){let n,t,s,f;const l=[Yt,xt,Ot],r=[];function p(k,C){return k[0]==="npm"?0:k[0]==="yarn"?1:k[0]==="pnpm"?2:-1}return~(n=p($))&&(t=r[n]=l[n]($)),{c(){t&&t.c(),s=yt()},l(k){t&&t.l(k),s=yt()},m(k,C){~n&&r[n].m(k,C),a(k,s,C),f=!0},p(k,C){let S=n;n=p(k),n!==S&&(t&&(Tt(),u(r[S],1,1,()=>{r[S]=null}),Bt()),~n?(t=r[n],t||(t=r[n]=l[n](k),t.c()),c(t,1),t.m(s.parentNode,s)):t=null)},i(k){f||(c(t),f=!0)},o(k){u(t),f=!1},d(k){k&&i(s),~n&&r[n].d(k)}}}function Gt($){let n;return{c(){n=w("P.S. These tabs were built using Melt! Try using them with Arrow keys.")},l(t){n=v(t,"P.S. These tabs were built using Melt! Try using them with Arrow keys.")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Wt($){let n;return{c(){n=w("Usage")},l(t){n=v(t,"Usage")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function qt($){let n;return{c(){n=w("Melt UI exposes a number of component builders. Say you want a Collapsible component:")},l(t){n=v(t,"Melt UI exposes a number of component builders. Say you want a Collapsible component:")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Nt($){let n;return{c(){n=w("createCollapsible")},l(t){n=v(t,"createCollapsible")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Jt($){let n;return{c(){n=w("Accordion")},l(t){n=v(t,"Accordion")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Qt($){let n,t,s,f;return t=new b.A({props:{href:"/docs/builders/accordion",internal:!0,$$slots:{default:[Jt]},$$scope:{ctx:$}}}),{c(){n=w(`Be careful! That is not always the case. Sometimes stores also return functions, which may or
		may not expect an attribute. One such example is the `),m(t.$$.fragment),s=w(" builder.")},l(l){n=v(l,`Be careful! That is not always the case. Sometimes stores also return functions, which may or
		may not expect an attribute. One such example is the `),_(t.$$.fragment,l),s=v(l," builder.")},m(l,r){a(l,n,r),d(t,l,r),a(l,s,r),f=!0},p(l,r){const p={};r&2&&(p.$$scope={dirty:r,ctx:l}),t.$set(p)},i(l){f||(c(t.$$.fragment,l),f=!0)},o(l){u(t.$$.fragment,l),f=!1},d(l){l&&(i(n),i(s)),g(t,l)}}}function Zt($){let n,t,s,f,l;return t=new b.Code({props:{$$slots:{default:[Nt]},$$scope:{ctx:$}}}),f=new b.Callout({props:{type:"danger",$$slots:{default:[Qt]},$$scope:{ctx:$}}}),{c(){n=w("You'll see that "),m(t.$$.fragment),s=w(`
	exposes a number of stores.

	`),m(f.$$.fragment)},l(r){n=v(r,"You'll see that "),_(t.$$.fragment,r),s=v(r,`
	exposes a number of stores.

	`),_(f.$$.fragment,r)},m(r,p){a(r,n,p),d(t,r,p),a(r,s,p),d(f,r,p),l=!0},p(r,p){const k={};p&2&&(k.$$scope={dirty:p,ctx:r}),t.$set(k);const C={};p&2&&(C.$$scope={dirty:p,ctx:r}),f.$set(C)},i(r){l||(c(t.$$.fragment,r),c(f.$$.fragment,r),l=!0)},o(r){u(t.$$.fragment,r),u(f.$$.fragment,r),l=!1},d(r){r&&(i(n),i(s)),g(t,r),g(f,r)}}}function Et($){let n;return{c(){n=w("Styling")},l(t){n=v(t,"Styling")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Ft($){let n;return{c(){n=w(`Melt UI leaves the styles up to you. Whether you prefer scoped or global CSS, a utility framework
	like Tailwind, or third-party components (as long as you can pass in Melt's props), it's all good.`)},l(t){n=v(t,`Melt UI leaves the styles up to you. Whether you prefer scoped or global CSS, a utility framework
	like Tailwind, or third-party components (as long as you can pass in Melt's props), it's all good.`)},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Kt($){let n;return{c(){n=w("Animating")},l(t){n=v(t,"Animating")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Lt($){let n;return{c(){n=w(`By passing builder returned props to an element, certain data and aria attributes will
	automatically be altered for you. These changes can then be utilized for animation purposes,
	should you desire to do so.`)},l(t){n=v(t,`By passing builder returned props to an element, certain data and aria attributes will
	automatically be altered for you. These changes can then be utilized for animation purposes,
	should you desire to do so.`)},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Rt($){let n;return{c(){n=w(`Svelte transitions can also be utilized. However, it is important to note that this may interfere
	with default functionality in particular components, such as focus management, so proceed with
	caution.`)},l(t){n=v(t,`Svelte transitions can also be utilized. However, it is important to note that this may interfere
	with default functionality in particular components, such as focus management, so proceed with
	caution.`)},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Vt($){let n;return{c(){n=w("Need help?")},l(t){n=v(t,"Need help?")},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function Xt($){let n;return{c(){n=w(`open an issue up on GitHub
	`)},l(t){n=v(t,`open an issue up on GitHub
	`)},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function te($){let n,t,s,f;return t=new b.A({props:{href:"https://github.com/melt-ui/melt-ui/issues/new/choose",$$slots:{default:[Xt]},$$scope:{ctx:$}}}),{c(){n=w(`In case you've run into a bug, an unexpected behaviour, or would like to request new features,
	feel free to `),m(t.$$.fragment),s=w(".")},l(l){n=v(l,`In case you've run into a bug, an unexpected behaviour, or would like to request new features,
	feel free to `),_(t.$$.fragment,l),s=v(l,".")},m(l,r){a(l,n,r),d(t,l,r),a(l,s,r),f=!0},p(l,r){const p={};r&2&&(p.$$scope={dirty:r,ctx:l}),t.$set(p)},i(l){f||(c(t.$$.fragment,l),f=!0)},o(l){u(t.$$.fragment,l),f=!1},d(l){l&&(i(n),i(s)),g(t,l)}}}function ee($){let n;return{c(){n=w(`Discord
	`)},l(t){n=v(t,`Discord
	`)},m(t,s){a(t,n,s)},d(t){t&&i(n)}}}function ne($){let n,t,s,f;return t=new b.A({props:{href:"https://discord.com/invite/2QDjZkYunf",$$slots:{default:[ee]},$$scope:{ctx:$}}}),{c(){n=w("You can also reach out to us over on "),m(t.$$.fragment),s=w(".")},l(l){n=v(l,"You can also reach out to us over on "),_(t.$$.fragment,l),s=v(l,".")},m(l,r){a(l,n,r),d(t,l,r),a(l,s,r),f=!0},p(l,r){const p={};r&2&&(p.$$scope={dirty:r,ctx:l}),t.$set(p)},i(l){f||(c(t.$$.fragment,l),f=!0)},o(l){u(t.$$.fragment,l),f=!1},d(l){l&&(i(n),i(s)),g(t,l)}}}function se($){let n,t,s,f,l,r,p,k,C,S,T,q,B,N,I,J,Y,Q,A,Z,U,E,H,F,z,K,M,L,P,R,G,V,j,X,W,tt,D,et,O,nt,x,st;return n=new b.H1({props:{$$slots:{default:[Mt]},$$scope:{ctx:$}}}),s=new b.Description({props:{$$slots:{default:[Pt]},$$scope:{ctx:$}}}),l=new b.H2({props:{$$slots:{default:[jt]},$$scope:{ctx:$}}}),p=new b.P({props:{class:"mb-2",$$slots:{default:[Dt]},$$scope:{ctx:$}}}),C=new b.Tabs({props:{tabs:["npm","yarn","pnpm"],$$slots:{default:[zt,({tab:e})=>({0:e}),({tab:e})=>e?1:0]},$$scope:{ctx:$}}}),T=new b.Callout({props:{$$slots:{default:[Gt]},$$scope:{ctx:$}}}),B=new b.H2({props:{$$slots:{default:[Wt]},$$scope:{ctx:$}}}),I=new b.P({props:{$$slots:{default:[qt]},$$scope:{ctx:$}}}),Y=new b.CodeBlock({props:{code:ot.builder}}),A=new b.P({props:{$$slots:{default:[Zt]},$$scope:{ctx:$}}}),U=new b.H3({props:{$$slots:{default:[Et]},$$scope:{ctx:$}}}),H=new b.P({props:{$$slots:{default:[Ft]},$$scope:{ctx:$}}}),z=new b.CodeBlock({props:{code:ot.extensible}}),M=new b.H3({props:{$$slots:{default:[Kt]},$$scope:{ctx:$}}}),P=new b.P({props:{$$slots:{default:[Lt]},$$scope:{ctx:$}}}),G=new b.CodeBlock({props:{code:ot.animation}}),j=new b.Callout({props:{$$slots:{default:[Rt]},$$scope:{ctx:$}}}),W=new b.CodeBlock({props:{code:ot.svelteTransitions}}),D=new b.H2({props:{$$slots:{default:[Vt]},$$scope:{ctx:$}}}),O=new b.P({props:{$$slots:{default:[te]},$$scope:{ctx:$}}}),x=new b.P({props:{$$slots:{default:[ne]},$$scope:{ctx:$}}}),{c(){m(n.$$.fragment),t=y(),m(s.$$.fragment),f=y(),m(l.$$.fragment),r=y(),m(p.$$.fragment),k=y(),m(C.$$.fragment),S=y(),m(T.$$.fragment),q=y(),m(B.$$.fragment),N=y(),m(I.$$.fragment),J=y(),m(Y.$$.fragment),Q=y(),m(A.$$.fragment),Z=y(),m(U.$$.fragment),E=y(),m(H.$$.fragment),F=y(),m(z.$$.fragment),K=y(),m(M.$$.fragment),L=y(),m(P.$$.fragment),R=y(),m(G.$$.fragment),V=y(),m(j.$$.fragment),X=y(),m(W.$$.fragment),tt=y(),m(D.$$.fragment),et=y(),m(O.$$.fragment),nt=y(),m(x.$$.fragment)},l(e){_(n.$$.fragment,e),t=h(e),_(s.$$.fragment,e),f=h(e),_(l.$$.fragment,e),r=h(e),_(p.$$.fragment,e),k=h(e),_(C.$$.fragment,e),S=h(e),_(T.$$.fragment,e),q=h(e),_(B.$$.fragment,e),N=h(e),_(I.$$.fragment,e),J=h(e),_(Y.$$.fragment,e),Q=h(e),_(A.$$.fragment,e),Z=h(e),_(U.$$.fragment,e),E=h(e),_(H.$$.fragment,e),F=h(e),_(z.$$.fragment,e),K=h(e),_(M.$$.fragment,e),L=h(e),_(P.$$.fragment,e),R=h(e),_(G.$$.fragment,e),V=h(e),_(j.$$.fragment,e),X=h(e),_(W.$$.fragment,e),tt=h(e),_(D.$$.fragment,e),et=h(e),_(O.$$.fragment,e),nt=h(e),_(x.$$.fragment,e)},m(e,o){d(n,e,o),a(e,t,o),d(s,e,o),a(e,f,o),d(l,e,o),a(e,r,o),d(p,e,o),a(e,k,o),d(C,e,o),a(e,S,o),d(T,e,o),a(e,q,o),d(B,e,o),a(e,N,o),d(I,e,o),a(e,J,o),d(Y,e,o),a(e,Q,o),d(A,e,o),a(e,Z,o),d(U,e,o),a(e,E,o),d(H,e,o),a(e,F,o),d(z,e,o),a(e,K,o),d(M,e,o),a(e,L,o),d(P,e,o),a(e,R,o),d(G,e,o),a(e,V,o),d(j,e,o),a(e,X,o),d(W,e,o),a(e,tt,o),d(D,e,o),a(e,et,o),d(O,e,o),a(e,nt,o),d(x,e,o),st=!0},p(e,[o]){const lt={};o&2&&(lt.$$scope={dirty:o,ctx:e}),n.$set(lt);const rt={};o&2&&(rt.$$scope={dirty:o,ctx:e}),s.$set(rt);const $t={};o&2&&($t.$$scope={dirty:o,ctx:e}),l.$set($t);const at={};o&2&&(at.$$scope={dirty:o,ctx:e}),p.$set(at);const it={};o&3&&(it.$$scope={dirty:o,ctx:e}),C.$set(it);const ft={};o&2&&(ft.$$scope={dirty:o,ctx:e}),T.$set(ft);const ct={};o&2&&(ct.$$scope={dirty:o,ctx:e}),B.$set(ct);const ut={};o&2&&(ut.$$scope={dirty:o,ctx:e}),I.$set(ut);const pt={};o&2&&(pt.$$scope={dirty:o,ctx:e}),A.$set(pt);const mt={};o&2&&(mt.$$scope={dirty:o,ctx:e}),U.$set(mt);const _t={};o&2&&(_t.$$scope={dirty:o,ctx:e}),H.$set(_t);const dt={};o&2&&(dt.$$scope={dirty:o,ctx:e}),M.$set(dt);const gt={};o&2&&(gt.$$scope={dirty:o,ctx:e}),P.$set(gt);const bt={};o&2&&(bt.$$scope={dirty:o,ctx:e}),j.$set(bt);const wt={};o&2&&(wt.$$scope={dirty:o,ctx:e}),D.$set(wt);const vt={};o&2&&(vt.$$scope={dirty:o,ctx:e}),O.$set(vt);const kt={};o&2&&(kt.$$scope={dirty:o,ctx:e}),x.$set(kt)},i(e){st||(c(n.$$.fragment,e),c(s.$$.fragment,e),c(l.$$.fragment,e),c(p.$$.fragment,e),c(C.$$.fragment,e),c(T.$$.fragment,e),c(B.$$.fragment,e),c(I.$$.fragment,e),c(Y.$$.fragment,e),c(A.$$.fragment,e),c(U.$$.fragment,e),c(H.$$.fragment,e),c(z.$$.fragment,e),c(M.$$.fragment,e),c(P.$$.fragment,e),c(G.$$.fragment,e),c(j.$$.fragment,e),c(W.$$.fragment,e),c(D.$$.fragment,e),c(O.$$.fragment,e),c(x.$$.fragment,e),st=!0)},o(e){u(n.$$.fragment,e),u(s.$$.fragment,e),u(l.$$.fragment,e),u(p.$$.fragment,e),u(C.$$.fragment,e),u(T.$$.fragment,e),u(B.$$.fragment,e),u(I.$$.fragment,e),u(Y.$$.fragment,e),u(A.$$.fragment,e),u(U.$$.fragment,e),u(H.$$.fragment,e),u(z.$$.fragment,e),u(M.$$.fragment,e),u(P.$$.fragment,e),u(G.$$.fragment,e),u(j.$$.fragment,e),u(W.$$.fragment,e),u(D.$$.fragment,e),u(O.$$.fragment,e),u(x.$$.fragment,e),st=!1},d(e){e&&(i(t),i(f),i(r),i(k),i(S),i(q),i(N),i(J),i(Q),i(Z),i(E),i(F),i(K),i(L),i(R),i(V),i(X),i(tt),i(et),i(nt)),g(n,e),g(s,e),g(l,e),g(p,e),g(C,e),g(T,e),g(B,e),g(I,e),g(Y,e),g(A,e),g(U,e),g(H,e),g(z,e),g(M,e),g(P,e),g(G,e),g(j,e),g(W,e),g(D,e),g(O,e),g(x,e)}}}class $e extends Ct{constructor(n){super(),St(this,n,null,se,ht,{})}}export{$e as component};
