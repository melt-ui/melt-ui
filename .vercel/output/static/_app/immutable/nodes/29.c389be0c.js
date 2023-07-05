import{T as gt}from"../chunks/tailwind.config.ebd62547.js";import{s as it,n as F,e as U,a as y,c as N,b as V,f,d as T,J as H,W as E,i as $,j as W,u as Y,y as ct,N as st,t as B,k as G,g as ft,A as ut}from"../chunks/scheduler.2943ef39.js";import{S as $t,i as mt,c as p,a as g,m as c,t as d,b as _,d as b}from"../chunks/index.c70d9825.js";import{g as J,a as dt}from"../chunks/spread.8a54911c.js";import"../chunks/index.a1398546.js";import{c as _t}from"../chunks/create.1452551b.js";import{A as bt,a as vt,b as ht}from"../chunks/align-right.3a47640d.js";import{D as w}from"../chunks/index.5e8f8c6b.js";const wt=`<script lang="ts">
	import { createToggleGroup } from '@melt-ui/svelte';
	import { AlignLeft, AlignCenter, AlignRight } from 'icons';

	const { root, item } = createToggleGroup();
<\/script>

<div
	{...$root}
	class="flex items-center data-[orientation='vertical']:flex-col"
	aria-label="Text alignment"
>
	<button class="toggle-item" {...$item('left')} use:item.action aria-label="Left aligned">
		<AlignLeft />
	</button>
	<button class="toggle-item" {...$item('center')} use:item.action aria-label="Center aligned">
		<AlignCenter />
	</button>
	<button class="toggle-item" {...$item('right')} use:item.action aria-label="Right aligned">
		<AlignRight />
	</button>
</div>

<style lang="postcss">
	.toggle-item {
		display: grid;
		place-items: center;
		align-items: center;

		background-color: theme('colors.white');
		color: theme('colors.magnum.800');
		font-size: theme('fontSize.base');
		line-height: theme('lineHeight.4');
		outline: none;

		height: theme('height.9');
		width: theme('width.9');

		&:hover {
			background-color: theme('colors.magnum.100');
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		@apply border-x border-l-transparent border-r-magnum-200;

		&:first-child {
			@apply rounded-l;
		}

		&:last-child {
			@apply rounded-r border-r-transparent;
		}
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		@apply border-x border-l-magnum-200 border-r-transparent;

		&:first-child {
			@apply rounded-r;
		}

		&:last-child {
			@apply rounded-l border-l-transparent;
		}
	}

	.toggle-item[data-orientation='vertical'] {
		@apply border-y border-b-magnum-200 border-t-transparent;

		&:first-child {
			@apply rounded-t;
		}

		&:last-child {
			@apply rounded-b border-b-transparent;
		}
	}

	.toggle-item[data-state='on'] {
		@apply bg-magnum-200 text-magnum-900;
	}
</style>
`;function At(i){let e,n,r,a,o,u,v,m,A,q,C,D;r=new bt({});let k=[{class:"toggle-item"},i[1]("left"),{"aria-label":"Left aligned"}],x={};for(let l=0;l<k.length;l+=1)x=F(x,k[l]);u=new vt({});let I=[{class:"toggle-item"},i[1]("center"),{"aria-label":"Center aligned"}],L={};for(let l=0;l<I.length;l+=1)L=F(L,I[l]);A=new ht({});let j=[{class:"toggle-item"},i[1]("right"),{"aria-label":"Right aligned"}],M={};for(let l=0;l<j.length;l+=1)M=F(M,j[l]);let R=[i[0],{class:"flex items-center data-[orientation='vertical']:flex-col"},{"aria-label":"Text alignment"}],S={};for(let l=0;l<R.length;l+=1)S=F(S,R[l]);return{c(){e=U("div"),n=U("button"),p(r.$$.fragment),a=y(),o=U("button"),p(u.$$.fragment),v=y(),m=U("button"),p(A.$$.fragment),this.h()},l(l){e=N(l,"DIV",{class:!0,"aria-label":!0});var h=V(e);n=N(h,"BUTTON",{class:!0,"aria-label":!0});var z=V(n);g(r.$$.fragment,z),z.forEach(f),a=T(h),o=N(h,"BUTTON",{class:!0,"aria-label":!0});var O=V(o);g(u.$$.fragment,O),O.forEach(f),v=T(h),m=N(h,"BUTTON",{class:!0,"aria-label":!0});var P=V(m);g(A.$$.fragment,P),P.forEach(f),h.forEach(f),this.h()},h(){H(n,x),E(n,"svelte-jirp2q",!0),H(o,L),E(o,"svelte-jirp2q",!0),H(m,M),E(m,"svelte-jirp2q",!0),H(e,S),E(e,"svelte-jirp2q",!0)},m(l,h){$(l,e,h),W(e,n),c(r,n,null),n.autofocus&&n.focus(),W(e,a),W(e,o),c(u,o,null),o.autofocus&&o.focus(),W(e,v),W(e,m),c(A,m,null),m.autofocus&&m.focus(),q=!0,C||(D=[Y(i[3].action(n)),Y(i[3].action(o)),Y(i[3].action(m))],C=!0)},p(l,[h]){H(n,x=J(k,[{class:"toggle-item"},h&2&&l[1]("left"),{"aria-label":"Left aligned"}])),E(n,"svelte-jirp2q",!0),H(o,L=J(I,[{class:"toggle-item"},h&2&&l[1]("center"),{"aria-label":"Center aligned"}])),E(o,"svelte-jirp2q",!0),H(m,M=J(j,[{class:"toggle-item"},h&2&&l[1]("right"),{"aria-label":"Right aligned"}])),E(m,"svelte-jirp2q",!0),H(e,S=J(R,[h&1&&l[0],{class:"flex items-center data-[orientation='vertical']:flex-col"},{"aria-label":"Text alignment"}])),E(e,"svelte-jirp2q",!0)},i(l){q||(d(r.$$.fragment,l),d(u.$$.fragment,l),d(A.$$.fragment,l),q=!0)},o(l){_(r.$$.fragment,l),_(u.$$.fragment,l),_(A.$$.fragment,l),q=!1},d(l){l&&f(e),b(r),b(u),b(A),C=!1,ct(D)}}}function yt(i,e,n){let r,a;const{root:o,item:u}=_t();return st(i,o,v=>n(0,r=v)),st(i,u,v=>n(1,a=v)),[r,a,o,u]}class Tt extends $t{constructor(e){super(),mt(this,e,yt,At,it,{})}}const Ct={"index.svelte":wt,"tailwind.config.ts":gt},kt=null,It={component:Tt,code:{Tailwind:Ct,CSS:kt}};async function jt(){return{preview:It}}const Zt=Object.freeze(Object.defineProperty({__proto__:null,load:jt},Symbol.toStringTag,{value:"Module"})),Rt={title:"CreateToggleGroupArgs",description:"The configuration object passed to the `createToggleGroup` builder function.",args:[{label:"type",type:["'single'","'multiple'"],default:"'single'"},{label:"disabled",type:"boolean",default:!1},{label:"value",type:["'string'","string[]","null"],default:"null"},{label:"rovingFocus",type:"boolean",default:!0},{label:"orientation",type:["'horizontal'","'vertical'"],default:"'horizontal'"},{label:"loop",type:"boolean",default:!0}]},zt={title:"Root",description:"The root toggle group element.",dataAttributes:[{label:"data-orientation",value:["'horizontal'","'vertical'"]},{label:"data-melt-part",value:"`toggle-group`"}]},Pt={title:"Item",description:"The toggle group item element.",args:[{label:"value",type:"string"},{label:"disabled",type:"boolean",default:!1}],dataAttributes:[{label:"data-orientation",value:["'horizontal'","'vertical'"]},{label:"data-melt-part",value:"`toggle-group-item`"},{label:"data-state",value:["'on'","'off'"]}]},qt={title:"Keyboard Interactions",description:"",keyboardInteractions:[{key:"Tab",description:"Moves focus to either the pressed item or the first item in the group."},{key:"Space",description:"Activates/deactivates the item."},{key:"Enter",description:"Activates/deactivates the item."},{key:"ArrowDown",description:"Moves focus to the next item in the group."},{key:"ArrowRight",description:"Moves focus to the next item in the group."},{key:"ArrowUp",description:"Moves focus to the previous item in the group."},{key:"ArrowLeft",description:"Moves focus to the previous item in the group."},{key:"Home",description:"Moves focus to the first item in the group."},{key:"End",description:"Moves focus to the last item in the group."}]},Z={builder:Rt,root:zt,item:Pt,keyboard:qt};function xt(i){let e;return{c(){e=B("Toggle Group")},l(n){e=G(n,"Toggle Group")},m(n,r){$(n,e,r)},d(n){n&&f(e)}}}function Lt(i){let e;return{c(){e=B("A set of two-state buttons that can be toggled on or off.")},l(n){e=G(n,"A set of two-state buttons that can be toggled on or off.")},m(n,r){$(n,e,r)},d(n){n&&f(e)}}}function Mt(i){let e;return{c(){e=B("Anatomy")},l(n){e=G(n,"Anatomy")},m(n,r){$(n,e,r)},d(n){n&&f(e)}}}function St(i){let e,n="Root:",r;return{c(){e=U("b"),e.textContent=n,r=B(" The toggle group container component")},l(a){e=N(a,"B",{["data-svelte-h"]:!0}),ft(e)!=="svelte-ss75j2"&&(e.textContent=n),r=G(a," The toggle group container component")},m(a,o){$(a,e,o),$(a,r,o)},p:ut,d(a){a&&(f(e),f(r))}}}function Bt(i){let e,n="Item:",r;return{c(){e=U("b"),e.textContent=n,r=B(" A toggle group item component")},l(a){e=N(a,"B",{["data-svelte-h"]:!0}),ft(e)!=="svelte-1je5gc7"&&(e.textContent=n),r=G(a," A toggle group item component")},m(a,o){$(a,e,o),$(a,r,o)},p:ut,d(a){a&&(f(e),f(r))}}}function Gt(i){let e,n,r,a;return e=new w.Li({props:{$$slots:{default:[St]},$$scope:{ctx:i}}}),r=new w.Li({props:{$$slots:{default:[Bt]},$$scope:{ctx:i}}}),{c(){p(e.$$.fragment),n=y(),p(r.$$.fragment)},l(o){g(e.$$.fragment,o),n=T(o),g(r.$$.fragment,o)},m(o,u){c(e,o,u),$(o,n,u),c(r,o,u),a=!0},p(o,u){const v={};u&4&&(v.$$scope={dirty:u,ctx:o}),e.$set(v);const m={};u&4&&(m.$$scope={dirty:u,ctx:o}),r.$set(m)},i(o){a||(d(e.$$.fragment,o),d(r.$$.fragment,o),a=!0)},o(o){_(e.$$.fragment,o),_(r.$$.fragment,o),a=!1},d(o){o&&f(n),b(e,o),b(r,o)}}}function Ht(i){let e;return{c(){e=B("API Reference")},l(n){e=G(n,"API Reference")},m(n,r){$(n,e,r)},d(n){n&&f(e)}}}function Et(i){let e;return{c(){e=B("Accessibility")},l(n){e=G(n,"Accessibility")},m(n,r){$(n,e,r)},d(n){n&&f(e)}}}function Dt(i){let e;return{c(){e=B("Button WAI-ARIA design pattern")},l(n){e=G(n,"Button WAI-ARIA design pattern")},m(n,r){$(n,e,r)},d(n){n&&f(e)}}}function Ot(i){let e,n,r;return n=new w.A({props:{href:"https://www.w3.org/WAI/ARIA/apg/patterns/button/",$$slots:{default:[Dt]},$$scope:{ctx:i}}}),{c(){e=B(`Adheres to the
	`),p(n.$$.fragment)},l(a){e=G(a,`Adheres to the
	`),g(n.$$.fragment,a)},m(a,o){$(a,e,o),c(n,a,o),r=!0},p(a,o){const u={};o&4&&(u.$$scope={dirty:o,ctx:a}),n.$set(u)},i(a){r||(d(n.$$.fragment,a),r=!0)},o(a){_(n.$$.fragment,a),r=!1},d(a){a&&f(e),b(n,a)}}}function Ut(i){let e,n,r,a,o,u,v,m,A,q,C,D,k,x,I,L,j,M,R,S,l,h,z,O,P,K;e=new w.H1({props:{$$slots:{default:[xt]},$$scope:{ctx:i}}}),r=new w.Description({props:{$$slots:{default:[Lt]},$$scope:{ctx:i}}});const Q=[i[0].preview];let X={};for(let t=0;t<Q.length;t+=1)X=F(X,Q[t]);return o=new w.Preview({props:X}),v=new w.Construction({}),A=new w.Features({props:{features:i[1]}}),C=new w.H2({props:{$$slots:{default:[Mt]},$$scope:{ctx:i}}}),k=new w.Ul({props:{$$slots:{default:[Gt]},$$scope:{ctx:i}}}),I=new w.H2({props:{$$slots:{default:[Ht]},$$scope:{ctx:i}}}),j=new w.API({props:{schema:Z.builder}}),R=new w.API({props:{schema:Z.root}}),l=new w.H2({props:{$$slots:{default:[Et]},$$scope:{ctx:i}}}),z=new w.P({props:{$$slots:{default:[Ot]},$$scope:{ctx:i}}}),P=new w.API({props:{schema:Z.keyboard}}),{c(){p(e.$$.fragment),n=y(),p(r.$$.fragment),a=y(),p(o.$$.fragment),u=y(),p(v.$$.fragment),m=y(),p(A.$$.fragment),q=y(),p(C.$$.fragment),D=y(),p(k.$$.fragment),x=y(),p(I.$$.fragment),L=y(),p(j.$$.fragment),M=y(),p(R.$$.fragment),S=y(),p(l.$$.fragment),h=y(),p(z.$$.fragment),O=y(),p(P.$$.fragment)},l(t){g(e.$$.fragment,t),n=T(t),g(r.$$.fragment,t),a=T(t),g(o.$$.fragment,t),u=T(t),g(v.$$.fragment,t),m=T(t),g(A.$$.fragment,t),q=T(t),g(C.$$.fragment,t),D=T(t),g(k.$$.fragment,t),x=T(t),g(I.$$.fragment,t),L=T(t),g(j.$$.fragment,t),M=T(t),g(R.$$.fragment,t),S=T(t),g(l.$$.fragment,t),h=T(t),g(z.$$.fragment,t),O=T(t),g(P.$$.fragment,t)},m(t,s){c(e,t,s),$(t,n,s),c(r,t,s),$(t,a,s),c(o,t,s),$(t,u,s),c(v,t,s),$(t,m,s),c(A,t,s),$(t,q,s),c(C,t,s),$(t,D,s),c(k,t,s),$(t,x,s),c(I,t,s),$(t,L,s),c(j,t,s),$(t,M,s),c(R,t,s),$(t,S,s),c(l,t,s),$(t,h,s),c(z,t,s),$(t,O,s),c(P,t,s),K=!0},p(t,[s]){const tt={};s&4&&(tt.$$scope={dirty:s,ctx:t}),e.$set(tt);const et={};s&4&&(et.$$scope={dirty:s,ctx:t}),r.$set(et);const pt=s&1?J(Q,[dt(t[0].preview)]):{};o.$set(pt);const nt={};s&4&&(nt.$$scope={dirty:s,ctx:t}),C.$set(nt);const ot={};s&4&&(ot.$$scope={dirty:s,ctx:t}),k.$set(ot);const rt={};s&4&&(rt.$$scope={dirty:s,ctx:t}),I.$set(rt);const at={};s&4&&(at.$$scope={dirty:s,ctx:t}),l.$set(at);const lt={};s&4&&(lt.$$scope={dirty:s,ctx:t}),z.$set(lt)},i(t){K||(d(e.$$.fragment,t),d(r.$$.fragment,t),d(o.$$.fragment,t),d(v.$$.fragment,t),d(A.$$.fragment,t),d(C.$$.fragment,t),d(k.$$.fragment,t),d(I.$$.fragment,t),d(j.$$.fragment,t),d(R.$$.fragment,t),d(l.$$.fragment,t),d(z.$$.fragment,t),d(P.$$.fragment,t),K=!0)},o(t){_(e.$$.fragment,t),_(r.$$.fragment,t),_(o.$$.fragment,t),_(v.$$.fragment,t),_(A.$$.fragment,t),_(C.$$.fragment,t),_(k.$$.fragment,t),_(I.$$.fragment,t),_(j.$$.fragment,t),_(R.$$.fragment,t),_(l.$$.fragment,t),_(z.$$.fragment,t),_(P.$$.fragment,t),K=!1},d(t){t&&(f(n),f(a),f(u),f(m),f(q),f(D),f(x),f(L),f(M),f(S),f(h),f(O)),b(e,t),b(r,t),b(o,t),b(v,t),b(A,t),b(C,t),b(k,t),b(I,t),b(j,t),b(R,t),b(l,t),b(z,t),b(P,t)}}}function Nt(i,e,n){let{data:r}=e;const a=["Horizontal or vertical orientation","Can be controlled or uncontrolled","Full keyboard navigation"];return i.$$set=o=>{"data"in o&&n(0,r=o.data)},[r,a]}class te extends $t{constructor(e){super(),mt(this,e,Nt,Ut,it,{data:0})}}export{te as component,Zt as universal};
