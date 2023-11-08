import { defineConfig } from 'unocss';

// This is empty since we're not actually using Uno! This is just so I can
// easily convert TW to CSS by using Uno's VSCode extension.
export default defineConfig({
	rules: [
		[
			/^text-magnum-(\d+)$/,
			(match) => {
				return { color: `var(--magnum-${match[1]})` };
			},
		],
	],
});
