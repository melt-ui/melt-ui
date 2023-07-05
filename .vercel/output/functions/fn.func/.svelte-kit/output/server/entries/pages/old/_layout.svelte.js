import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, d as escape } from "../../../chunks/ssr.js";
import { f as formatStr } from "../../../chunks/helpers.js";
import { p as page } from "../../../chunks/stores.js";
const atomOneDark = `<style>pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{color:#abb2bf;background:#282c34}.hljs-comment,.hljs-quote{color:#5c6370;font-style:italic}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-built_in,.hljs-class .hljs-title,.hljs-title.class_{color:#e6c07b}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}</style>`;
const theme = atomOneDark;
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pageTitle;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  pageTitle = formatStr($page.url.pathname.split("/").pop() ?? "");
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-yjt871_START -->${$$result.title = `<title>${escape(pageTitle)} - Melt UI</title>`, ""}<!-- HTML_TAG_START -->${theme}<!-- HTML_TAG_END --><!-- HEAD_svelte-yjt871_END -->`, ""}`;
});
export {
  Layout as default
};
