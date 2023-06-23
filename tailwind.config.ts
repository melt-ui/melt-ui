import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
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
				mono: [
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
	},

	plugins: [
		plugin(function ({ addVariant, matchUtilities, theme }) {
			addVariant('hocus', ['&:hover', '&:focus']);
			// Square utility
			matchUtilities(
				{
					square: (value) => ({
						width: value,
						height: value,
					}),
				},
				{ values: theme('spacing') }
			);
		}),
	],
} satisfies Config;
