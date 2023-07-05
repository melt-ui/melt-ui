import{T as Yt}from"../chunks/tailwind.config.ebd62547.js";import{s as Gt,n as tt,e as w,t as B,a as p,c as T,b as nt,k as R,f as u,d as $,g as V,J as P,W as S,h as st,i as d,j as f,u as It,A as gt,y as Qt,N as Lt}from"../chunks/scheduler.2943ef39.js";import{g as et,a as Xt}from"../chunks/spread.8a54911c.js";import{S as Jt,i as Kt,c as C,a as A,m as x,t as k,b as I,d as L}from"../chunks/index.c70d9825.js";import{c as Zt}from"../chunks/create.6a8ca084.js";import{D as M}from"../chunks/index.5e8f8c6b.js";const te=`<script lang="ts">
	import { createTabs } from '@melt-ui/svelte';
	const { root, list, content, trigger } = createTabs({ value: 'tab1' });
<\/script>

<div {...$root} class="root">
	<div {...$list} class="list" aria-label="Manage your account">
		<button {...$trigger('tab1')} use:trigger.action class="trigger">Account</button>
		<button {...$trigger('tab2')} use:trigger.action class="trigger">Password</button>
		<!-- You don't need to set disabled on the action when using a button element, since
			$trigger will set the 'disabled' attribute on the button -->
		<button
			use:trigger.action
			{...$trigger({ value: 'tab3', disabled: true })}
			class="trigger opacity-50">Disabled</button
		>
		<button {...$trigger('tab4')} use:trigger.action class="trigger">Settings</button>
	</div>
	<div {...$content('tab1')} class="content">
		<p class="description">Make changes to your account here. Click save when you're done.</p>
		<fieldset>
			<label for="name"> Name </label>
			<input id="name" value="Thomas G. Lopes" />
		</fieldset>

		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
	<div {...$content('tab2')} class="content">
		<p class="description">Change your password here. Click save when you're done.</p>
		<fieldset>
			<label for="new"> New password </label>
			<input id="new" type="password" />
		</fieldset>
		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
	<div {...$content('tab4')} class="content">
		<p class="description">Change your settings here. Click save when you're done.</p>

		<fieldset>
			<label for="new"> New email </label>
			<input id="new" type="password" />
		</fieldset>
		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
</div>

<style lang="postcss">
	/* Tab Parts */
	.root {
		@apply flex flex-col overflow-hidden rounded-md shadow-lg data-[orientation=vertical]:flex-row;
	}

	.list {
		@apply flex shrink-0 border-b border-magnum-100 bg-white data-[orientation=vertical]:flex-col
			data-[orientation=vertical]:border-r;
		overflow-x: auto;
	}

	.trigger {
		@apply flex h-11 flex-1 cursor-default select-none items-center
      justify-center rounded-none bg-white px-5 leading-none text-magnum-900
			 focus:relative;
	}

	.trigger[data-orientation='vertical'] {
		@apply w-full flex-grow-0 rounded-none border-b border-r-2 border-transparent border-b-magnum-100 py-4  last:border-b-0;
	}

	.trigger[data-state='active'] {
		@apply text-magnum-700 focus:relative;
	}

	.trigger[data-state='active'][data-orientation='horizontal'] {
		@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative;
	}

	.trigger[data-state='active'][data-orientation='vertical'] {
		@apply border-r-magnum-500;
	}

	.content {
		@apply grow bg-white p-5;
	}

	/* Content Elements */
	.description {
		@apply mb-5 leading-normal text-magnum-950;
	}

	fieldset {
		@apply mb-4 flex w-full flex-col justify-start;
	}

	label {
		@apply mb-2.5 block text-sm leading-none text-magnum-950;
	}

	input {
		@apply h-8 shrink-0 grow rounded border px-2.5 leading-none text-magnum-900  focus:ring focus:ring-magnum-800;
	}

	.actions {
		@apply mt-5 flex justify-end;
	}

	button {
		@apply inline-flex h-8 cursor-default items-center justify-center rounded bg-green-100 px-[15px] font-medium leading-none text-green-900;
	}
</style>
`;function ee(r){let e,n,s,a,c,m,v,D,l,g,b,y,H,U,_,q,K="Make changes to your account here. Click save when you're done.",at,N,it='<label for="name" class="svelte-1mjlia9">Name</label> <input id="name" value="Thomas G. Lopes" class="svelte-1mjlia9"/>',W,O,Y='<button class="svelte-1mjlia9">Save changes</button>',lt,h,F,G="Change your password here. Click save when you're done.",ot,z,ct='<label for="new" class="svelte-1mjlia9">New password</label> <input id="new" type="password" class="svelte-1mjlia9"/>',ut,J,t='<button class="svelte-1mjlia9">Save changes</button>',i,E,Q,_t="Change your settings here. Click save when you're done.",ft,X,vt='<label for="new" class="svelte-1mjlia9">New email</label> <input id="new" type="password" class="svelte-1mjlia9"/>',dt,Z,Vt='<button class="svelte-1mjlia9">Save changes</button>',Mt,qt,Pt=[r[2]("tab1"),{class:"trigger"}],ht={};for(let o=0;o<Pt.length;o+=1)ht=tt(ht,Pt[o]);let St=[r[2]("tab2"),{class:"trigger"}],wt={};for(let o=0;o<St.length;o+=1)wt=tt(wt,St[o]);let Dt=[r[2]({value:"tab3",disabled:!0}),{class:"trigger opacity-50"}],Tt={};for(let o=0;o<Dt.length;o+=1)Tt=tt(Tt,Dt[o]);let Et=[r[2]("tab4"),{class:"trigger"}],yt={};for(let o=0;o<Et.length;o+=1)yt=tt(yt,Et[o]);let Ht=[r[1],{class:"list"},{"aria-label":"Manage your account"}],jt={};for(let o=0;o<Ht.length;o+=1)jt=tt(jt,Ht[o]);let Nt=[r[3]("tab1"),{class:"content"}],Ct={};for(let o=0;o<Nt.length;o+=1)Ct=tt(Ct,Nt[o]);let zt=[r[3]("tab2"),{class:"content"}],At={};for(let o=0;o<zt.length;o+=1)At=tt(At,zt[o]);let Bt=[r[3]("tab4"),{class:"content"}],xt={};for(let o=0;o<Bt.length;o+=1)xt=tt(xt,Bt[o]);let Rt=[r[0],{class:"root"}],kt={};for(let o=0;o<Rt.length;o+=1)kt=tt(kt,Rt[o]);return{c(){e=w("div"),n=w("div"),s=w("button"),a=B("Account"),c=p(),m=w("button"),v=B("Password"),D=p(),l=w("button"),g=B("Disabled"),b=p(),y=w("button"),H=B("Settings"),U=p(),_=w("div"),q=w("p"),q.textContent=K,at=p(),N=w("fieldset"),N.innerHTML=it,W=p(),O=w("div"),O.innerHTML=Y,lt=p(),h=w("div"),F=w("p"),F.textContent=G,ot=p(),z=w("fieldset"),z.innerHTML=ct,ut=p(),J=w("div"),J.innerHTML=t,i=p(),E=w("div"),Q=w("p"),Q.textContent=_t,ft=p(),X=w("fieldset"),X.innerHTML=vt,dt=p(),Z=w("div"),Z.innerHTML=Vt,this.h()},l(o){e=T(o,"DIV",{class:!0});var j=nt(e);n=T(j,"DIV",{class:!0,"aria-label":!0});var rt=nt(n);s=T(rt,"BUTTON",{class:!0});var Ot=nt(s);a=R(Ot,"Account"),Ot.forEach(u),c=$(rt),m=T(rt,"BUTTON",{class:!0});var Ft=nt(m);v=R(Ft,"Password"),Ft.forEach(u),D=$(rt),l=T(rt,"BUTTON",{class:!0});var Ut=nt(l);g=R(Ut,"Disabled"),Ut.forEach(u),b=$(rt),y=T(rt,"BUTTON",{class:!0});var Wt=nt(y);H=R(Wt,"Settings"),Wt.forEach(u),rt.forEach(u),U=$(j),_=T(j,"DIV",{class:!0});var pt=nt(_);q=T(pt,"P",{class:!0,["data-svelte-h"]:!0}),V(q)!=="svelte-1syzrrd"&&(q.textContent=K),at=$(pt),N=T(pt,"FIELDSET",{class:!0,["data-svelte-h"]:!0}),V(N)!=="svelte-66f99n"&&(N.innerHTML=it),W=$(pt),O=T(pt,"DIV",{class:!0,["data-svelte-h"]:!0}),V(O)!=="svelte-wwp1vq"&&(O.innerHTML=Y),pt.forEach(u),lt=$(j),h=T(j,"DIV",{class:!0});var $t=nt(h);F=T($t,"P",{class:!0,["data-svelte-h"]:!0}),V(F)!=="svelte-11h11dx"&&(F.textContent=G),ot=$($t),z=T($t,"FIELDSET",{class:!0,["data-svelte-h"]:!0}),V(z)!=="svelte-1xt6v4t"&&(z.innerHTML=ct),ut=$($t),J=T($t,"DIV",{class:!0,["data-svelte-h"]:!0}),V(J)!=="svelte-wwp1vq"&&(J.innerHTML=t),$t.forEach(u),i=$(j),E=T(j,"DIV",{class:!0});var mt=nt(E);Q=T(mt,"P",{class:!0,["data-svelte-h"]:!0}),V(Q)!=="svelte-1kiaa9d"&&(Q.textContent=_t),ft=$(mt),X=T(mt,"FIELDSET",{class:!0,["data-svelte-h"]:!0}),V(X)!=="svelte-46quqe"&&(X.innerHTML=vt),dt=$(mt),Z=T(mt,"DIV",{class:!0,["data-svelte-h"]:!0}),V(Z)!=="svelte-wwp1vq"&&(Z.innerHTML=Vt),mt.forEach(u),j.forEach(u),this.h()},h(){P(s,ht),S(s,"svelte-1mjlia9",!0),P(m,wt),S(m,"svelte-1mjlia9",!0),P(l,Tt),S(l,"svelte-1mjlia9",!0),P(y,yt),S(y,"svelte-1mjlia9",!0),P(n,jt),S(n,"svelte-1mjlia9",!0),st(q,"class","description svelte-1mjlia9"),st(N,"class","svelte-1mjlia9"),st(O,"class","actions svelte-1mjlia9"),P(_,Ct),S(_,"svelte-1mjlia9",!0),st(F,"class","description svelte-1mjlia9"),st(z,"class","svelte-1mjlia9"),st(J,"class","actions svelte-1mjlia9"),P(h,At),S(h,"svelte-1mjlia9",!0),st(Q,"class","description svelte-1mjlia9"),st(X,"class","svelte-1mjlia9"),st(Z,"class","actions svelte-1mjlia9"),P(E,xt),S(E,"svelte-1mjlia9",!0),P(e,kt),S(e,"svelte-1mjlia9",!0)},m(o,j){d(o,e,j),f(e,n),f(n,s),f(s,a),s.autofocus&&s.focus(),f(n,c),f(n,m),f(m,v),m.autofocus&&m.focus(),f(n,D),f(n,l),f(l,g),l.autofocus&&l.focus(),f(n,b),f(n,y),f(y,H),y.autofocus&&y.focus(),f(e,U),f(e,_),f(_,q),f(_,at),f(_,N),f(_,W),f(_,O),f(e,lt),f(e,h),f(h,F),f(h,ot),f(h,z),f(h,ut),f(h,J),f(e,i),f(e,E),f(E,Q),f(E,ft),f(E,X),f(E,dt),f(E,Z),Mt||(qt=[It(r[2].action(s)),It(r[2].action(m)),It(r[2].action(l)),It(r[2].action(y))],Mt=!0)},p(o,[j]){P(s,ht=et(Pt,[j&4&&o[2]("tab1"),{class:"trigger"}])),S(s,"svelte-1mjlia9",!0),P(m,wt=et(St,[j&4&&o[2]("tab2"),{class:"trigger"}])),S(m,"svelte-1mjlia9",!0),P(l,Tt=et(Dt,[j&4&&o[2]({value:"tab3",disabled:!0}),{class:"trigger opacity-50"}])),S(l,"svelte-1mjlia9",!0),P(y,yt=et(Et,[j&4&&o[2]("tab4"),{class:"trigger"}])),S(y,"svelte-1mjlia9",!0),P(n,jt=et(Ht,[j&2&&o[1],{class:"list"},{"aria-label":"Manage your account"}])),S(n,"svelte-1mjlia9",!0),P(_,Ct=et(Nt,[j&8&&o[3]("tab1"),{class:"content"}])),S(_,"svelte-1mjlia9",!0),P(h,At=et(zt,[j&8&&o[3]("tab2"),{class:"content"}])),S(h,"svelte-1mjlia9",!0),P(E,xt=et(Bt,[j&8&&o[3]("tab4"),{class:"content"}])),S(E,"svelte-1mjlia9",!0),P(e,kt=et(Rt,[j&1&&o[0],{class:"root"}])),S(e,"svelte-1mjlia9",!0)},i:gt,o:gt,d(o){o&&u(e),Mt=!1,Qt(qt)}}}function ne(r,e,n){let s,a,c,m;const{root:v,list:D,content:l,trigger:g}=Zt({value:"tab1"});return Lt(r,v,b=>n(0,s=b)),Lt(r,D,b=>n(1,a=b)),Lt(r,l,b=>n(3,m=b)),Lt(r,g,b=>n(2,c=b)),[s,a,c,m,v,D,l,g]}class se extends Jt{constructor(e){super(),Kt(this,e,ne,ee,Gt,{})}}const ae={"index.svelte":te,"tailwind.config.ts":Yt},le=null,oe={component:se,code:{Tailwind:ae,CSS:le}};async function re(){return{preview:oe}}const Se=Object.freeze(Object.defineProperty({__proto__:null,load:re},Symbol.toStringTag,{value:"Module"})),ie={title:"CreateTabsArgs",description:"The configuration object passed to the `createTabs` builder function.",args:[{label:"value",type:"string"},{label:"onChange",type:"(value: string) => void"},{label:"activateOnFocus",type:"boolean",default:!0},{label:"loop",type:"boolean",default:!0},{label:"orientation",type:['"horizontal"','"vertical"'],default:'"horizontal"'},{label:"autoSet",type:"boolean",default:!0}]},ce={title:"Root",description:"The tabs component.",dataAttributes:[{label:"data-orientation",value:['"horizontal"','"vertical"']},{label:"data-melt-part",value:"`tabs-root`"}]},ue={title:"List",description:"The tabs list component.",dataAttributes:[{label:"data-orientation",value:['"horizontal"','"vertical"']}]},fe={title:"Trigger",description:"The element which opens a given tab.",args:[{label:"value",type:"string"},{label:"disabled",type:"boolean",default:!1}],dataAttributes:[{label:"data-state",value:['"active"','"inactive"']},{label:"data-orientation",value:['"horizontal"','"vertical"']},{label:"data-disabled",value:"Present if disabled"}]},de={title:"Keyboard Interactions",description:"",keyboardInteractions:[{key:"Tab",description:"When focus moves onto the tabs, focuses the active trigger. When a trigger is focused, moves focus to the active content."},{key:"ArrowDown",description:"Moves focus to the next trigger depending on `orientation` & activates the corresponding content."},{key:"ArrowRight",description:"Moves focus to the next trigger depending on `orientation` & activates the corresponding content."},{key:"ArrowUp",description:"Moves focus to the preview trigger depending on `orientation` & activates the corresponding content."},{key:"ArrowLeft",description:"Moves focus to the preview trigger depending on `orientation` & activates the corresponding content."},{key:"Home",description:"Moves focus to the first trigger depending & activates the corresponding content."},{key:"End",description:"Moves focus to the last trigger depending & activates the corresponding content."}]},bt={builder:ie,root:ce,list:ue,trigger:fe,keyboard:de};function pe(r){let e;return{c(){e=B("Tabs")},l(n){e=R(n,"Tabs")},m(n,s){d(n,e,s)},d(n){n&&u(e)}}}function $e(r){let e;return{c(){e=B("A set of layered sections of content—known as tab panels—that are displayed one at a time.")},l(n){e=R(n,"A set of layered sections of content—known as tab panels—that are displayed one at a time.")},m(n,s){d(n,e,s)},d(n){n&&u(e)}}}function me(r){let e;return{c(){e=B("Anatomy")},l(n){e=R(n,"Anatomy")},m(n,s){d(n,e,s)},d(n){n&&u(e)}}}function ge(r){let e,n="Root:",s;return{c(){e=w("b"),e.textContent=n,s=B(" The root container for the tab component")},l(a){e=T(a,"B",{["data-svelte-h"]:!0}),V(e)!=="svelte-ss75j2"&&(e.textContent=n),s=R(a," The root container for the tab component")},m(a,c){d(a,e,c),d(a,s,c)},p:gt,d(a){a&&(u(e),u(s))}}}function ve(r){let e,n="List:",s;return{c(){e=w("b"),e.textContent=n,s=B(" The container for the tab triggers")},l(a){e=T(a,"B",{["data-svelte-h"]:!0}),V(e)!=="svelte-fbhn26"&&(e.textContent=n),s=R(a," The container for the tab triggers")},m(a,c){d(a,e,c),d(a,s,c)},p:gt,d(a){a&&(u(e),u(s))}}}function be(r){let e,n="Trigger:",s;return{c(){e=w("b"),e.textContent=n,s=B(" The button(s) that open/close the tab panels")},l(a){e=T(a,"B",{["data-svelte-h"]:!0}),V(e)!=="svelte-1igo93q"&&(e.textContent=n),s=R(a," The button(s) that open/close the tab panels")},m(a,c){d(a,e,c),d(a,s,c)},p:gt,d(a){a&&(u(e),u(s))}}}function _e(r){let e,n="Content:",s;return{c(){e=w("b"),e.textContent=n,s=B(" The container for the tab panels")},l(a){e=T(a,"B",{["data-svelte-h"]:!0}),V(e)!=="svelte-tk2yx7"&&(e.textContent=n),s=R(a," The container for the tab panels")},m(a,c){d(a,e,c),d(a,s,c)},p:gt,d(a){a&&(u(e),u(s))}}}function he(r){let e,n,s,a,c,m,v,D;return e=new M.Li({props:{$$slots:{default:[ge]},$$scope:{ctx:r}}}),s=new M.Li({props:{$$slots:{default:[ve]},$$scope:{ctx:r}}}),c=new M.Li({props:{$$slots:{default:[be]},$$scope:{ctx:r}}}),v=new M.Li({props:{$$slots:{default:[_e]},$$scope:{ctx:r}}}),{c(){C(e.$$.fragment),n=p(),C(s.$$.fragment),a=p(),C(c.$$.fragment),m=p(),C(v.$$.fragment)},l(l){A(e.$$.fragment,l),n=$(l),A(s.$$.fragment,l),a=$(l),A(c.$$.fragment,l),m=$(l),A(v.$$.fragment,l)},m(l,g){x(e,l,g),d(l,n,g),x(s,l,g),d(l,a,g),x(c,l,g),d(l,m,g),x(v,l,g),D=!0},p(l,g){const b={};g&4&&(b.$$scope={dirty:g,ctx:l}),e.$set(b);const y={};g&4&&(y.$$scope={dirty:g,ctx:l}),s.$set(y);const H={};g&4&&(H.$$scope={dirty:g,ctx:l}),c.$set(H);const U={};g&4&&(U.$$scope={dirty:g,ctx:l}),v.$set(U)},i(l){D||(k(e.$$.fragment,l),k(s.$$.fragment,l),k(c.$$.fragment,l),k(v.$$.fragment,l),D=!0)},o(l){I(e.$$.fragment,l),I(s.$$.fragment,l),I(c.$$.fragment,l),I(v.$$.fragment,l),D=!1},d(l){l&&(u(n),u(a),u(m)),L(e,l),L(s,l),L(c,l),L(v,l)}}}function we(r){let e;return{c(){e=B("API Reference")},l(n){e=R(n,"API Reference")},m(n,s){d(n,e,s)},d(n){n&&u(e)}}}function Te(r){let e;return{c(){e=B("Accessibility")},l(n){e=R(n,"Accessibility")},m(n,s){d(n,e,s)},d(n){n&&u(e)}}}function ye(r){let e;return{c(){e=B("Tabs WAI-ARIA design pattern")},l(n){e=R(n,"Tabs WAI-ARIA design pattern")},m(n,s){d(n,e,s)},d(n){n&&u(e)}}}function je(r){let e,n,s;return n=new M.A({props:{href:"https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/",$$slots:{default:[ye]},$$scope:{ctx:r}}}),{c(){e=B(`Adheres to the
	`),C(n.$$.fragment)},l(a){e=R(a,`Adheres to the
	`),A(n.$$.fragment,a)},m(a,c){d(a,e,c),x(n,a,c),s=!0},p(a,c){const m={};c&4&&(m.$$scope={dirty:c,ctx:a}),n.$set(m)},i(a){s||(k(n.$$.fragment,a),s=!0)},o(a){I(n.$$.fragment,a),s=!1},d(a){a&&u(e),L(n,a)}}}function Ce(r){let e,n,s,a,c,m,v,D,l,g,b,y,H,U,_,q,K,at,N,it,W,O,Y,lt,h,F,G,ot,z,ct;e=new M.H1({props:{$$slots:{default:[pe]},$$scope:{ctx:r}}}),s=new M.Description({props:{$$slots:{default:[$e]},$$scope:{ctx:r}}});const ut=[r[0].preview];let J={};for(let t=0;t<ut.length;t+=1)J=tt(J,ut[t]);return c=new M.Preview({props:J}),v=new M.Construction({}),l=new M.Features({props:{features:r[1]}}),b=new M.H2({props:{$$slots:{default:[me]},$$scope:{ctx:r}}}),H=new M.Ul({props:{$$slots:{default:[he]},$$scope:{ctx:r}}}),_=new M.H2({props:{$$slots:{default:[we]},$$scope:{ctx:r}}}),K=new M.API({props:{schema:bt.builder}}),N=new M.API({props:{schema:bt.root}}),W=new M.API({props:{schema:bt.list}}),Y=new M.API({props:{schema:bt.trigger}}),h=new M.H2({props:{$$slots:{default:[Te]},$$scope:{ctx:r}}}),G=new M.P({props:{$$slots:{default:[je]},$$scope:{ctx:r}}}),z=new M.API({props:{schema:bt.keyboard}}),{c(){C(e.$$.fragment),n=p(),C(s.$$.fragment),a=p(),C(c.$$.fragment),m=p(),C(v.$$.fragment),D=p(),C(l.$$.fragment),g=p(),C(b.$$.fragment),y=p(),C(H.$$.fragment),U=p(),C(_.$$.fragment),q=p(),C(K.$$.fragment),at=p(),C(N.$$.fragment),it=p(),C(W.$$.fragment),O=p(),C(Y.$$.fragment),lt=p(),C(h.$$.fragment),F=p(),C(G.$$.fragment),ot=p(),C(z.$$.fragment)},l(t){A(e.$$.fragment,t),n=$(t),A(s.$$.fragment,t),a=$(t),A(c.$$.fragment,t),m=$(t),A(v.$$.fragment,t),D=$(t),A(l.$$.fragment,t),g=$(t),A(b.$$.fragment,t),y=$(t),A(H.$$.fragment,t),U=$(t),A(_.$$.fragment,t),q=$(t),A(K.$$.fragment,t),at=$(t),A(N.$$.fragment,t),it=$(t),A(W.$$.fragment,t),O=$(t),A(Y.$$.fragment,t),lt=$(t),A(h.$$.fragment,t),F=$(t),A(G.$$.fragment,t),ot=$(t),A(z.$$.fragment,t)},m(t,i){x(e,t,i),d(t,n,i),x(s,t,i),d(t,a,i),x(c,t,i),d(t,m,i),x(v,t,i),d(t,D,i),x(l,t,i),d(t,g,i),x(b,t,i),d(t,y,i),x(H,t,i),d(t,U,i),x(_,t,i),d(t,q,i),x(K,t,i),d(t,at,i),x(N,t,i),d(t,it,i),x(W,t,i),d(t,O,i),x(Y,t,i),d(t,lt,i),x(h,t,i),d(t,F,i),x(G,t,i),d(t,ot,i),x(z,t,i),ct=!0},p(t,[i]){const E={};i&4&&(E.$$scope={dirty:i,ctx:t}),e.$set(E);const Q={};i&4&&(Q.$$scope={dirty:i,ctx:t}),s.$set(Q);const _t=i&1?et(ut,[Xt(t[0].preview)]):{};c.$set(_t);const ft={};i&4&&(ft.$$scope={dirty:i,ctx:t}),b.$set(ft);const X={};i&4&&(X.$$scope={dirty:i,ctx:t}),H.$set(X);const vt={};i&4&&(vt.$$scope={dirty:i,ctx:t}),_.$set(vt);const dt={};i&4&&(dt.$$scope={dirty:i,ctx:t}),h.$set(dt);const Z={};i&4&&(Z.$$scope={dirty:i,ctx:t}),G.$set(Z)},i(t){ct||(k(e.$$.fragment,t),k(s.$$.fragment,t),k(c.$$.fragment,t),k(v.$$.fragment,t),k(l.$$.fragment,t),k(b.$$.fragment,t),k(H.$$.fragment,t),k(_.$$.fragment,t),k(K.$$.fragment,t),k(N.$$.fragment,t),k(W.$$.fragment,t),k(Y.$$.fragment,t),k(h.$$.fragment,t),k(G.$$.fragment,t),k(z.$$.fragment,t),ct=!0)},o(t){I(e.$$.fragment,t),I(s.$$.fragment,t),I(c.$$.fragment,t),I(v.$$.fragment,t),I(l.$$.fragment,t),I(b.$$.fragment,t),I(H.$$.fragment,t),I(_.$$.fragment,t),I(K.$$.fragment,t),I(N.$$.fragment,t),I(W.$$.fragment,t),I(Y.$$.fragment,t),I(h.$$.fragment,t),I(G.$$.fragment,t),I(z.$$.fragment,t),ct=!1},d(t){t&&(u(n),u(a),u(m),u(D),u(g),u(y),u(U),u(q),u(at),u(it),u(O),u(lt),u(F),u(ot)),L(e,t),L(s,t),L(c,t),L(v,t),L(l,t),L(b,t),L(H,t),L(_,t),L(K,t),L(N,t),L(W,t),L(Y,t),L(h,t),L(G,t),L(z,t)}}}function Ae(r,e,n){let{data:s}=e;const a=["Full keyboard navigation","Can be controlled or uncontrolled","Supports horizontal and vertical orientation"];return r.$$set=c=>{"data"in c&&n(0,s=c.data)},[s,a]}class De extends Jt{constructor(e){super(),Kt(this,e,Ae,Ce,Gt,{data:0})}}export{De as component,Se as universal};
