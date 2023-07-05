const TwConfig = "import type { Config } from 'tailwindcss';\n\nexport default {\n	content: ['./src/**/*.{html,js,svelte,ts}'],\n\n	theme: {\n		extend: {\n			colors: {\n				magnum: {\n					'50': '#fff9ed',\n					'100': '#fef2d6',\n					'200': '#fce0ac',\n					'300': '#f9c978',\n					'400': '#f7b155',\n					'500': '#f38d1c',\n					'600': '#e47312',\n					'700': '#bd5711',\n					'800': '#964516',\n					'900': '#793a15',\n					'950': '#411c09',\n				},\n			},\n		},\n	},\n} satisfies Config;\n";
export {
  TwConfig as T
};
