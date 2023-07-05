import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { g as get_store_value } from "./utils.js";
import { w as writable } from "./index2.js";
import { renderToHtml, getHighlighter } from "shiki-es";
const rawTailwindConfig = "import type { Config } from 'tailwindcss';\nimport plugin from 'tailwindcss/plugin';\n\nexport default {\n	content: ['./src/**/*.{html,js,svelte,ts}'],\n\n	theme: {\n		container: {\n			center: true,\n			padding: '2rem',\n			screens: {\n				'2xl': '1440px',\n			},\n		},\n		extend: {\n			colors: {\n				magnum: {\n					'50': '#fff9ed',\n					'100': '#fef2d6',\n					'200': '#fce0ac',\n					'300': '#f9c978',\n					'400': '#f7b155',\n					'500': '#f38d1c',\n					'600': '#e47312',\n					'700': '#bd5711',\n					'800': '#964516',\n					'900': '#793a15',\n					'950': '#411c09',\n				},\n			},\n			fontFamily: {\n				sans: [\n					'-apple-system',\n					'BlinkMacSystemFont',\n					'Segoe UI',\n					'Roboto',\n					'Oxygen',\n					'Ubuntu',\n					'Cantarell',\n					'Fira Sans',\n					'Droid Sans',\n					'Helvetica Neue',\n					'Arial',\n					'sans-serif',\n					'Apple Color Emoji',\n					'Segoe UI Emoji',\n					'Segoe UI Symbol',\n				],\n				mono: [\n					'IBM Plex Mono',\n					'ui-monospace',\n					'SFMono-Regular',\n					'SF Mono',\n					'Menlo',\n					'Consolas',\n					'Liberation Mono',\n					'monospace',\n				],\n			},\n		},\n	},\n\n	plugins: [\n		plugin(function ({ addVariant, matchUtilities, theme }) {\n			addVariant('hocus', ['&:hover', '&:focus']);\n			// Square utility\n			matchUtilities(\n				{\n					square: (value) => ({\n						width: value,\n						height: value,\n					}),\n				},\n				{ values: theme('spacing') }\n			);\n		}),\n	],\n} satisfies Config;\n";
const rawGlobalCSS = ":root {\n	--tw-screen-sm: 640px;\n	--tw-screen-md: 768px;\n	--tw-screen-lg: 1024px;\n	--tw-screen-xl: 1280px;\n	--tw-screen-2xl: 1536px;\n	--tw-color-inherit: inherit;\n	--tw-color-current: currentColor;\n	--tw-color-transparent: transparent;\n	--tw-color-black: 0 0 0;\n	--tw-color-white: 255 255 255;\n	--tw-color-neutral-50: 250 250 250;\n	--tw-color-neutral-100: 245 245 245;\n	--tw-color-neutral-200: 229 229 229;\n	--tw-color-neutral-300: 212 212 212;\n	--tw-color-neutral-400: 163 163 163;\n	--tw-color-neutral-500: 115 115 115;\n	--tw-color-neutral-600: 82 82 82;\n	--tw-color-neutral-700: 64 64 64;\n	--tw-color-neutral-800: 38 38 38;\n	--tw-color-neutral-900: 23 23 23;\n	--tw-color-magnum-50: 255 249 237;\n	--tw-color-magnum-100: 254 242 214;\n	--tw-color-magnum-200: 252 224 172;\n	--tw-color-magnum-300: 249 201 120;\n	--tw-color-magnum-400: 247 177 85;\n	--tw-color-magnum-500: 243 141 28;\n	--tw-color-magnum-600: 228 115 18;\n	--tw-color-magnum-700: 189 87 17;\n	--tw-color-magnum-800: 150 69 22;\n	--tw-color-magnum-900: 121 58 21;\n	--tw-color-magnum-950: 65 28 9;\n	--tw-size-0: 0px;\n	--tw-size-1: 0.25rem;\n	--tw-size-2: 0.5rem;\n	--tw-size-3: 0.75rem;\n	--tw-size-4: 1rem;\n	--tw-size-5: 1.25rem;\n	--tw-size-6: 1.5rem;\n	--tw-size-7: 1.75rem;\n	--tw-size-8: 2rem;\n	--tw-size-9: 2.25rem;\n	--tw-size-10: 2.5rem;\n	--tw-size-11: 2.75rem;\n	--tw-size-12: 3rem;\n	--tw-size-14: 3.5rem;\n	--tw-size-16: 4rem;\n	--tw-size-20: 5rem;\n	--tw-size-24: 6rem;\n	--tw-size-28: 7rem;\n	--tw-size-32: 8rem;\n	--tw-size-36: 9rem;\n	--tw-size-40: 10rem;\n	--tw-size-44: 11rem;\n	--tw-size-48: 12rem;\n	--tw-size-52: 13rem;\n	--tw-size-56: 14rem;\n	--tw-size-60: 15rem;\n	--tw-size-64: 16rem;\n	--tw-size-72: 18rem;\n	--tw-size-80: 20rem;\n	--tw-size-96: 24rem;\n	--tw-size-px: 1px;\n	--tw-size-0_5: 0.125rem;\n	--tw-size-1_5: 0.375rem;\n	--tw-size-2_5: 0.625rem;\n	--tw-size-3_5: 0.875rem;\n	--tw-width-1: 1;\n	--tw-width-2: 2;\n	--tw-width-3: 3;\n	--tw-width-4: 4;\n	--tw-width-5: 5;\n	--tw-width-6: 6;\n	--tw-width-7: 7;\n	--tw-width-8: 8;\n	--tw-width-9: 9;\n	--tw-width-10: 10;\n	--tw-width-11: 11;\n	--tw-width-12: 12;\n	--tw-width-auto: auto;\n	--tw-width-3xs: 16rem;\n	--tw-width-2xs: 18rem;\n	--tw-width-xs: 20rem;\n	--tw-width-sm: 24rem;\n	--tw-width-md: 28rem;\n	--tw-width-lg: 32rem;\n	--tw-width-xl: 36rem;\n	--tw-width-2xl: 42rem;\n	--tw-width-3xl: 48rem;\n	--tw-width-4xl: 56rem;\n	--tw-width-5xl: 64rem;\n	--tw-width-6xl: 72rem;\n	--tw-width-7xl: 80rem;\n	--tw-width-prose: 65ch;\n	--tw-font-family-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',\n		Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',\n		'Segoe UI Symbol', 'Noto Color Emoji';\n	--tw-font-family-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;\n	--tw-font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',\n		'Courier New', monospace;\n	--tw-font-size-xs: 0.75rem;\n	--tw-font-size-sm: 0.875rem;\n	--tw-font-size-base: 1rem;\n	--tw-font-size-lg: 1.125rem;\n	--tw-font-size-xl: 1.25rem;\n	--tw-font-size-2xl: 1.5rem;\n	--tw-font-size-3xl: 1.875rem;\n	--tw-font-size-4xl: 2.25rem;\n	--tw-font-size-5xl: 3rem;\n	--tw-font-size-6xl: 3.75rem;\n	--tw-font-size-7xl: 4.5rem;\n	--tw-font-size-8xl: 6rem;\n	--tw-font-size-9xl: 8rem;\n	--tw-font-weight-thin: 100;\n	--tw-font-weight-extralight: 200;\n	--tw-font-weight-light: 300;\n	--tw-font-weight-normal: 400;\n	--tw-font-weight-medium: 500;\n	--tw-font-weight-semibold: 600;\n	--tw-font-weight-bold: 700;\n	--tw-font-weight-extrabold: 800;\n	--tw-font-weight-black: 900;\n	--tw-line-height-3: 0.75rem;\n	--tw-line-height-4: 1rem;\n	--tw-line-height-5: 1.25rem;\n	--tw-line-height-6: 1.5rem;\n	--tw-line-height-7: 1.75rem;\n	--tw-line-height-8: 2rem;\n	--tw-line-height-9: 2.25rem;\n	--tw-line-height-10: 2.5rem;\n	--tw-line-height-none: 1;\n	--tw-line-height-tight: 1.25;\n	--tw-line-height-snug: 1.375;\n	--tw-line-height-normal: 1.5;\n	--tw-line-height-relaxed: 1.625;\n	--tw-line-height-loose: 2;\n	--tw-border-radius-none: 0px;\n	--tw-border-radius-sm: 0.125rem;\n	--tw-border-radius-default: 0.25rem;\n	--tw-border-radius-md: 0.375rem;\n	--tw-border-radius-lg: 0.5rem;\n	--tw-border-radius-xl: 0.75rem;\n	--tw-border-radius-2xl: 1rem;\n	--tw-border-radius-3xl: 1.5rem;\n	--tw-border-radius-full: 9999px;\n}\n\n@layer tailwind-reset {\n	/*\n  ! tailwindcss v3.1.8 | MIT License | https://tailwindcss.com\n  */ /*\n  1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n  2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n  */\n\n	*,\n	::before,\n	::after {\n		box-sizing: border-box; /* 1 */\n		border-width: 0; /* 2 */\n		border-style: solid; /* 2 */\n		border-color: rgb(var(--tw-color-gray-200) / 1); /* 2 */\n	}\n\n	::before,\n	::after {\n		--tw-content: '';\n	}\n\n	/*\n  1. Use a consistent sensible line-height in all browsers.\n  2. Prevent adjustments of font size after orientation changes in iOS.\n  3. Use a more readable tab size.\n  4. Use the user's configured `sans` font-family by default.\n  */\n\n	html {\n		line-height: 1.5; /* 1 */\n		-webkit-text-size-adjust: 100%; /* 2 */\n		-moz-tab-size: 4; /* 3 */\n		-o-tab-size: 4;\n		tab-size: 4; /* 3 */\n		font-family: var(--tw-font-family-sans); /* 4 */\n	}\n\n	/*\n  1. Remove the margin in all browsers.\n  2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n  */\n\n	body {\n		margin: 0; /* 1 */\n		line-height: inherit; /* 2 */\n	}\n\n	/*\n  1. Add the correct height in Firefox.\n  2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n  3. Ensure horizontal rules are visible by default.\n  */\n\n	hr {\n		height: 0; /* 1 */\n		color: inherit; /* 2 */\n		border-top-width: 1px; /* 3 */\n	}\n\n	/*\n  Add the correct text decoration in Chrome, Edge, and Safari.\n  */\n\n	abbr:where([title]) {\n		-webkit-text-decoration: underline dotted;\n		text-decoration: underline dotted;\n	}\n\n	/*\n  Remove the default font size and weight for headings.\n  */\n\n	h1,\n	h2,\n	h3,\n	h4,\n	h5,\n	h6 {\n		font-size: inherit;\n		font-weight: inherit;\n	}\n\n	/*\n  Reset links to optimize for opt-in styling instead of opt-out.\n  */\n\n	a {\n		color: inherit;\n		text-decoration: inherit;\n	}\n\n	/*\n  Add the correct font weight in Edge and Safari.\n  */\n\n	b,\n	strong {\n		font-weight: bolder;\n	}\n\n	/*\n  1. Use the user's configured `mono` font family by default.\n  2. Correct the odd `em` font sizing in all browsers.\n  */\n\n	code,\n	kbd,\n	samp,\n	pre {\n		font-family: var(--tw-font-family-mono); /* 1 */\n		font-size: 1em; /* 2 */\n	}\n\n	/*\n  Add the correct font size in all browsers.\n  */\n\n	small {\n		font-size: 80%;\n	}\n\n	/*\n  Prevent `sub` and `sup` elements from affecting the line height in all browsers.\n  */\n\n	sub,\n	sup {\n		font-size: 75%;\n		line-height: 0;\n		position: relative;\n		vertical-align: baseline;\n	}\n\n	sub {\n		bottom: -0.25em;\n	}\n\n	sup {\n		top: -0.5em;\n	}\n\n	/*\n  1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n  2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n  3. Remove gaps between table borders by default.\n  */\n\n	table {\n		text-indent: 0; /* 1 */\n		border-color: inherit; /* 2 */\n		border-collapse: collapse; /* 3 */\n	}\n\n	/*\n  1. Change the font styles in all browsers.\n  2. Remove the margin in Firefox and Safari.\n  3. Remove default padding in all browsers.\n  */\n\n	button,\n	input,\n	optgroup,\n	select,\n	textarea {\n		font-family: inherit; /* 1 */\n		font-size: 100%; /* 1 */\n		font-weight: inherit; /* 1 */\n		line-height: inherit; /* 1 */\n		color: inherit; /* 1 */\n		margin: 0; /* 2 */\n		padding: 0; /* 3 */\n	}\n\n	/*\n  Remove the inheritance of text transform in Edge and Firefox.\n  */\n\n	button,\n	select {\n		text-transform: none;\n	}\n\n	/*\n  1. Correct the inability to style clickable types in iOS and Safari.\n  2. Remove default button styles.\n  */\n\n	button,\n	[type='button'],\n	[type='reset'],\n	[type='submit'] {\n		-webkit-appearance: button; /* 1 */\n		background-color: transparent; /* 2 */\n		background-image: none; /* 2 */\n	}\n\n	/*\n  Use the modern Firefox focus style for all focusable elements.\n  */\n\n	:-moz-focusring {\n		outline: auto;\n	}\n\n	/*\n  Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n  */\n\n	:-moz-ui-invalid {\n		box-shadow: none;\n	}\n\n	/*\n  Add the correct vertical alignment in Chrome and Firefox.\n  */\n\n	progress {\n		vertical-align: baseline;\n	}\n\n	/*\n  Correct the cursor style of increment and decrement buttons in Safari.\n  */\n\n	::-webkit-inner-spin-button,\n	::-webkit-outer-spin-button {\n		height: auto;\n	}\n\n	/*\n  1. Correct the odd appearance in Chrome and Safari.\n  2. Correct the outline style in Safari.\n  */\n\n	[type='search'] {\n		-webkit-appearance: textfield; /* 1 */\n		outline-offset: -2px; /* 2 */\n	}\n\n	/*\n  Remove the inner padding in Chrome and Safari on macOS.\n  */\n\n	::-webkit-search-decoration {\n		-webkit-appearance: none;\n	}\n\n	/*\n  1. Correct the inability to style clickable types in iOS and Safari.\n  2. Change font properties to `inherit` in Safari.\n  */\n\n	::-webkit-file-upload-button {\n		-webkit-appearance: button; /* 1 */\n		font: inherit; /* 2 */\n	}\n\n	/*\n  Add the correct display in Chrome and Safari.\n  */\n\n	summary {\n		display: list-item;\n	}\n\n	/*\n  Removes the default spacing and border for appropriate elements.\n  */\n\n	blockquote,\n	dl,\n	dd,\n	h1,\n	h2,\n	h3,\n	h4,\n	h5,\n	h6,\n	hr,\n	figure,\n	p,\n	pre {\n		margin: 0;\n	}\n\n	fieldset {\n		margin: 0;\n		padding: 0;\n	}\n\n	legend {\n		padding: 0;\n	}\n\n	ol,\n	ul,\n	menu {\n		list-style: none;\n		margin: 0;\n		padding: 0;\n	}\n\n	/*\n  Prevent resizing textareas horizontally by default.\n  */\n\n	textarea {\n		resize: vertical;\n	}\n\n	/*\n  1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n  2. Set the default placeholder color to the user's configured gray 400 color.\n  */\n\n	input::-moz-placeholder,\n	textarea::-moz-placeholder {\n		opacity: 1; /* 1 */\n		color: rgb(var(--tw-color-gray-400) / 1); /* 2 */\n	}\n\n	input::placeholder,\n	textarea::placeholder {\n		opacity: 1; /* 1 */\n		color: rgb(var(--tw-color-gray-400) / 1); /* 2 */\n	}\n\n	/*\n  Set the default cursor for buttons.\n  */\n\n	button,\n	[role='button'] {\n		cursor: pointer;\n	}\n\n	/*\n  Make sure disabled buttons don't get the pointer cursor.\n  */\n	:disabled {\n		cursor: default;\n	}\n\n	/*\n  1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n  2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n     This can trigger a poorly considered lint error in some tools but is included by design.\n  */\n\n	img,\n	svg,\n	video,\n	canvas,\n	audio,\n	iframe,\n	embed,\n	object {\n		display: block; /* 1 */\n		vertical-align: middle; /* 2 */\n	}\n\n	/*\n  Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n  */\n\n	img,\n	video {\n		max-width: 100%;\n		height: auto;\n	}\n}\n";
const highlighterStore = writable(null);
async function getShikiHighlighter() {
  const shikiHighlighter = await getHighlighter({
    theme: "github-dark",
    langs: ["svelte", "typescript", "css", "javascript", "json", "bash"]
  });
  return shikiHighlighter;
}
async function getStoredHighlighter() {
  const currHighlighter = get_store_value(highlighterStore);
  if (currHighlighter) {
    return currHighlighter;
  }
  const shikiHighlighter = await getShikiHighlighter();
  highlighterStore.set(shikiHighlighter);
  return shikiHighlighter;
}
async function highlightCode(code, lang) {
  const highlighter = await getStoredHighlighter();
  const tokens = highlighter.codeToThemedTokens(tabsToSpaces(code), lang);
  const html = renderToHtml(tokens, {
    elements: {
      pre({ children }) {
        return `<pre data-language="${lang}" data-theme="default" class="!mt-2">${children}</pre>`;
      },
      code({ children }) {
        return `<code data-language="${lang}" data-theme="default">${children}</code>`;
      },
      line({ children }) {
        if (!children) {
          return `<span data-line>${" "}</span>`;
        }
        return `<span data-line>${children}</span>`;
      },
      token({ style, children }) {
        return `<span style="${style}">${children}</span>`;
      }
    }
  });
  return html;
}
function tabsToSpaces(code) {
  return code.replace(/\t/g, "  ");
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function slugFromPath(path) {
  return path.replace("/src/docs/content/", "").replace(".md", "");
}
function previewPathMatcher(path, builder) {
  const strippedPath = path.replace("/src/docs/previews/", "");
  const builderPath = strippedPath.split("/")[0];
  return builderPath === builder;
}
const noopAction = () => {
};
async function createPreviewsObject(component, objArr) {
  const returnedObj = {};
  for (const obj of objArr) {
    const regex = new RegExp(`${component}/(.+?)/(.+?)\\.svelte$`);
    const match = regex.exec(obj.path);
    if (match) {
      const [, groupKey, fileKey] = match;
      const { content } = obj;
      if (!returnedObj[groupKey]) {
        returnedObj[groupKey] = {};
      }
      if (!returnedObj[groupKey][fileKey]) {
        returnedObj[groupKey][fileKey] = {};
      }
      const highlightedCode = await highlightCode(content, "svelte");
      returnedObj[groupKey][fileKey]["index.svelte"] = highlightedCode ?? content;
    }
  }
  for (const groupKey in returnedObj) {
    if (Object.prototype.hasOwnProperty.call(returnedObj, groupKey)) {
      const fileKeys = Object.keys(returnedObj[groupKey]);
      for (const fileKey of fileKeys) {
        if (!Object.prototype.hasOwnProperty.call(returnedObj[groupKey], fileKey)) {
          returnedObj[groupKey][fileKey] = {};
        }
        if (fileKey === "tailwind") {
          const highlightedCode = await highlightCode(rawTailwindConfig, "typescript");
          returnedObj[groupKey][fileKey]["tailwind.config.ts"] = highlightedCode ?? rawTailwindConfig;
        } else if (fileKey === "css") {
          const highlightedCode = await highlightCode(rawGlobalCSS, "css");
          returnedObj[groupKey][fileKey]["globals.css"] = highlightedCode ?? rawGlobalCSS;
        }
      }
    }
  }
  return returnedObj;
}
function isMainPreviewComponent(builder, path) {
  const regexPattern = `${builder}/main/tailwind\\.svelte$`;
  const regex = new RegExp(regexPattern);
  return regex.test(path);
}
export {
  createPreviewsObject as a,
  cn as c,
  isMainPreviewComponent as i,
  noopAction as n,
  previewPathMatcher as p,
  slugFromPath as s
};
