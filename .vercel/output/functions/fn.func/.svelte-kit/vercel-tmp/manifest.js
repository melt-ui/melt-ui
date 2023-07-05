export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["banner.png","favicon.png","fonts/IBMPlexMono-Bold.ttf","fonts/IBMPlexMono-Medium.ttf","fonts/IBMPlexMono-Regular.ttf","fonts/IBMPlexMono-SemiBold.ttf","fonts/JetBrainsMono.ttf","logo-mark.svg","logo.svg"]),
	mimeTypes: {".png":"image/png",".ttf":"font/ttf",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.836763ff.js","app":"_app/immutable/entry/app.932c0df8.js","imports":["_app/immutable/entry/start.836763ff.js","_app/immutable/chunks/scheduler.2943ef39.js","_app/immutable/chunks/singletons.851f74de.js","_app/immutable/chunks/index.cb808db3.js","_app/immutable/chunks/paths.4b1db0ef.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/entry/app.932c0df8.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/scheduler.2943ef39.js","_app/immutable/chunks/index.c70d9825.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js'),
			() => import('../output/server/nodes/2.js'),
			() => import('../output/server/nodes/3.js'),
			() => import('../output/server/nodes/4.js'),
			() => import('../output/server/nodes/5.js'),
			() => import('../output/server/nodes/6.js'),
			() => import('../output/server/nodes/7.js'),
			() => import('../output/server/nodes/8.js'),
			() => import('../output/server/nodes/9.js'),
			() => import('../output/server/nodes/10.js'),
			() => import('../output/server/nodes/11.js'),
			() => import('../output/server/nodes/12.js'),
			() => import('../output/server/nodes/13.js'),
			() => import('../output/server/nodes/14.js'),
			() => import('../output/server/nodes/15.js'),
			() => import('../output/server/nodes/16.js'),
			() => import('../output/server/nodes/17.js'),
			() => import('../output/server/nodes/18.js'),
			() => import('../output/server/nodes/19.js'),
			() => import('../output/server/nodes/20.js'),
			() => import('../output/server/nodes/21.js'),
			() => import('../output/server/nodes/22.js'),
			() => import('../output/server/nodes/23.js'),
			() => import('../output/server/nodes/24.js'),
			() => import('../output/server/nodes/25.js'),
			() => import('../output/server/nodes/26.js'),
			() => import('../output/server/nodes/27.js'),
			() => import('../output/server/nodes/28.js'),
			() => import('../output/server/nodes/29.js'),
			() => import('../output/server/nodes/30.js'),
			() => import('../output/server/nodes/31.js'),
			() => import('../output/server/nodes/32.js'),
			() => import('../output/server/nodes/33.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/docs",
				pattern: /^\/docs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/docs/builders",
				pattern: /^\/docs\/builders\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/docs/builders/[name]",
				pattern: /^\/docs\/builders\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/docs/[...slug]",
				pattern: /^\/docs(?:\/(.*))?\/?$/,
				params: [{"name":"slug","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/old",
				pattern: /^\/old\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/old/builders/accordion",
				pattern: /^\/old\/builders\/accordion\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/old/builders/avatar",
				pattern: /^\/old\/builders\/avatar\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/old/builders/checkbox",
				pattern: /^\/old\/builders\/checkbox\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/old/builders/collapsible",
				pattern: /^\/old\/builders\/collapsible\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/old/builders/context-menu",
				pattern: /^\/old\/builders\/context-menu\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/old/builders/dialog",
				pattern: /^\/old\/builders\/dialog\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/old/builders/dropdown-menu",
				pattern: /^\/old\/builders\/dropdown-menu\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/old/builders/label",
				pattern: /^\/old\/builders\/label\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/old/builders/pagination",
				pattern: /^\/old\/builders\/pagination\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/old/builders/popover",
				pattern: /^\/old\/builders\/popover\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/old/builders/progress",
				pattern: /^\/old\/builders\/progress\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/old/builders/radio-group",
				pattern: /^\/old\/builders\/radio-group\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/old/builders/select",
				pattern: /^\/old\/builders\/select\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/old/builders/separator",
				pattern: /^\/old\/builders\/separator\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/old/builders/slider",
				pattern: /^\/old\/builders\/slider\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/old/builders/switch",
				pattern: /^\/old\/builders\/switch\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/old/builders/tabs",
				pattern: /^\/old\/builders\/tabs\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/old/builders/tags-input",
				pattern: /^\/old\/builders\/tags-input\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/old/builders/toggle-group",
				pattern: /^\/old\/builders\/toggle-group\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/old/builders/toggle",
				pattern: /^\/old\/builders\/toggle\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/old/builders/toolbar",
				pattern: /^\/old\/builders\/toolbar\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/old/builders/tooltip",
				pattern: /^\/old\/builders\/tooltip\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/old/overview/getting-started",
				pattern: /^\/old\/overview\/getting-started\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/old/overview/introduction",
				pattern: /^\/old\/overview\/introduction\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 33 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
