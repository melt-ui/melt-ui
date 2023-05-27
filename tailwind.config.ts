import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const humanist = [
	'Seravek',
	'Gill Sans Nova',
	'Ubuntu',
	'Calibri',
	'DejaVu Sans',
	'source-sans-pro',
	'Apple Color Emoji',
	'Segoe UI Emoji',
	'Segoe UI Symbol',
	'Noto Color Emoji',
	'sans-serif',
];

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				vermilion: {
					'50': '#fff5ec',
					'100': '#ffe9d3',
					'200': '#ffcea5',
					'300': '#ffac6d',
					'400': '#ff7d32',
					'500': '#ff590a',
					'600': '#ff3e00',
					'700': '#cc2902',
					'800': '#a1210b',
					'900': '#821e0c',
					'950': '#460b04',
				},
			},
			fontFamily: {
				sans: ['Overpass', ...humanist],
				mono: [
					'Overpass Mono',
					'ui-monospace',
					'Source Code Pro',
					'Cascadia Code',
					'Menlo',
					'Consolas',
					'DejaVu Sans Mono',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'Noto Color Emoji',
					'monospace',
				],
			},
			keyframes: {
				overlayShow: {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				contentShow: {
					from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
					to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
				},
				slideDownAndFade: {
					from: { opacity: '0', transform: 'translateY(-2px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				slideLeftAndFade: {
					from: { opacity: '0', transform: 'translateX(2px)' },
					to: { opacity: '1', transform: 'translateX(0)' },
				},
				slideUpAndFade: {
					from: { opacity: '0', transform: 'translateY(2px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				slideRightAndFade: {
					from: { opacity: '0', transform: 'translateX(-2px)' },
					to: { opacity: '1', transform: 'translateX(0)' },
				},
			},
			animation: {
				overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
				slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},

	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('hocus', ['&:hover', '&:focus']);
		}),
	],
} satisfies Config;
