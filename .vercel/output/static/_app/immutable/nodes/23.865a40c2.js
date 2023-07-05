import{T as ft}from"../chunks/tailwind.config.ebd62547.js";import{G as pt}from"../chunks/globals_raw.27244441.js";import{s as st,n as O,e as R,a as g,c as V,g as q,d as w,b as E,f,h as Z,J as F,i as p,A as G,M as $t,N as tt,t as k,l as et,k as D,j as mt}from"../chunks/scheduler.2943ef39.js";import{e as rt}from"../chunks/each.83bf9e7b.js";import{g as W,a as _t}from"../chunks/spread.8a54911c.js";import{S as it,i as lt,c as b,a as S,m as A,t as z,b as C,d as x}from"../chunks/index.c70d9825.js";import"../chunks/index.a1398546.js";import{c as nt}from"../chunks/Balancer.98226975.js";import{D as I}from"../chunks/index.5e8f8c6b.js";const ut=`<script lang="ts">
	import { createSeparator, type CreateSeparatorArgs } from '@melt-ui/svelte';

	export let orientation: CreateSeparatorArgs['orientation'] = 'vertical';

	const { root: vertical } = createSeparator({
		orientation,
	});

	const { root: horizontalSeparator } = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});

	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];
<\/script>

<h2 class="font-bold">Melt UI</h2>
<p>Flavors for everyone</p>
<div {...$horizontalSeparator} class="my-3.5 h-[1px] w-full bg-white" />
<div class="flex items-center space-x-3.5">
	{#each icecreams as icecream, i}
		<p>{icecream}</p>
		{#if i !== icecreams.length - 1}
			<div {...$vertical} class="h-4 w-[1px] bg-white" />
		{/if}
	{/each}
</div>
`,ht=`<script lang="ts">\r
	import { createSeparator, type CreateSeparatorArgs } from '@melt-ui/svelte';\r
\r
	export let orientation: CreateSeparatorArgs['orientation'] = 'vertical';\r
\r
	const { root: vertical } = createSeparator({\r
		orientation,\r
	});\r
\r
	const { root: horizontalSeparator } = createSeparator({\r
		orientation: 'horizontal',\r
		decorative: true,\r
	});\r
\r
	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];\r
<\/script>\r
\r
<h2>Melt UI</h2>\r
<p>Flavors for everyone</p>\r
<div {...$horizontalSeparator} class="separator separator--horizontal" />\r
<div class="ice-creams">\r
	{#each icecreams as icecream, i}\r
		<p>{icecream}</p>\r
		{#if i !== icecreams.length - 1}\r
			<div {...$vertical} class="separator separator--vertical" />\r
		{/if}\r
	{/each}\r
</div>\r
\r
<style lang="postcss">\r
	h2 {\r
		font-weight: var(--tw-font-weight-bold);\r
	}\r
\r
	.ice-creams {\r
		display: flex;\r
		align-items: center;\r
		column-gap: var(--tw-size-3_5);\r
	}\r
\r
	.separator {\r
		--tw-bg-opacity: 1;\r
\r
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));\r
	}\r
\r
	.separator--horizontal {\r
		margin-top: var(--tw-size-3_5);\r
		margin-bottom: var(--tw-size-3_5);\r
		height: 1px;\r
		width: 100%;\r
	}\r
\r
	.separator--vertical {\r
		height: var(--tw-size-4);\r
		width: 1px;\r
	}\r
</style>\r
`;function at(o,t,r){const n=o.slice();return n[6]=t[r],n[8]=r,n}function vt(o){let t,r=[o[1],{class:"h-4 w-[1px] bg-white"}],n={};for(let a=0;a<r.length;a+=1)n=O(n,r[a]);return{c(){t=R("div"),this.h()},l(a){t=V(a,"DIV",{class:!0}),E(t).forEach(f),this.h()},h(){F(t,n)},m(a,i){p(a,t,i)},p(a,i){F(t,n=W(r,[i&2&&a[1],{class:"h-4 w-[1px] bg-white"}]))},d(a){a&&f(t)}}}function ot(o){let t,r=o[6]+"",n,a,i,_=o[8]!==o[4].length-1&&vt(o);return{c(){t=R("p"),n=k(r),a=g(),_&&_.c(),i=et()},l(c){t=V(c,"P",{});var v=E(t);n=D(v,r),v.forEach(f),a=w(c),_&&_.l(c),i=et()},m(c,v){p(c,t,v),mt(t,n),p(c,a,v),_&&_.m(c,v),p(c,i,v)},p(c,v){c[8]!==c[4].length-1&&_.p(c,v)},d(c){c&&(f(t),f(a),f(i)),_&&_.d(c)}}}function dt(o){let t,r="Melt UI",n,a,i="Flavors for everyone",_,c,v,u,T=[o[0],{class:"my-3.5 h-[1px] w-full bg-white"}],d={};for(let s=0;s<T.length;s+=1)d=O(d,T[s]);let y=rt(o[4]),$=[];for(let s=0;s<y.length;s+=1)$[s]=ot(at(o,y,s));return{c(){t=R("h2"),t.textContent=r,n=g(),a=R("p"),a.textContent=i,_=g(),c=R("div"),v=g(),u=R("div");for(let s=0;s<$.length;s+=1)$[s].c();this.h()},l(s){t=V(s,"H2",{class:!0,["data-svelte-h"]:!0}),q(t)!=="svelte-1motaaq"&&(t.textContent=r),n=w(s),a=V(s,"P",{["data-svelte-h"]:!0}),q(a)!=="svelte-uujsbd"&&(a.textContent=i),_=w(s),c=V(s,"DIV",{class:!0}),E(c).forEach(f),v=w(s),u=V(s,"DIV",{class:!0});var h=E(u);for(let m=0;m<$.length;m+=1)$[m].l(h);h.forEach(f),this.h()},h(){Z(t,"class","font-bold"),F(c,d),Z(u,"class","flex items-center space-x-3.5")},m(s,h){p(s,t,h),p(s,n,h),p(s,a,h),p(s,_,h),p(s,c,h),p(s,v,h),p(s,u,h);for(let m=0;m<$.length;m+=1)$[m]&&$[m].m(u,null)},p(s,[h]){if(F(c,d=W(T,[h&1&&s[0],{class:"my-3.5 h-[1px] w-full bg-white"}])),h&18){y=rt(s[4]);let m;for(m=0;m<y.length;m+=1){const P=at(s,y,m);$[m]?$[m].p(P,h):($[m]=ot(P),$[m].c(),$[m].m(u,null))}for(;m<$.length;m+=1)$[m].d(1);$.length=y.length}},i:G,o:G,d(s){s&&(f(t),f(n),f(a),f(_),f(c),f(v),f(u)),$t($,s)}}}function gt(o,t,r){let n,a,{orientation:i="vertical"}=t;const{root:_}=nt({orientation:i});tt(o,_,u=>r(1,a=u));const{root:c}=nt({orientation:"horizontal",decorative:!0});tt(o,c,u=>r(0,n=u));const v=["Caramel","Vanilla","Napolitan"];return o.$$set=u=>{"orientation"in u&&r(5,i=u.orientation)},[n,a,_,c,v,i]}class wt extends it{constructor(t){super(),lt(this,t,gt,dt,st,{orientation:5})}}const bt={"index.svelte":ut,"tailwind.config.ts":ft},St={"index.svelte":ht,"globals.css":pt},At={component:wt,code:{Tailwind:bt,CSS:St}};async function zt(){return{preview:At}}const Jt=Object.freeze(Object.defineProperty({__proto__:null,load:zt},Symbol.toStringTag,{value:"Module"})),Ct={title:"CreateSeparatorArgs",description:"The configuration object passed to the `createSeparator` builder function.",args:[{label:"orientation",type:["'horizontal'","'vertical'"],default:"'horizontal'"},{label:"decorative",type:"boolean",default:!1}]},xt={builder:Ct};function It(o){let t;return{c(){t=k("Separator")},l(r){t=D(r,"Separator")},m(r,n){p(r,t,n)},d(r){r&&f(t)}}}function yt(o){let t;return{c(){t=k("Displays a horizontal or vertical line to separate content.")},l(r){t=D(r,"Displays a horizontal or vertical line to separate content.")},m(r,n){p(r,t,n)},d(r){r&&f(t)}}}function Pt(o){let t;return{c(){t=k("Anatomy")},l(r){t=D(r,"Anatomy")},m(r,n){p(r,t,n)},d(r){r&&f(t)}}}function kt(o){let t,r="Root:",n;return{c(){t=R("b"),t.textContent=r,n=k(" The root container for the separator")},l(a){t=V(a,"B",{["data-svelte-h"]:!0}),q(t)!=="svelte-ss75j2"&&(t.textContent=r),n=D(a," The root container for the separator")},m(a,i){p(a,t,i),p(a,n,i)},p:G,d(a){a&&(f(t),f(n))}}}function Dt(o){let t,r;return t=new I.Li({props:{$$slots:{default:[kt]},$$scope:{ctx:o}}}),{c(){b(t.$$.fragment)},l(n){S(t.$$.fragment,n)},m(n,a){A(t,n,a),r=!0},p(n,a){const i={};a&4&&(i.$$scope={dirty:a,ctx:n}),t.$set(i)},i(n){r||(z(t.$$.fragment,n),r=!0)},o(n){C(t.$$.fragment,n),r=!1},d(n){x(t,n)}}}function Tt(o){let t;return{c(){t=k("API Reference")},l(r){t=D(r,"API Reference")},m(r,n){p(r,t,n)},d(r){r&&f(t)}}}function jt(o){let t;return{c(){t=k("Accessibility")},l(r){t=D(r,"Accessibility")},m(r,n){p(r,t,n)},d(r){r&&f(t)}}}function Rt(o){let t;return{c(){t=k("Separator WAI-ARIA role")},l(r){t=D(r,"Separator WAI-ARIA role")},m(r,n){p(r,t,n)},d(r){r&&f(t)}}}function Vt(o){let t,r,n;return r=new I.A({props:{href:"https://www.w3.org/TR/wai-aria-1.2/#separator",$$slots:{default:[Rt]},$$scope:{ctx:o}}}),{c(){t=k(`Adheres to the
	`),b(r.$$.fragment)},l(a){t=D(a,`Adheres to the
	`),S(r.$$.fragment,a)},m(a,i){p(a,t,i),A(r,a,i),n=!0},p(a,i){const _={};i&4&&(_.$$scope={dirty:i,ctx:a}),r.$set(_)},i(a){n||(z(r.$$.fragment,a),n=!0)},o(a){C(r.$$.fragment,a),n=!1},d(a){a&&f(t),x(r,a)}}}function Ht(o){let t,r,n,a,i,_,c,v,u,T,d,y,$,s,h,m,P,H,j,M;t=new I.H1({props:{$$slots:{default:[It]},$$scope:{ctx:o}}}),n=new I.Description({props:{$$slots:{default:[yt]},$$scope:{ctx:o}}});const N=[o[0].preview];let U={};for(let e=0;e<N.length;e+=1)U=O(U,N[e]);return i=new I.Preview({props:U}),c=new I.Features({props:{features:o[1]}}),u=new I.H2({props:{$$slots:{default:[Pt]},$$scope:{ctx:o}}}),d=new I.Ul({props:{$$slots:{default:[Dt]},$$scope:{ctx:o}}}),$=new I.H2({props:{$$slots:{default:[Tt]},$$scope:{ctx:o}}}),h=new I.API({props:{schema:xt.builder}}),P=new I.H2({props:{$$slots:{default:[jt]},$$scope:{ctx:o}}}),j=new I.P({props:{$$slots:{default:[Vt]},$$scope:{ctx:o}}}),{c(){b(t.$$.fragment),r=g(),b(n.$$.fragment),a=g(),b(i.$$.fragment),_=g(),b(c.$$.fragment),v=g(),b(u.$$.fragment),T=g(),b(d.$$.fragment),y=g(),b($.$$.fragment),s=g(),b(h.$$.fragment),m=g(),b(P.$$.fragment),H=g(),b(j.$$.fragment)},l(e){S(t.$$.fragment,e),r=w(e),S(n.$$.fragment,e),a=w(e),S(i.$$.fragment,e),_=w(e),S(c.$$.fragment,e),v=w(e),S(u.$$.fragment,e),T=w(e),S(d.$$.fragment,e),y=w(e),S($.$$.fragment,e),s=w(e),S(h.$$.fragment,e),m=w(e),S(P.$$.fragment,e),H=w(e),S(j.$$.fragment,e)},m(e,l){A(t,e,l),p(e,r,l),A(n,e,l),p(e,a,l),A(i,e,l),p(e,_,l),A(c,e,l),p(e,v,l),A(u,e,l),p(e,T,l),A(d,e,l),p(e,y,l),A($,e,l),p(e,s,l),A(h,e,l),p(e,m,l),A(P,e,l),p(e,H,l),A(j,e,l),M=!0},p(e,[l]){const B={};l&4&&(B.$$scope={dirty:l,ctx:e}),t.$set(B);const J={};l&4&&(J.$$scope={dirty:l,ctx:e}),n.$set(J);const ct=l&1?W(N,[_t(e[0].preview)]):{};i.$set(ct);const L={};l&4&&(L.$$scope={dirty:l,ctx:e}),u.$set(L);const K={};l&4&&(K.$$scope={dirty:l,ctx:e}),d.$set(K);const Q={};l&4&&(Q.$$scope={dirty:l,ctx:e}),$.$set(Q);const X={};l&4&&(X.$$scope={dirty:l,ctx:e}),P.$set(X);const Y={};l&4&&(Y.$$scope={dirty:l,ctx:e}),j.$set(Y)},i(e){M||(z(t.$$.fragment,e),z(n.$$.fragment,e),z(i.$$.fragment,e),z(c.$$.fragment,e),z(u.$$.fragment,e),z(d.$$.fragment,e),z($.$$.fragment,e),z(h.$$.fragment,e),z(P.$$.fragment,e),z(j.$$.fragment,e),M=!0)},o(e){C(t.$$.fragment,e),C(n.$$.fragment,e),C(i.$$.fragment,e),C(c.$$.fragment,e),C(u.$$.fragment,e),C(d.$$.fragment,e),C($.$$.fragment,e),C(h.$$.fragment,e),C(P.$$.fragment,e),C(j.$$.fragment,e),M=!1},d(e){e&&(f(r),f(a),f(_),f(v),f(T),f(y),f(s),f(m),f(H)),x(t,e),x(n,e),x(i,e),x(c,e),x(u,e),x(d,e),x($,e),x(h,e),x(P,e),x(j,e)}}}function Mt(o,t,r){let{data:n}=t;const a=["Supports horizontal and vertical orientation","Supports decorative and non-decorative separators"];return o.$$set=i=>{"data"in i&&r(0,n=i.data)},[n,a]}class Lt extends it{constructor(t){super(),lt(this,t,Mt,Ht,st,{data:0})}}export{Lt as component,Jt as universal};
