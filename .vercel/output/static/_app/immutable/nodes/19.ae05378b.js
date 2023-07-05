import{T as Pt}from"../chunks/tailwind.config.ebd62547.js";import{s as xt,n as J,e as M,a as P,l as bt,c as U,b as st,d as k,g as X,f,h as yt,J as z,W as L,i as $,j as V,u as it,N as et,O as kt,y as It,t as H,k as j,A as ot}from"../chunks/scheduler.2943ef39.js";import{S as At,i as Ct,c as h,a as x,m as y,t as _,g as St,b,e as Ht,d as A,f as vt}from"../chunks/index.c70d9825.js";import{g as lt,a as jt}from"../chunks/spread.8a54911c.js";import"../chunks/index.a1398546.js";import{S as Dt,c as Wt}from"../chunks/settings2.04ee13c3.js";import{f as wt}from"../chunks/index.8e0124f5.js";import{X as Mt}from"../chunks/x.416fe3b7.js";import{D as T}from"../chunks/index.5e8f8c6b.js";const Ut=`<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import { Settings2, X } from 'icons';

	const { trigger, content, open, arrow, close } = createPopover();
<\/script>

<button
	type="button"
	class="trigger"
	{...$trigger}
	use:trigger.action
	aria-label="Update dimensions"
>
	<Settings2 class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

{#if $open}
	<div {...$content} use:content.action transition:fade={{ duration: 100 }} class="content">
		<div {...$arrow} />
		<div class="flex flex-col gap-2.5">
			<p>Dimensions</p>
			<fieldset>
				<label for="width"> Width </label>
				<input id="width" value="100%" class="input" />
			</fieldset>
			<fieldset>
				<label for="maxWidth"> Max. width </label>
				<input id="maxWidth" value="300px" class="input" />
			</fieldset>
			<fieldset>
				<label for="height"> Height </label>
				<input id="height" value="25px" class="input" />
			</fieldset>
			<fieldset>
				<label for="maxHeight"> Max. height </label>
				<input id="maxHeight" class="input" />
			</fieldset>
		</div>
		<button class="close" {...close} use:close.action>
			<X class="h-4 w-4 " />
		</button>
	</div>
{/if}

<style lang="postcss">
	fieldset {
		@apply flex items-center gap-5;
	}

	label {
		@apply w-[75px] text-sm text-neutral-700;
	}

	p {
		@apply mb-2 font-medium text-neutral-900;
	}

	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}

	.content {
		@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}
</style>
`;function ht(a){let t,n,l,s,o='<p class="svelte-8whtbw">Dimensions</p> <fieldset class="svelte-8whtbw"><label for="width" class="svelte-8whtbw">Width</label> <input id="width" value="100%" class="input svelte-8whtbw"/></fieldset> <fieldset class="svelte-8whtbw"><label for="maxWidth" class="svelte-8whtbw">Max. width</label> <input id="maxWidth" value="300px" class="input svelte-8whtbw"/></fieldset> <fieldset class="svelte-8whtbw"><label for="height" class="svelte-8whtbw">Height</label> <input id="height" value="25px" class="input svelte-8whtbw"/></fieldset> <fieldset class="svelte-8whtbw"><label for="maxHeight" class="svelte-8whtbw">Max. height</label> <input id="maxHeight" class="input svelte-8whtbw"/></fieldset>',g,p,v,r,d,I,C,c=[a[3]],u={};for(let m=0;m<c.length;m+=1)u=J(u,c[m]);v=new Mt({props:{class:"h-4 w-4 "}});let w=[{class:"close"},a[8]],q={};for(let m=0;m<w.length;m+=1)q=J(q,w[m]);let D=[a[2],{class:"content"}],O={};for(let m=0;m<D.length;m+=1)O=J(O,D[m]);return{c(){t=M("div"),n=M("div"),l=P(),s=M("div"),s.innerHTML=o,g=P(),p=M("button"),h(v.$$.fragment),this.h()},l(m){t=U(m,"DIV",{class:!0});var S=st(t);n=U(S,"DIV",{}),st(n).forEach(f),l=k(S),s=U(S,"DIV",{class:!0,["data-svelte-h"]:!0}),X(s)!=="svelte-14r694b"&&(s.innerHTML=o),g=k(S),p=U(S,"BUTTON",{class:!0});var W=st(p);x(v.$$.fragment,W),W.forEach(f),S.forEach(f),this.h()},h(){z(n,u),L(n,"svelte-8whtbw",!0),yt(s,"class","flex flex-col gap-2.5"),z(p,q),L(p,"svelte-8whtbw",!0),z(t,O),L(t,"svelte-8whtbw",!0)},m(m,S){$(m,t,S),V(t,n),V(t,l),V(t,s),V(t,g),V(t,p),y(v,p,null),p.autofocus&&p.focus(),d=!0,I||(C=[it(a[8].action(p)),it(a[5].action(t))],I=!0)},p(m,S){z(n,u=lt(c,[S&8&&m[3]])),L(n,"svelte-8whtbw",!0),L(p,"svelte-8whtbw",!0),z(t,O=lt(D,[S&4&&m[2],{class:"content"}])),L(t,"svelte-8whtbw",!0)},i(m){d||(_(v.$$.fragment,m),m&&kt(()=>{d&&(r||(r=vt(t,wt,{duration:100},!0)),r.run(1))}),d=!0)},o(m){b(v.$$.fragment,m),m&&(r||(r=vt(t,wt,{duration:100},!1)),r.run(0)),d=!1},d(m){m&&f(t),A(v),m&&r&&r.end(),I=!1,It(C)}}}function Ot(a){let t,n,l,s,o="Open Popover",g,p,v,r,d;n=new Dt({props:{class:"h-4 w-4"}});let I=[{type:"button"},{class:"trigger"},a[0],{"aria-label":"Update dimensions"}],C={};for(let u=0;u<I.length;u+=1)C=J(C,I[u]);let c=a[1]&&ht(a);return{c(){t=M("button"),h(n.$$.fragment),l=P(),s=M("span"),s.textContent=o,g=P(),c&&c.c(),p=bt(),this.h()},l(u){t=U(u,"BUTTON",{type:!0,class:!0,"aria-label":!0});var w=st(t);x(n.$$.fragment,w),l=k(w),s=U(w,"SPAN",{class:!0,["data-svelte-h"]:!0}),X(s)!=="svelte-joms16"&&(s.textContent=o),w.forEach(f),g=k(u),c&&c.l(u),p=bt(),this.h()},h(){yt(s,"class","sr-only"),z(t,C),L(t,"svelte-8whtbw",!0)},m(u,w){$(u,t,w),y(n,t,null),V(t,l),V(t,s),t.autofocus&&t.focus(),$(u,g,w),c&&c.m(u,w),$(u,p,w),v=!0,r||(d=it(a[4].action(t)),r=!0)},p(u,[w]){z(t,C=lt(I,[{type:"button"},{class:"trigger"},w&1&&u[0],{"aria-label":"Update dimensions"}])),L(t,"svelte-8whtbw",!0),u[1]?c?(c.p(u,w),w&2&&_(c,1)):(c=ht(u),c.c(),_(c,1),c.m(p.parentNode,p)):c&&(St(),b(c,1,1,()=>{c=null}),Ht())},i(u){v||(_(n.$$.fragment,u),_(c),v=!0)},o(u){b(n.$$.fragment,u),b(c),v=!1},d(u){u&&(f(t),f(g),f(p)),A(n),c&&c.d(u),r=!1,d()}}}function qt(a,t,n){let l,s,o,g;const{trigger:p,content:v,open:r,arrow:d,close:I}=Wt();return et(a,p,C=>n(0,l=C)),et(a,v,C=>n(2,o=C)),et(a,r,C=>n(1,s=C)),et(a,d,C=>n(3,g=C)),[l,s,o,g,p,v,r,d,I]}class Bt extends At{constructor(t){super(),Ct(this,t,qt,Ot,xt,{})}}const Et={"index.svelte":Ut,"tailwind.config.ts":Pt},Lt=null,Ft={component:Bt,code:{Tailwind:Et,CSS:Lt}};async function Nt(){return{preview:Ft}}const we=Object.freeze(Object.defineProperty({__proto__:null,load:Nt},Symbol.toStringTag,{value:"Module"})),Rt={title:"CreatePopoverArgs",description:"The configuration object passed to the `createPopover` builder function.",args:[{label:"checked",type:["boolean",'"indeterminate"'],default:!1},{label:"disabled",type:"boolean",default:!1},{label:"required",type:"boolean",default:!1},{label:"name",type:"string"},{label:"value",type:"string"}]},zt={title:"Trigger",description:"The button(s) which open/close the popover.",dataAttributes:[{label:"data-state",value:['"open"','"closed"']}]},Vt={title:"Arrow",description:"The optional arrow element.",dataAttributes:[{label:"data-arrow",value:["true"]}]},Xt={title:"Keyboard Interactions",description:"",keyboardInteractions:[{key:"Space",description:"Toggles the popover."},{key:"Enter",description:"Toggles the popover."},{key:"Tab",description:"Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence."},{key:"Shift + Tab",description:"Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence."},{key:"Esc",description:"Closes the popover and moves focus to the trigger element."}]},nt={keyboard:Xt,builder:Rt,trigger:zt,arrow:Vt};function Jt(a){let t;return{c(){t=H("Popover")},l(n){t=j(n,"Popover")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function Kt(a){let t;return{c(){t=H("Displays rich content in a portal, triggered by a button.")},l(n){t=j(n,"Displays rich content in a portal, triggered by a button.")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function Gt(a){let t;return{c(){t=H("Anatomy")},l(n){t=j(n,"Anatomy")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function Qt(a){let t,n="Trigger:",l;return{c(){t=M("b"),t.textContent=n,l=H(" The button(s) which open/close the popover.")},l(s){t=U(s,"B",{["data-svelte-h"]:!0}),X(t)!=="svelte-1igo93q"&&(t.textContent=n),l=j(s," The button(s) which open/close the popover.")},m(s,o){$(s,t,o),$(s,l,o)},p:ot,d(s){s&&(f(t),f(l))}}}function Yt(a){let t,n="Content:",l;return{c(){t=M("b"),t.textContent=n,l=H(" The content area viewed when the trigger is clicked.")},l(s){t=U(s,"B",{["data-svelte-h"]:!0}),X(t)!=="svelte-tk2yx7"&&(t.textContent=n),l=j(s," The content area viewed when the trigger is clicked.")},m(s,o){$(s,t,o),$(s,l,o)},p:ot,d(s){s&&(f(t),f(l))}}}function Zt(a){let t,n="Arrow:",l;return{c(){t=M("b"),t.textContent=n,l=H(" An optional arrow component")},l(s){t=U(s,"B",{["data-svelte-h"]:!0}),X(t)!=="svelte-1qgzk9j"&&(t.textContent=n),l=j(s," An optional arrow component")},m(s,o){$(s,t,o),$(s,l,o)},p:ot,d(s){s&&(f(t),f(l))}}}function te(a){let t,n="Close:",l;return{c(){t=M("b"),t.textContent=n,l=H(" A button which closes the popover")},l(s){t=U(s,"B",{["data-svelte-h"]:!0}),X(t)!=="svelte-dgc5fa"&&(t.textContent=n),l=j(s," A button which closes the popover")},m(s,o){$(s,t,o),$(s,l,o)},p:ot,d(s){s&&(f(t),f(l))}}}function ee(a){let t,n,l,s,o,g,p,v;return t=new T.Li({props:{$$slots:{default:[Qt]},$$scope:{ctx:a}}}),l=new T.Li({props:{$$slots:{default:[Yt]},$$scope:{ctx:a}}}),o=new T.Li({props:{$$slots:{default:[Zt]},$$scope:{ctx:a}}}),p=new T.Li({props:{$$slots:{default:[te]},$$scope:{ctx:a}}}),{c(){h(t.$$.fragment),n=P(),h(l.$$.fragment),s=P(),h(o.$$.fragment),g=P(),h(p.$$.fragment)},l(r){x(t.$$.fragment,r),n=k(r),x(l.$$.fragment,r),s=k(r),x(o.$$.fragment,r),g=k(r),x(p.$$.fragment,r)},m(r,d){y(t,r,d),$(r,n,d),y(l,r,d),$(r,s,d),y(o,r,d),$(r,g,d),y(p,r,d),v=!0},p(r,d){const I={};d&4&&(I.$$scope={dirty:d,ctx:r}),t.$set(I);const C={};d&4&&(C.$$scope={dirty:d,ctx:r}),l.$set(C);const c={};d&4&&(c.$$scope={dirty:d,ctx:r}),o.$set(c);const u={};d&4&&(u.$$scope={dirty:d,ctx:r}),p.$set(u)},i(r){v||(_(t.$$.fragment,r),_(l.$$.fragment,r),_(o.$$.fragment,r),_(p.$$.fragment,r),v=!0)},o(r){b(t.$$.fragment,r),b(l.$$.fragment,r),b(o.$$.fragment,r),b(p.$$.fragment,r),v=!1},d(r){r&&(f(n),f(s),f(g)),A(t,r),A(l,r),A(o,r),A(p,r)}}}function ne(a){let t;return{c(){t=H("Usage")},l(n){t=j(n,"Usage")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function se(a){let t;return{c(){t=H("createPopover")},l(n){t=j(n,"createPopover")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function le(a){let t,n,l,s;return n=new T.Code({props:{$$slots:{default:[se]},$$scope:{ctx:a}}}),{c(){t=H("To create a popover, use the "),h(n.$$.fragment),l=H(` builder function. Follow the anatomy
	or the example above to create your popover.`)},l(o){t=j(o,"To create a popover, use the "),x(n.$$.fragment,o),l=j(o,` builder function. Follow the anatomy
	or the example above to create your popover.`)},m(o,g){$(o,t,g),y(n,o,g),$(o,l,g),s=!0},p(o,g){const p={};g&4&&(p.$$scope={dirty:g,ctx:o}),n.$set(p)},i(o){s||(_(n.$$.fragment,o),s=!0)},o(o){b(n.$$.fragment,o),s=!1},d(o){o&&(f(t),f(l)),A(n,o)}}}function oe(a){let t;return{c(){t=H("API Reference")},l(n){t=j(n,"API Reference")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function re(a){let t;return{c(){t=H("Accessibility")},l(n){t=j(n,"Accessibility")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function ae(a){let t;return{c(){t=H("Accordion WAI-ARIA design pattern")},l(n){t=j(n,"Accordion WAI-ARIA design pattern")},m(n,l){$(n,t,l)},d(n){n&&f(t)}}}function ie(a){let t,n,l;return n=new T.A({props:{href:"https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",$$slots:{default:[ae]},$$scope:{ctx:a}}}),{c(){t=H(`Adheres to the
	`),h(n.$$.fragment)},l(s){t=j(s,`Adheres to the
	`),x(n.$$.fragment,s)},m(s,o){$(s,t,o),y(n,s,o),l=!0},p(s,o){const g={};o&4&&(g.$$scope={dirty:o,ctx:s}),n.$set(g)},i(s){l||(_(n.$$.fragment,s),l=!0)},o(s){b(n.$$.fragment,s),l=!1},d(s){s&&f(t),A(n,s)}}}function fe(a){let t,n,l,s,o,g,p,v,r,d,I,C,c,u,w,q,D,O,m,S,W,K,F,G,N,Q,B,Y,E,Z,R,tt;t=new T.H1({props:{$$slots:{default:[Jt]},$$scope:{ctx:a}}}),l=new T.Description({props:{$$slots:{default:[Kt]},$$scope:{ctx:a}}});const rt=[a[0].preview];let at={};for(let e=0;e<rt.length;e+=1)at=J(at,rt[e]);return o=new T.Preview({props:at}),p=new T.Construction({}),r=new T.Features({props:{features:a[1]}}),I=new T.H2({props:{$$slots:{default:[Gt]},$$scope:{ctx:a}}}),c=new T.Ul({props:{$$slots:{default:[ee]},$$scope:{ctx:a}}}),w=new T.H2({props:{$$slots:{default:[ne]},$$scope:{ctx:a}}}),D=new T.P({props:{$$slots:{default:[le]},$$scope:{ctx:a}}}),m=new T.H2({props:{$$slots:{default:[oe]},$$scope:{ctx:a}}}),W=new T.API({props:{schema:nt.builder}}),F=new T.API({props:{schema:nt.trigger}}),N=new T.API({props:{schema:nt.arrow}}),B=new T.H2({props:{$$slots:{default:[re]},$$scope:{ctx:a}}}),E=new T.P({props:{$$slots:{default:[ie]},$$scope:{ctx:a}}}),R=new T.API({props:{schema:nt.keyboard}}),{c(){h(t.$$.fragment),n=P(),h(l.$$.fragment),s=P(),h(o.$$.fragment),g=P(),h(p.$$.fragment),v=P(),h(r.$$.fragment),d=P(),h(I.$$.fragment),C=P(),h(c.$$.fragment),u=P(),h(w.$$.fragment),q=P(),h(D.$$.fragment),O=P(),h(m.$$.fragment),S=P(),h(W.$$.fragment),K=P(),h(F.$$.fragment),G=P(),h(N.$$.fragment),Q=P(),h(B.$$.fragment),Y=P(),h(E.$$.fragment),Z=P(),h(R.$$.fragment)},l(e){x(t.$$.fragment,e),n=k(e),x(l.$$.fragment,e),s=k(e),x(o.$$.fragment,e),g=k(e),x(p.$$.fragment,e),v=k(e),x(r.$$.fragment,e),d=k(e),x(I.$$.fragment,e),C=k(e),x(c.$$.fragment,e),u=k(e),x(w.$$.fragment,e),q=k(e),x(D.$$.fragment,e),O=k(e),x(m.$$.fragment,e),S=k(e),x(W.$$.fragment,e),K=k(e),x(F.$$.fragment,e),G=k(e),x(N.$$.fragment,e),Q=k(e),x(B.$$.fragment,e),Y=k(e),x(E.$$.fragment,e),Z=k(e),x(R.$$.fragment,e)},m(e,i){y(t,e,i),$(e,n,i),y(l,e,i),$(e,s,i),y(o,e,i),$(e,g,i),y(p,e,i),$(e,v,i),y(r,e,i),$(e,d,i),y(I,e,i),$(e,C,i),y(c,e,i),$(e,u,i),y(w,e,i),$(e,q,i),y(D,e,i),$(e,O,i),y(m,e,i),$(e,S,i),y(W,e,i),$(e,K,i),y(F,e,i),$(e,G,i),y(N,e,i),$(e,Q,i),y(B,e,i),$(e,Y,i),y(E,e,i),$(e,Z,i),y(R,e,i),tt=!0},p(e,[i]){const ft={};i&4&&(ft.$$scope={dirty:i,ctx:e}),t.$set(ft);const pt={};i&4&&(pt.$$scope={dirty:i,ctx:e}),l.$set(pt);const Tt=i&1?lt(rt,[jt(e[0].preview)]):{};o.$set(Tt);const $t={};i&4&&($t.$$scope={dirty:i,ctx:e}),I.$set($t);const ut={};i&4&&(ut.$$scope={dirty:i,ctx:e}),c.$set(ut);const ct={};i&4&&(ct.$$scope={dirty:i,ctx:e}),w.$set(ct);const mt={};i&4&&(mt.$$scope={dirty:i,ctx:e}),D.$set(mt);const dt={};i&4&&(dt.$$scope={dirty:i,ctx:e}),m.$set(dt);const gt={};i&4&&(gt.$$scope={dirty:i,ctx:e}),B.$set(gt);const _t={};i&4&&(_t.$$scope={dirty:i,ctx:e}),E.$set(_t)},i(e){tt||(_(t.$$.fragment,e),_(l.$$.fragment,e),_(o.$$.fragment,e),_(p.$$.fragment,e),_(r.$$.fragment,e),_(I.$$.fragment,e),_(c.$$.fragment,e),_(w.$$.fragment,e),_(D.$$.fragment,e),_(m.$$.fragment,e),_(W.$$.fragment,e),_(F.$$.fragment,e),_(N.$$.fragment,e),_(B.$$.fragment,e),_(E.$$.fragment,e),_(R.$$.fragment,e),tt=!0)},o(e){b(t.$$.fragment,e),b(l.$$.fragment,e),b(o.$$.fragment,e),b(p.$$.fragment,e),b(r.$$.fragment,e),b(I.$$.fragment,e),b(c.$$.fragment,e),b(w.$$.fragment,e),b(D.$$.fragment,e),b(m.$$.fragment,e),b(W.$$.fragment,e),b(F.$$.fragment,e),b(N.$$.fragment,e),b(B.$$.fragment,e),b(E.$$.fragment,e),b(R.$$.fragment,e),tt=!1},d(e){e&&(f(n),f(s),f(g),f(v),f(d),f(C),f(u),f(q),f(O),f(S),f(K),f(G),f(Q),f(Y),f(Z)),A(t,e),A(l,e),A(o,e),A(p,e),A(r,e),A(I,e),A(c,e),A(w,e),A(D,e),A(m,e),A(W,e),A(F,e),A(N,e),A(B,e),A(E,e),A(R,e)}}}function pe(a,t,n){let{data:l}=t;const s=["Full keyboard navigation","Customize positioning of popover","Can be controlled or uncontrolled","Focus is fully managed","Supports an optional arrow component"];return a.$$set=o=>{"data"in o&&n(0,l=o.data)},[l,s]}class he extends At{constructor(t){super(),Ct(this,t,pe,fe,xt,{data:0})}}export{he as component,we as universal};
