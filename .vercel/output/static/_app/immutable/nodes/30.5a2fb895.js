import{T as Ft}from"../chunks/tailwind.config.ebd62547.js";import{s as Vt,n as j,e as V,a as $,t as rt,c as W,b as L,f as l,d,k as at,J as p,W as f,i as T,j as _,u as ot,y as qt,N as gt}from"../chunks/scheduler.2943ef39.js";import{S as Wt,i as Lt,c as h,a as w,m as k,t as y,b as A,d as I}from"../chunks/index.c70d9825.js";import{g as K,a as Jt}from"../chunks/spread.8a54911c.js";import"../chunks/index.a1398546.js";import{B as Kt,S as Qt,c as Xt}from"../chunks/strikethrough.9124b127.js";import{I as Yt}from"../chunks/italic.80ac6d94.js";import{A as Zt,a as xt,b as te}from"../chunks/align-right.3a47640d.js";import{D as S}from"../chunks/index.5e8f8c6b.js";const ee=`<script lang="ts">
	import { createToolbar } from '@melt-ui/svelte';
	import { Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight } from 'icons';

	const { root, button, link, separator, createToolbarGroup } = createToolbar();
	const { root: fontGroup, item: fontItem } = createToolbarGroup({
		type: 'multiple',
	});
	const { root: alignGroup, item: alignItem } = createToolbarGroup();
<\/script>

<div
	{...$root}
	class="flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm"
>
	<div class="group" {...$fontGroup}>
		<button class="item" {...$fontItem('bold')} use:fontItem.action>
			<Bold />
		</button>
		<button class="item" {...$fontItem('italic')} use:fontItem.action>
			<Italic />
		</button>
		<button class="item" {...$fontItem('strikethrough')} use:fontItem.action>
			<Strikethrough />
		</button>
	</div>
	<div class="separator" {...$separator} />
	<div class="group" {...$alignGroup}>
		<button class="item" {...$alignItem('left')} use:alignItem.action>
			<AlignLeft />
		</button>
		<button class="item" {...$alignItem('center')} use:alignItem.action>
			<AlignCenter />
		</button>
		<button class="item" {...$alignItem('right')} use:alignItem.action>
			<AlignRight />
		</button>
	</div>
	<div class="separator" {...$separator} />
	<!-- svelte-ignore a11y-invalid-attribute -->
	<a href="#" class="link nowrap flex-shrink-0" {...link} use:link.action> Edited 2 hours ago </a>
	<button class="button" {...button} use:button.action>Save</button>
</div>

<style lang="postcss">
	.group {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.item {
		padding: theme('spacing.1');
		border-radius: theme('borderRadius.md');

		&:hover {
			background-color: theme('colors.magnum.100');
		}

		&[data-state='on'] {
			background-color: theme('colors.magnum.200');
			color: theme('colors.magnum.900');
		}
	}

	.separator {
		width: 1px;
		background-color: theme('colors.neutral.300');
		align-self: stretch;
	}

	.button {
		background-color: theme('colors.magnum.600');
		color: theme('colors.magnum.100');
		padding: theme('spacing.1') theme('spacing.3');
		border-radius: theme('borderRadius.md');
		font-weight: theme('fontWeight.medium');
		margin-inline-start: auto;

		&:hover {
			opacity: theme('opacity.75');
		}

		&:active {
			opacity: theme('opacity.50');
		}
	}
</style>
`;function oe(r){let o,n,s,i,c,g,P,Q,b,D,O,B,M,z,v,R,N,u,C,Z,E,F,X,H,Y,U,q,x,G,tt,J,et,st;i=new Kt({});let lt=[{class:"item"},r[2]("bold")],t={};for(let e=0;e<lt.length;e+=1)t=j(t,lt[e]);P=new Yt({});let a=[{class:"item"},r[2]("italic")],it={};for(let e=0;e<a.length;e+=1)it=j(it,a[e]);D=new Qt({});let mt=[{class:"item"},r[2]("strikethrough")],ft={};for(let e=0;e<mt.length;e+=1)ft=j(ft,mt[e]);let ct=[{class:"group"},r[1]],ut={};for(let e=0;e<ct.length;e+=1)ut=j(ut,ct[e]);let pt=[{class:"separator"},r[3]],bt={};for(let e=0;e<pt.length;e+=1)bt=j(bt,pt[e]);R=new Zt({});let At=[{class:"item"},r[5]("left")],vt={};for(let e=0;e<At.length;e+=1)vt=j(vt,At[e]);C=new xt({});let It=[{class:"item"},r[5]("center")],_t={};for(let e=0;e<It.length;e+=1)_t=j(_t,It[e]);F=new te({});let Tt=[{class:"item"},r[5]("right")],ht={};for(let e=0;e<Tt.length;e+=1)ht=j(ht,Tt[e]);let zt=[{class:"group"},r[4]],wt={};for(let e=0;e<zt.length;e+=1)wt=j(wt,zt[e]);let Et=[{class:"separator"},r[3]],kt={};for(let e=0;e<Et.length;e+=1)kt=j(kt,Et[e]);let Bt=[{href:"#"},{class:"link nowrap flex-shrink-0"},r[8]],Gt={};for(let e=0;e<Bt.length;e+=1)Gt=j(Gt,Bt[e]);let Rt=[{class:"button"},r[7]],Pt={};for(let e=0;e<Rt.length;e+=1)Pt=j(Pt,Rt[e]);let St=[r[0],{class:"flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm"}],yt={};for(let e=0;e<St.length;e+=1)yt=j(yt,St[e]);return{c(){o=V("div"),n=V("div"),s=V("button"),h(i.$$.fragment),c=$(),g=V("button"),h(P.$$.fragment),Q=$(),b=V("button"),h(D.$$.fragment),O=$(),B=V("div"),M=$(),z=V("div"),v=V("button"),h(R.$$.fragment),N=$(),u=V("button"),h(C.$$.fragment),Z=$(),E=V("button"),h(F.$$.fragment),X=$(),H=V("div"),Y=$(),U=V("a"),q=rt("Edited 2 hours ago"),x=$(),G=V("button"),tt=rt("Save"),this.h()},l(e){o=W(e,"DIV",{class:!0});var m=L(o);n=W(m,"DIV",{class:!0});var $t=L(n);s=W($t,"BUTTON",{class:!0});var Ct=L(s);w(i.$$.fragment,Ct),Ct.forEach(l),c=d($t),g=W($t,"BUTTON",{class:!0});var Dt=L(g);w(P.$$.fragment,Dt),Dt.forEach(l),Q=d($t),b=W($t,"BUTTON",{class:!0});var Ot=L(b);w(D.$$.fragment,Ot),Ot.forEach(l),$t.forEach(l),O=d(m),B=W(m,"DIV",{class:!0}),L(B).forEach(l),M=d(m),z=W(m,"DIV",{class:!0});var dt=L(z);v=W(dt,"BUTTON",{class:!0});var Mt=L(v);w(R.$$.fragment,Mt),Mt.forEach(l),N=d(dt),u=W(dt,"BUTTON",{class:!0});var Nt=L(u);w(C.$$.fragment,Nt),Nt.forEach(l),Z=d(dt),E=W(dt,"BUTTON",{class:!0});var Ut=L(E);w(F.$$.fragment,Ut),Ut.forEach(l),dt.forEach(l),X=d(m),H=W(m,"DIV",{class:!0}),L(H).forEach(l),Y=d(m),U=W(m,"A",{href:!0,class:!0});var jt=L(U);q=at(jt,"Edited 2 hours ago"),jt.forEach(l),x=d(m),G=W(m,"BUTTON",{class:!0});var Ht=L(G);tt=at(Ht,"Save"),Ht.forEach(l),m.forEach(l),this.h()},h(){p(s,t),f(s,"svelte-khzvyd",!0),p(g,it),f(g,"svelte-khzvyd",!0),p(b,ft),f(b,"svelte-khzvyd",!0),p(n,ut),f(n,"svelte-khzvyd",!0),p(B,bt),f(B,"svelte-khzvyd",!0),p(v,vt),f(v,"svelte-khzvyd",!0),p(u,_t),f(u,"svelte-khzvyd",!0),p(E,ht),f(E,"svelte-khzvyd",!0),p(z,wt),f(z,"svelte-khzvyd",!0),p(H,kt),f(H,"svelte-khzvyd",!0),p(U,Gt),f(U,"svelte-khzvyd",!0),p(G,Pt),f(G,"svelte-khzvyd",!0),p(o,yt),f(o,"svelte-khzvyd",!0)},m(e,m){T(e,o,m),_(o,n),_(n,s),k(i,s,null),s.autofocus&&s.focus(),_(n,c),_(n,g),k(P,g,null),g.autofocus&&g.focus(),_(n,Q),_(n,b),k(D,b,null),b.autofocus&&b.focus(),_(o,O),_(o,B),_(o,M),_(o,z),_(z,v),k(R,v,null),v.autofocus&&v.focus(),_(z,N),_(z,u),k(C,u,null),u.autofocus&&u.focus(),_(z,Z),_(z,E),k(F,E,null),E.autofocus&&E.focus(),_(o,X),_(o,H),_(o,Y),_(o,U),_(U,q),_(o,x),_(o,G),_(G,tt),G.autofocus&&G.focus(),J=!0,et||(st=[ot(r[11].action(s)),ot(r[11].action(g)),ot(r[11].action(b)),ot(r[13].action(v)),ot(r[13].action(u)),ot(r[13].action(E)),ot(r[8].action(U)),ot(r[7].action(G))],et=!0)},p(e,[m]){p(s,t=K(lt,[{class:"item"},m&4&&e[2]("bold")])),f(s,"svelte-khzvyd",!0),p(g,it=K(a,[{class:"item"},m&4&&e[2]("italic")])),f(g,"svelte-khzvyd",!0),p(b,ft=K(mt,[{class:"item"},m&4&&e[2]("strikethrough")])),f(b,"svelte-khzvyd",!0),p(n,ut=K(ct,[{class:"group"},m&2&&e[1]])),f(n,"svelte-khzvyd",!0),p(B,bt=K(pt,[{class:"separator"},m&8&&e[3]])),f(B,"svelte-khzvyd",!0),p(v,vt=K(At,[{class:"item"},m&32&&e[5]("left")])),f(v,"svelte-khzvyd",!0),p(u,_t=K(It,[{class:"item"},m&32&&e[5]("center")])),f(u,"svelte-khzvyd",!0),p(E,ht=K(Tt,[{class:"item"},m&32&&e[5]("right")])),f(E,"svelte-khzvyd",!0),p(z,wt=K(zt,[{class:"group"},m&16&&e[4]])),f(z,"svelte-khzvyd",!0),p(H,kt=K(Et,[{class:"separator"},m&8&&e[3]])),f(H,"svelte-khzvyd",!0),f(U,"svelte-khzvyd",!0),f(G,"svelte-khzvyd",!0),p(o,yt=K(St,[m&1&&e[0],{class:"flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm"}])),f(o,"svelte-khzvyd",!0)},i(e){J||(y(i.$$.fragment,e),y(P.$$.fragment,e),y(D.$$.fragment,e),y(R.$$.fragment,e),y(C.$$.fragment,e),y(F.$$.fragment,e),J=!0)},o(e){A(i.$$.fragment,e),A(P.$$.fragment,e),A(D.$$.fragment,e),A(R.$$.fragment,e),A(C.$$.fragment,e),A(F.$$.fragment,e),J=!1},d(e){e&&l(o),I(i),I(P),I(D),I(R),I(C),I(F),et=!1,qt(st)}}}function ne(r,o,n){let s,i,c,g,P,Q;const{root:b,button:D,link:O,separator:B,createToolbarGroup:M}=Xt();gt(r,b,u=>n(0,s=u)),gt(r,B,u=>n(3,g=u));const{root:z,item:v}=M({type:"multiple"});gt(r,z,u=>n(1,i=u)),gt(r,v,u=>n(2,c=u));const{root:R,item:N}=M();return gt(r,R,u=>n(4,P=u)),gt(r,N,u=>n(5,Q=u)),[s,i,c,g,P,Q,b,D,O,B,z,v,R,N]}class re extends Wt{constructor(o){super(),Lt(this,o,ne,oe,Vt,{})}}const ae={"index.svelte":ee,"tailwind.config.ts":Ft},se=null,le={component:re,code:{Tailwind:ae,CSS:se}};async function ie(){return{preview:le}}const De=Object.freeze(Object.defineProperty({__proto__:null,load:ie},Symbol.toStringTag,{value:"Module"})),ue={title:"CreateToolbarArgs",description:"The configuration object passed to the `createToolbar` builder function.",args:[{label:"loop",type:"boolean",default:!0},{label:"orientation",type:["'horizontal'","'vertical'"]}]},me={title:"Root",description:"The root toolbar element.",dataAttributes:[{label:"data-orientation",value:["'horizontal'","'vertical'"]},{label:"data-melt-toolbar",value:""}]},fe={title:"Button",description:"The toolbar button element.",dataAttributes:[{label:"data-melt-toolbar-item",value:""}]},ce={title:"Link",description:"The toolbar link element.",dataAttributes:[{label:"data-melt-toolbar-item",value:""}]},pe={title:"Separator",description:"The toolbar separator element.",dataAttributes:[{label:"data-orientation",value:["'horizontal'","'vertical'"]},{label:"data-melt-toolbar-separator",value:""}]},$e={title:"CreateToolbarGroupArgs",description:"Configuration options for the `createToolbarGroup` builder.",args:[{label:"type",type:["'single'","'multiple'"],default:"'single'"},{label:"value",type:["string","string[]","null"]},{label:"disabled",type:"boolean",default:!1}]},de={title:"Group Root",description:"The root toolbar element for a toolbar group.",dataAttributes:[{label:"data-orientation",value:["'horizontal'","'vertical'"]},{label:"data-melt-toolbar-group",value:""}]},ge={title:"Group Item",description:"A an item within a toolbar group.",args:[{label:"value",type:"string"},{label:"disabled",type:"boolean",default:!1}],dataAttributes:[{label:"data-orientation",value:["'horizontal'","'vertical'"]},{label:"data-melt-toolbar-item",value:""},{label:"data-disabled",value:"Present if the item is disabled."},{label:"data-state",value:["'on'","'off'"]}]},be={title:"Keyboard Interactions",description:"",keyboardInteractions:[{key:"Tab",description:"Moves focus to the first item in the group."},{key:"Space",description:"Toggles the state of the focused item."},{key:"Enter",description:"Toggles the state of the focused item."},{key:"ArrowDown",description:"Moves focus to the next item depeding on `orientation`."},{key:"ArrowRight",description:"Moves focus to the next item depeding on `orientation`."},{key:"ArrowDown",description:"Moves focus to the previous item depeding on `orientation`."},{key:"ArrowLeft",description:"Moves focus to the previous item depeding on `orientation`."},{key:"Home",description:"Moves focus to the first item."},{key:"End",description:"Moves focus to the last item."}]},nt={builder:ue,root:me,button:fe,link:ce,separator:pe,groupBuilder:$e,groupRoot:de,groupItem:ge,keyboard:be};function ve(r){let o;return{c(){o=rt("Toolbar")},l(n){o=at(n,"Toolbar")},m(n,s){T(n,o,s)},d(n){n&&l(o)}}}function _e(r){let o;return{c(){o=rt("A container for grouping a set of controls, such as buttons, toggle groups or dropdown menus.")},l(n){o=at(n,"A container for grouping a set of controls, such as buttons, toggle groups or dropdown menus.")},m(n,s){T(n,o,s)},d(n){n&&l(o)}}}function he(r){let o;return{c(){o=rt("API Reference")},l(n){o=at(n,"API Reference")},m(n,s){T(n,o,s)},d(n){n&&l(o)}}}function we(r){let o;return{c(){o=rt("Accessibility")},l(n){o=at(n,"Accessibility")},m(n,s){T(n,o,s)},d(n){n&&l(o)}}}function ke(r){let o;return{c(){o=rt("Toolbar WAI-ARIA design pattern")},l(n){o=at(n,"Toolbar WAI-ARIA design pattern")},m(n,s){T(n,o,s)},d(n){n&&l(o)}}}function ye(r){let o,n,s;return n=new S.A({props:{href:"https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/",$$slots:{default:[ke]},$$scope:{ctx:r}}}),{c(){o=rt(`Adheres to the
	`),h(n.$$.fragment)},l(i){o=at(i,`Adheres to the
	`),w(n.$$.fragment,i)},m(i,c){T(i,o,c),k(n,i,c),s=!0},p(i,c){const g={};c&4&&(g.$$scope={dirty:c,ctx:i}),n.$set(g)},i(i){s||(y(n.$$.fragment,i),s=!0)},o(i){A(n.$$.fragment,i),s=!1},d(i){i&&l(o),I(n,i)}}}function Ae(r){let o,n,s,i,c,g,P,Q,b,D,O,B,M,z,v,R,N,u,C,Z,E,F,X,H,Y,U,q,x,G,tt,J,et;o=new S.H1({props:{$$slots:{default:[ve]},$$scope:{ctx:r}}}),s=new S.Description({props:{$$slots:{default:[_e]},$$scope:{ctx:r}}});const st=[r[0].preview,{fullwidth:!0}];let lt={};for(let t=0;t<st.length;t+=1)lt=j(lt,st[t]);return c=new S.Preview({props:lt}),P=new S.Construction({}),b=new S.Features({props:{features:r[1]}}),O=new S.H2({props:{$$slots:{default:[he]},$$scope:{ctx:r}}}),M=new S.API({props:{schema:nt.builder}}),v=new S.API({props:{schema:nt.root}}),N=new S.API({props:{schema:nt.button}}),C=new S.API({props:{schema:nt.link}}),E=new S.API({props:{schema:nt.groupBuilder}}),X=new S.API({props:{schema:nt.groupRoot}}),Y=new S.API({props:{schema:nt.groupItem}}),q=new S.H2({props:{$$slots:{default:[we]},$$scope:{ctx:r}}}),G=new S.P({props:{$$slots:{default:[ye]},$$scope:{ctx:r}}}),J=new S.API({props:{schema:nt.keyboard}}),{c(){h(o.$$.fragment),n=$(),h(s.$$.fragment),i=$(),h(c.$$.fragment),g=$(),h(P.$$.fragment),Q=$(),h(b.$$.fragment),D=$(),h(O.$$.fragment),B=$(),h(M.$$.fragment),z=$(),h(v.$$.fragment),R=$(),h(N.$$.fragment),u=$(),h(C.$$.fragment),Z=$(),h(E.$$.fragment),F=$(),h(X.$$.fragment),H=$(),h(Y.$$.fragment),U=$(),h(q.$$.fragment),x=$(),h(G.$$.fragment),tt=$(),h(J.$$.fragment)},l(t){w(o.$$.fragment,t),n=d(t),w(s.$$.fragment,t),i=d(t),w(c.$$.fragment,t),g=d(t),w(P.$$.fragment,t),Q=d(t),w(b.$$.fragment,t),D=d(t),w(O.$$.fragment,t),B=d(t),w(M.$$.fragment,t),z=d(t),w(v.$$.fragment,t),R=d(t),w(N.$$.fragment,t),u=d(t),w(C.$$.fragment,t),Z=d(t),w(E.$$.fragment,t),F=d(t),w(X.$$.fragment,t),H=d(t),w(Y.$$.fragment,t),U=d(t),w(q.$$.fragment,t),x=d(t),w(G.$$.fragment,t),tt=d(t),w(J.$$.fragment,t)},m(t,a){k(o,t,a),T(t,n,a),k(s,t,a),T(t,i,a),k(c,t,a),T(t,g,a),k(P,t,a),T(t,Q,a),k(b,t,a),T(t,D,a),k(O,t,a),T(t,B,a),k(M,t,a),T(t,z,a),k(v,t,a),T(t,R,a),k(N,t,a),T(t,u,a),k(C,t,a),T(t,Z,a),k(E,t,a),T(t,F,a),k(X,t,a),T(t,H,a),k(Y,t,a),T(t,U,a),k(q,t,a),T(t,x,a),k(G,t,a),T(t,tt,a),k(J,t,a),et=!0},p(t,[a]){const it={};a&4&&(it.$$scope={dirty:a,ctx:t}),o.$set(it);const mt={};a&4&&(mt.$$scope={dirty:a,ctx:t}),s.$set(mt);const ft=a&1?K(st,[Jt(t[0].preview),st[1]]):{};c.$set(ft);const ct={};a&4&&(ct.$$scope={dirty:a,ctx:t}),O.$set(ct);const ut={};a&4&&(ut.$$scope={dirty:a,ctx:t}),q.$set(ut);const pt={};a&4&&(pt.$$scope={dirty:a,ctx:t}),G.$set(pt)},i(t){et||(y(o.$$.fragment,t),y(s.$$.fragment,t),y(c.$$.fragment,t),y(P.$$.fragment,t),y(b.$$.fragment,t),y(O.$$.fragment,t),y(M.$$.fragment,t),y(v.$$.fragment,t),y(N.$$.fragment,t),y(C.$$.fragment,t),y(E.$$.fragment,t),y(X.$$.fragment,t),y(Y.$$.fragment,t),y(q.$$.fragment,t),y(G.$$.fragment,t),y(J.$$.fragment,t),et=!0)},o(t){A(o.$$.fragment,t),A(s.$$.fragment,t),A(c.$$.fragment,t),A(P.$$.fragment,t),A(b.$$.fragment,t),A(O.$$.fragment,t),A(M.$$.fragment,t),A(v.$$.fragment,t),A(N.$$.fragment,t),A(C.$$.fragment,t),A(E.$$.fragment,t),A(X.$$.fragment,t),A(Y.$$.fragment,t),A(q.$$.fragment,t),A(G.$$.fragment,t),A(J.$$.fragment,t),et=!1},d(t){t&&(l(n),l(i),l(g),l(Q),l(D),l(B),l(z),l(R),l(u),l(Z),l(F),l(H),l(U),l(x),l(tt)),I(o,t),I(s,t),I(c,t),I(P,t),I(b,t),I(O,t),I(M,t),I(v,t),I(N,t),I(C,t),I(E,t),I(X,t),I(Y,t),I(q,t),I(G,t),I(J,t)}}}function Ie(r,o,n){let{data:s}=o;const i=["Full keyboard navigation","Can be controlled or uncontrolled","Horizontal or vertical orientation"];return r.$$set=c=>{"data"in c&&n(0,s=c.data)},[s,i]}class Oe extends Wt{constructor(o){super(),Lt(this,o,Ie,Ae,Vt,{data:0})}}export{Oe as component,De as universal};
