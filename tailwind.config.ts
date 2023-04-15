import type { Config } from 'tailwindcss';

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
				sans: ['Inter', 'sans-serif'],
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
			},
			animation: {
				overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
	},

	plugins: [],
} satisfies Config;
