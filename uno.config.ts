// uno.config.ts
import { defineConfig } from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	variants: [],
	rules: [
		[
			/^square-(\d+)$/,
			(match) => ({ width: `${+match[1] / 4}rem`, height: `${+match[1] / 4}rem` }),
		],
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1540px',
			},
		},
		colors: {
			magnum: {
				'50': '#fff9ed',
				'100': '#fef2d6',
				'200': '#fce0ac',
				'300': '#f9c978',
				'400': '#f7b155',
				'500': '#f38d1c',
				'600': '#e47312',
				'700': '#bd5711',
				'800': '#964516',
				'900': '#793a15',
				'950': '#411c09',
			},
		},
		fontFamily: {
			sans: [
				'Inter',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Oxygen',
				'Ubuntu',
				'Cantarell',
				'Fira Sans',
				'Droid Sans',
				'Helvetica Neue',
				'Arial',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
			],
			display: [
				'GT Maru',
				'Segoe UI',
				'Roboto',
				'Oxygen',
				'Ubuntu',
				'Cantarell',
				'Fira Sans',
				'Droid Sans',
				'Helvetica Neue',
				'Arial',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
			],
			mono: [
				'GT Maru Mono',
				'ui-monospace',
				'SFMono-Regular',
				'SF Mono',
				'Menlo',
				'Consolas',
				'Liberation Mono',
				'monospace',
			],
		},
	},
	transformers: [transformerDirectives()],
});
