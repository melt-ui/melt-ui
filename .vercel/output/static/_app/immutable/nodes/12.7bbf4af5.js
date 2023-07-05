import{T as Le}from"../chunks/tailwind.config.ebd62547.js";import{G as Oe}from"../chunks/globals_raw.27244441.js";import{s as Be,n as _e,e as V,a as v,c as Q,b as pe,d as A,f as l,g as be,J as le,h as me,i as a,j as X,u as Ne,N as ae,t as w,k as x,A as De}from"../chunks/scheduler.2943ef39.js";import{S as Fe,i as Ue,g as We,b as p,e as qe,t as m,c as d,a as _,m as g,d as b}from"../chunks/index.c70d9825.js";import{g as ge,a as Ge}from"../chunks/spread.8a54911c.js";import{c as Ye,M as ze}from"../chunks/minus.bb8d95b5.js";import"../chunks/index.a1398546.js";import{C as Je}from"../chunks/copy.a7121b9a.js";import{D as h}from"../chunks/index.5e8f8c6b.js";const Ke=`<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';
	import { Check, Minus } from 'icons';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
<\/script>

<form>
	<div class="flex items-center justify-center">
		<button
			{...$root}
			use:root.action
			class="flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75"
			id="checkbox"
		>
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input {...$input} />
		</button>
		<label class="pl-[15px] text-[15px] leading-none text-white" for="checkbox">
			Accept terms and conditions.
		</label>
	</div>
</form>
`,Ve=`<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';
	import { Check, Minus } from 'icons';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
<\/script>

<form>
	<div class="checkbox-wrapper">
		<button {...$root} use:root.action class="root" id="checkbox">
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input {...$input} />
		</button>
		<label for="checkbox" class="label"> Accept terms and conditions. </label>
	</div>
</form>

<style>
	.checkbox-wrapper {
		display: flex;
		background-color: #ffffff;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.125rem;
		appearance: none;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

		&:hover {
			opacity: 0.75;
		}
	}

	.root {
		display: flex;
		background-color: #ffffff;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.125rem;
		appearance: none;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		color: rgb(228 115 18);

		:hover {
			opacity: 0.75;
		}
	}

	.label {
		color: #ffffff;
		line-height: 1;
		padding-left: 15px;
		color: 15px;
	}
</style>
`;function Qe(f){let n,e;return n=new Je({}),{c(){d(n.$$.fragment)},l(s){_(n.$$.fragment,s)},m(s,r){g(n,s,r),e=!0},i(s){e||(m(n.$$.fragment,s),e=!0)},o(s){p(n.$$.fragment,s),e=!1},d(s){b(n,s)}}}function Xe(f){let n,e;return n=new ze({}),{c(){d(n.$$.fragment)},l(s){_(n.$$.fragment,s)},m(s,r){g(n,s,r),e=!0},i(s){e||(m(n.$$.fragment,s),e=!0)},o(s){p(n.$$.fragment,s),e=!1},d(s){b(n,s)}}}function Ze(f){let n,e,s,r,c,u,o,i,C,T="Accept terms and conditions.",I,F,M;const q=[Xe,Qe],j=[];function G(k,S){return k[1]?0:k[2]?1:-1}~(r=G(f))&&(c=j[r]=q[r](f));let y=[f[3]],R={};for(let k=0;k<y.length;k+=1)R=_e(R,y[k]);let H=[f[0],{class:"flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75"},{id:"checkbox"}],B={};for(let k=0;k<H.length;k+=1)B=_e(B,H[k]);return{c(){n=V("form"),e=V("div"),s=V("button"),c&&c.c(),u=v(),o=V("input"),i=v(),C=V("label"),C.textContent=T,this.h()},l(k){n=Q(k,"FORM",{});var S=pe(n);e=Q(S,"DIV",{class:!0});var P=pe(e);s=Q(P,"BUTTON",{class:!0,id:!0});var D=pe(s);c&&c.l(D),u=A(D),o=Q(D,"INPUT",{}),D.forEach(l),i=A(P),C=Q(P,"LABEL",{class:!0,for:!0,["data-svelte-h"]:!0}),be(C)!=="svelte-1lkisay"&&(C.textContent=T),P.forEach(l),S.forEach(l),this.h()},h(){le(o,R),le(s,B),me(C,"class","pl-[15px] text-[15px] leading-none text-white"),me(C,"for","checkbox"),me(e,"class","flex items-center justify-center")},m(k,S){a(k,n,S),X(n,e),X(e,s),~r&&j[r].m(s,null),X(s,u),X(s,o),o.autofocus&&o.focus(),s.autofocus&&s.focus(),X(e,i),X(e,C),I=!0,F||(M=Ne(f[0].action(s)),F=!0)},p(k,[S]){let P=r;r=G(k),r!==P&&(c&&(We(),p(j[P],1,1,()=>{j[P]=null}),qe()),~r?(c=j[r],c||(c=j[r]=q[r](k),c.c()),m(c,1),c.m(s,u)):c=null),le(o,R=ge(y,[S&8&&k[3]])),le(s,B=ge(H,[S&1&&k[0],{class:"flex h-6 w-6 appearance-none items-center justify-center rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75"},{id:"checkbox"}]))},i(k){I||(m(c),I=!0)},o(k){p(c),I=!1},d(k){k&&l(n),~r&&j[r].d(),F=!1,M()}}}function et(f,n,e){let s,r,c,u;const{root:o,input:i,isChecked:C,isIndeterminate:T}=Ye({checked:"indeterminate"});return ae(f,o,I=>e(0,s=I)),ae(f,i,I=>e(3,u=I)),ae(f,C,I=>e(2,c=I)),ae(f,T,I=>e(1,r=I)),[s,r,c,u,o,i,C,T]}class tt extends Fe{constructor(n){super(),Ue(this,n,et,Ze,Be,{})}}const nt={"index.svelte":Ke,"tailwind.config.ts":Le},st={"index.svelte":Ve,"globals.css":Oe},ot={component:tt,code:{Tailwind:nt,CSS:st}};async function rt(){return{preview:ot}}const zt=Object.freeze(Object.defineProperty({__proto__:null,load:rt},Symbol.toStringTag,{value:"Module"})),ct={title:"CreateCheckboxArgs",description:"The configuration object passed to the `createCheckbox` builder function.",args:[{label:"checked",type:'boolean | "indeterminate"',default:!1},{label:"disabled",type:"boolean",default:!1},{label:"required",type:"boolean",default:!1},{label:"name",type:"string"},{label:"value",type:"string"}]},$t={title:"Keyboard Interactions",description:"",keyboardInteractions:[{key:"Space",description:"Toggles the checkbox state."}]},Re={builder:ct,keyboard:$t},ft=`<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';

	const { root, input, isChecked, isIndeterminate, checked, options } = createCheckbox({
		disabled: true,
	});
	// or
	options.update((prev) => ({ ...prev, disabled: true }));
<\/script>
`,lt=`<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';

	const { root, input, isChecked, isIndeterminate, checked } = createCheckbox({
		checked: 'indeterminate',
	});
	// or
	checked.set('indeterminate');
<\/script>
`,at=`<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';

	export let checked: boolean | 'indeterminate' = true;
	export let disabled = false;

	const { checked: checkedStore, options } = createCheckbox({
		disabled,
		checked,
	});

	$: checkedStore.set(checked);
	checkedStore.subscribe((v) => (checked = v));
	$: options.update((o) => ({ ...o, disabled }));
<\/script>
`,de={disable:ft,controlled:at,indeterminate:lt};function it(f){let n;return{c(){n=w("Checkbox")},l(e){n=x(e,"Checkbox")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function ut(f){let n;return{c(){n=w("A control that allows the user to toggle between checked and not checked.")},l(e){n=x(e,"A control that allows the user to toggle between checked and not checked.")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function pt(f){let n;return{c(){n=w("Anatomy")},l(e){n=x(e,"Anatomy")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function mt(f){let n,e="Root:",s;return{c(){n=V("b"),n.textContent=e,s=w(" The root container for the checkbox")},l(r){n=Q(r,"B",{["data-svelte-h"]:!0}),be(n)!=="svelte-ss75j2"&&(n.textContent=e),s=x(r," The root container for the checkbox")},m(r,c){a(r,n,c),a(r,s,c)},p:De,d(r){r&&(l(n),l(s))}}}function dt(f){let n,e="Input:",s;return{c(){n=V("b"),n.textContent=e,s=w(" The native html input that is visually hidden.")},l(r){n=Q(r,"B",{["data-svelte-h"]:!0}),be(n)!=="svelte-1elel2u"&&(n.textContent=e),s=x(r," The native html input that is visually hidden.")},m(r,c){a(r,n,c),a(r,s,c)},p:De,d(r){r&&(l(n),l(s))}}}function _t(f){let n,e,s,r;return n=new h.Li({props:{$$slots:{default:[mt]},$$scope:{ctx:f}}}),s=new h.Li({props:{$$slots:{default:[dt]},$$scope:{ctx:f}}}),{c(){d(n.$$.fragment),e=v(),d(s.$$.fragment)},l(c){_(n.$$.fragment,c),e=A(c),_(s.$$.fragment,c)},m(c,u){g(n,c,u),a(c,e,u),g(s,c,u),r=!0},p(c,u){const o={};u&4&&(o.$$scope={dirty:u,ctx:c}),n.$set(o);const i={};u&4&&(i.$$scope={dirty:u,ctx:c}),s.$set(i)},i(c){r||(m(n.$$.fragment,c),m(s.$$.fragment,c),r=!0)},o(c){p(n.$$.fragment,c),p(s.$$.fragment,c),r=!1},d(c){c&&l(e),b(n,c),b(s,c)}}}function gt(f){let n;return{c(){n=w("Usage")},l(e){n=x(e,"Usage")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function bt(f){let n;return{c(){n=w("createCheckbox")},l(e){n=x(e,"createCheckbox")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function ht(f){let n,e,s,r;return e=new h.Code({props:{$$slots:{default:[bt]},$$scope:{ctx:f}}}),{c(){n=w("To create a checkbox, use the "),d(e.$$.fragment),s=w(` builder function. Follow the anatomy
	or the example above to create your checkbox.`)},l(c){n=x(c,"To create a checkbox, use the "),_(e.$$.fragment,c),s=x(c,` builder function. Follow the anatomy
	or the example above to create your checkbox.`)},m(c,u){a(c,n,u),g(e,c,u),a(c,s,u),r=!0},p(c,u){const o={};u&4&&(o.$$scope={dirty:u,ctx:c}),e.$set(o)},i(c){r||(m(e.$$.fragment,c),r=!0)},o(c){p(e.$$.fragment,c),r=!1},d(c){c&&(l(n),l(s)),b(e,c)}}}function kt(f){let n;return{c(){n=w("Indeterminate state")},l(e){n=x(e,"Indeterminate state")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function wt(f){let n;return{c(){n=w("checked")},l(e){n=x(e,"checked")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function xt(f){let n;return{c(){n=w("indeterminate")},l(e){n=x(e,"indeterminate")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function Ct(f){let n,e,s,r,c,u;return e=new h.Code({props:{$$slots:{default:[wt]},$$scope:{ctx:f}}}),r=new h.Code({props:{$$slots:{default:[xt]},$$scope:{ctx:f}}}),{c(){n=w("To create an indeterminate checkbox, set the "),d(e.$$.fragment),s=w(` argument as
	`),d(r.$$.fragment),c=w(".")},l(o){n=x(o,"To create an indeterminate checkbox, set the "),_(e.$$.fragment,o),s=x(o,` argument as
	`),_(r.$$.fragment,o),c=x(o,".")},m(o,i){a(o,n,i),g(e,o,i),a(o,s,i),g(r,o,i),a(o,c,i),u=!0},p(o,i){const C={};i&4&&(C.$$scope={dirty:i,ctx:o}),e.$set(C);const T={};i&4&&(T.$$scope={dirty:i,ctx:o}),r.$set(T)},i(o){u||(m(e.$$.fragment,o),m(r.$$.fragment,o),u=!0)},o(o){p(e.$$.fragment,o),p(r.$$.fragment,o),u=!1},d(o){o&&(l(n),l(s),l(c)),b(e,o),b(r,o)}}}function vt(f){let n;return{c(){n=w("Disabling the checkbox")},l(e){n=x(e,"Disabling the checkbox")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function At(f){let n;return{c(){n=w("disabled")},l(e){n=x(e,"disabled")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function It(f){let n;return{c(){n=w("true")},l(e){n=x(e,"true")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function Tt(f){let n,e,s,r,c,u;return e=new h.Code({props:{$$slots:{default:[At]},$$scope:{ctx:f}}}),r=new h.Code({props:{$$slots:{default:[It]},$$scope:{ctx:f}}}),{c(){n=w("To disable the checkbox, set the "),d(e.$$.fragment),s=w(` argument as
	`),d(r.$$.fragment),c=w(".")},l(o){n=x(o,"To disable the checkbox, set the "),_(e.$$.fragment,o),s=x(o,` argument as
	`),_(r.$$.fragment,o),c=x(o,".")},m(o,i){a(o,n,i),g(e,o,i),a(o,s,i),g(r,o,i),a(o,c,i),u=!0},p(o,i){const C={};i&4&&(C.$$scope={dirty:i,ctx:o}),e.$set(C);const T={};i&4&&(T.$$scope={dirty:i,ctx:o}),r.$set(T)},i(o){u||(m(e.$$.fragment,o),m(r.$$.fragment,o),u=!0)},o(o){p(e.$$.fragment,o),p(r.$$.fragment,o),u=!1},d(o){o&&(l(n),l(s),l(c)),b(e,o),b(r,o)}}}function Pt(f){let n;return{c(){n=w("Controlled access")},l(e){n=x(e,"Controlled access")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function jt(f){let n;return{c(){n=w("checked")},l(e){n=x(e,"checked")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function St(f){let n;return{c(){n=w("options")},l(e){n=x(e,"options")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function yt(f){let n,e,s,r,c,u;return e=new h.Code({props:{$$slots:{default:[jt]},$$scope:{ctx:f}}}),r=new h.Code({props:{$$slots:{default:[St]},$$scope:{ctx:f}}}),{c(){n=w("To programatically control the checkbox, you can directly set the "),d(e.$$.fragment),s=w(` store.
	You can also update the `),d(r.$$.fragment),c=w(" store with new arguments.")},l(o){n=x(o,"To programatically control the checkbox, you can directly set the "),_(e.$$.fragment,o),s=x(o,` store.
	You can also update the `),_(r.$$.fragment,o),c=x(o," store with new arguments.")},m(o,i){a(o,n,i),g(e,o,i),a(o,s,i),g(r,o,i),a(o,c,i),u=!0},p(o,i){const C={};i&4&&(C.$$scope={dirty:i,ctx:o}),e.$set(C);const T={};i&4&&(T.$$scope={dirty:i,ctx:o}),r.$set(T)},i(o){u||(m(e.$$.fragment,o),m(r.$$.fragment,o),u=!0)},o(o){p(e.$$.fragment,o),p(r.$$.fragment,o),u=!1},d(o){o&&(l(n),l(s),l(c)),b(e,o),b(r,o)}}}function Ht(f){let n;return{c(){n=w("API Reference")},l(e){n=x(e,"API Reference")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function Mt(f){let n;return{c(){n=w("Accessibility")},l(e){n=x(e,"Accessibility")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function Rt(f){let n;return{c(){n=w("tri-state Checkbox WAI-ARIA design pattern")},l(e){n=x(e,"tri-state Checkbox WAI-ARIA design pattern")},m(e,s){a(e,n,s)},d(e){e&&l(n)}}}function Bt(f){let n,e,s;return e=new h.A({props:{href:"https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",$$slots:{default:[Rt]},$$scope:{ctx:f}}}),{c(){n=w(`Adheres to the
	`),d(e.$$.fragment)},l(r){n=x(r,`Adheres to the
	`),_(e.$$.fragment,r)},m(r,c){a(r,n,c),g(e,r,c),s=!0},p(r,c){const u={};c&4&&(u.$$scope={dirty:c,ctx:r}),e.$set(u)},i(r){s||(m(e.$$.fragment,r),s=!0)},o(r){p(e.$$.fragment,r),s=!1},d(r){r&&l(n),b(e,r)}}}function Dt(f){let n,e,s,r,c,u,o,i,C,T,I,F,M,q,j,G,y,R,H,B,k,S,P,D,U,Z,Y,ee,E,te,L,ne,z,se,O,oe,J,re,N,ce,W,$e,K,fe;n=new h.H1({props:{$$slots:{default:[it]},$$scope:{ctx:f}}}),s=new h.Description({props:{$$slots:{default:[ut]},$$scope:{ctx:f}}});const ie=[f[0].preview];let ue={};for(let t=0;t<ie.length;t+=1)ue=_e(ue,ie[t]);return c=new h.Preview({props:ue}),o=new h.Features({props:{features:f[1]}}),C=new h.H2({props:{$$slots:{default:[pt]},$$scope:{ctx:f}}}),I=new h.Ul({props:{$$slots:{default:[_t]},$$scope:{ctx:f}}}),M=new h.H2({props:{$$slots:{default:[gt]},$$scope:{ctx:f}}}),j=new h.P({props:{$$slots:{default:[ht]},$$scope:{ctx:f}}}),y=new h.H3({props:{$$slots:{default:[kt]},$$scope:{ctx:f}}}),H=new h.P({props:{$$slots:{default:[Ct]},$$scope:{ctx:f}}}),k=new h.CodeBlock({props:{code:de.indeterminate}}),P=new h.H3({props:{$$slots:{default:[vt]},$$scope:{ctx:f}}}),U=new h.P({props:{$$slots:{default:[Tt]},$$scope:{ctx:f}}}),Y=new h.CodeBlock({props:{code:de.disable}}),E=new h.H3({props:{$$slots:{default:[Pt]},$$scope:{ctx:f}}}),L=new h.P({props:{$$slots:{default:[yt]},$$scope:{ctx:f}}}),z=new h.CodeBlock({props:{code:de.controlled}}),O=new h.H2({props:{$$slots:{default:[Ht]},$$scope:{ctx:f}}}),J=new h.API({props:{schema:Re.builder}}),N=new h.H2({props:{$$slots:{default:[Mt]},$$scope:{ctx:f}}}),W=new h.P({props:{$$slots:{default:[Bt]},$$scope:{ctx:f}}}),K=new h.API({props:{schema:Re.keyboard}}),{c(){d(n.$$.fragment),e=v(),d(s.$$.fragment),r=v(),d(c.$$.fragment),u=v(),d(o.$$.fragment),i=v(),d(C.$$.fragment),T=v(),d(I.$$.fragment),F=v(),d(M.$$.fragment),q=v(),d(j.$$.fragment),G=v(),d(y.$$.fragment),R=v(),d(H.$$.fragment),B=v(),d(k.$$.fragment),S=v(),d(P.$$.fragment),D=v(),d(U.$$.fragment),Z=v(),d(Y.$$.fragment),ee=v(),d(E.$$.fragment),te=v(),d(L.$$.fragment),ne=v(),d(z.$$.fragment),se=v(),d(O.$$.fragment),oe=v(),d(J.$$.fragment),re=v(),d(N.$$.fragment),ce=v(),d(W.$$.fragment),$e=v(),d(K.$$.fragment)},l(t){_(n.$$.fragment,t),e=A(t),_(s.$$.fragment,t),r=A(t),_(c.$$.fragment,t),u=A(t),_(o.$$.fragment,t),i=A(t),_(C.$$.fragment,t),T=A(t),_(I.$$.fragment,t),F=A(t),_(M.$$.fragment,t),q=A(t),_(j.$$.fragment,t),G=A(t),_(y.$$.fragment,t),R=A(t),_(H.$$.fragment,t),B=A(t),_(k.$$.fragment,t),S=A(t),_(P.$$.fragment,t),D=A(t),_(U.$$.fragment,t),Z=A(t),_(Y.$$.fragment,t),ee=A(t),_(E.$$.fragment,t),te=A(t),_(L.$$.fragment,t),ne=A(t),_(z.$$.fragment,t),se=A(t),_(O.$$.fragment,t),oe=A(t),_(J.$$.fragment,t),re=A(t),_(N.$$.fragment,t),ce=A(t),_(W.$$.fragment,t),$e=A(t),_(K.$$.fragment,t)},m(t,$){g(n,t,$),a(t,e,$),g(s,t,$),a(t,r,$),g(c,t,$),a(t,u,$),g(o,t,$),a(t,i,$),g(C,t,$),a(t,T,$),g(I,t,$),a(t,F,$),g(M,t,$),a(t,q,$),g(j,t,$),a(t,G,$),g(y,t,$),a(t,R,$),g(H,t,$),a(t,B,$),g(k,t,$),a(t,S,$),g(P,t,$),a(t,D,$),g(U,t,$),a(t,Z,$),g(Y,t,$),a(t,ee,$),g(E,t,$),a(t,te,$),g(L,t,$),a(t,ne,$),g(z,t,$),a(t,se,$),g(O,t,$),a(t,oe,$),g(J,t,$),a(t,re,$),g(N,t,$),a(t,ce,$),g(W,t,$),a(t,$e,$),g(K,t,$),fe=!0},p(t,[$]){const he={};$&4&&(he.$$scope={dirty:$,ctx:t}),n.$set(he);const ke={};$&4&&(ke.$$scope={dirty:$,ctx:t}),s.$set(ke);const Ee=$&1?ge(ie,[Ge(t[0].preview)]):{};c.$set(Ee);const we={};$&4&&(we.$$scope={dirty:$,ctx:t}),C.$set(we);const xe={};$&4&&(xe.$$scope={dirty:$,ctx:t}),I.$set(xe);const Ce={};$&4&&(Ce.$$scope={dirty:$,ctx:t}),M.$set(Ce);const ve={};$&4&&(ve.$$scope={dirty:$,ctx:t}),j.$set(ve);const Ae={};$&4&&(Ae.$$scope={dirty:$,ctx:t}),y.$set(Ae);const Ie={};$&4&&(Ie.$$scope={dirty:$,ctx:t}),H.$set(Ie);const Te={};$&4&&(Te.$$scope={dirty:$,ctx:t}),P.$set(Te);const Pe={};$&4&&(Pe.$$scope={dirty:$,ctx:t}),U.$set(Pe);const je={};$&4&&(je.$$scope={dirty:$,ctx:t}),E.$set(je);const Se={};$&4&&(Se.$$scope={dirty:$,ctx:t}),L.$set(Se);const ye={};$&4&&(ye.$$scope={dirty:$,ctx:t}),O.$set(ye);const He={};$&4&&(He.$$scope={dirty:$,ctx:t}),N.$set(He);const Me={};$&4&&(Me.$$scope={dirty:$,ctx:t}),W.$set(Me)},i(t){fe||(m(n.$$.fragment,t),m(s.$$.fragment,t),m(c.$$.fragment,t),m(o.$$.fragment,t),m(C.$$.fragment,t),m(I.$$.fragment,t),m(M.$$.fragment,t),m(j.$$.fragment,t),m(y.$$.fragment,t),m(H.$$.fragment,t),m(k.$$.fragment,t),m(P.$$.fragment,t),m(U.$$.fragment,t),m(Y.$$.fragment,t),m(E.$$.fragment,t),m(L.$$.fragment,t),m(z.$$.fragment,t),m(O.$$.fragment,t),m(J.$$.fragment,t),m(N.$$.fragment,t),m(W.$$.fragment,t),m(K.$$.fragment,t),fe=!0)},o(t){p(n.$$.fragment,t),p(s.$$.fragment,t),p(c.$$.fragment,t),p(o.$$.fragment,t),p(C.$$.fragment,t),p(I.$$.fragment,t),p(M.$$.fragment,t),p(j.$$.fragment,t),p(y.$$.fragment,t),p(H.$$.fragment,t),p(k.$$.fragment,t),p(P.$$.fragment,t),p(U.$$.fragment,t),p(Y.$$.fragment,t),p(E.$$.fragment,t),p(L.$$.fragment,t),p(z.$$.fragment,t),p(O.$$.fragment,t),p(J.$$.fragment,t),p(N.$$.fragment,t),p(W.$$.fragment,t),p(K.$$.fragment,t),fe=!1},d(t){t&&(l(e),l(r),l(u),l(i),l(T),l(F),l(q),l(G),l(R),l(B),l(S),l(D),l(Z),l(ee),l(te),l(ne),l(se),l(oe),l(re),l(ce),l($e)),b(n,t),b(s,t),b(c,t),b(o,t),b(C,t),b(I,t),b(M,t),b(j,t),b(y,t),b(H,t),b(k,t),b(P,t),b(U,t),b(Y,t),b(E,t),b(L,t),b(z,t),b(O,t),b(J,t),b(N,t),b(W,t),b(K,t)}}}function Ft(f,n,e){let{data:s}=n;const r=["Supports indeterminate state","Full keyboard navigation","Can be controlled or uncontrolled"];return f.$$set=c=>{"data"in c&&e(0,s=c.data)},[s,r]}class Jt extends Fe{constructor(n){super(),Ue(this,n,Ft,Dt,Be,{data:0})}}export{Jt as component,zt as universal};
