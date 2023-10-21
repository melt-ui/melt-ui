<script lang="ts">
	import { createToolbar, melt } from '$lib/index.js';

	// Icons
	import {
		Bold,
		Italic,
		Strikethrough,
		AlignLeft,
		AlignCenter,
		AlignRight,
	} from 'lucide-svelte';

	const {
		elements: { root, button, link, separator },
		builders: { createToolbarGroup },
	} = createToolbar();
	const {
		elements: { group: fontGroup, item: fontItem },
	} = createToolbarGroup({
		type: 'multiple',
	});
	const {
		elements: { group: alignGroup, item: alignItem },
	} = createToolbarGroup();
</script>

<div use:melt={$root} class="container">
	<div class="toolbar-items" use:melt={$fontGroup}>
		<button class="item" use:melt={$fontItem('bold')}>
			<Bold class="square-5" />
		</button>
		<button class="item" use:melt={$fontItem('italic')}>
			<Italic class="square-5" />
		</button>
		<button class="item" use:melt={$fontItem('strikethrough')}>
			<Strikethrough class="square-5" />
		</button>
	</div>
	<div class="separator" use:melt={$separator} />
	<div class="toolbar-items" use:melt={$alignGroup}>
		<button class="item" use:melt={$alignItem('left')}>
			<AlignLeft class="square-5" />
		</button>
		<button class="item" use:melt={$alignItem('center')}>
			<AlignCenter class="square-5" />
		</button>
		<button class="item" use:melt={$alignItem('right')}>
			<AlignRight class="square-5" />
		</button>
	</div>
	<div class="separator" use:melt={$separator} />
	<a href="/" class="link" use:melt={$link}> Edited 2 hours ago </a>
	<button class="save-btn" use:melt={$button}>Save</button>
</div>

<style lang="postcss">
	:root {
		--color-white: 255 255 255;
		--color-neutral-300: 212 212 212;
		--color-neutral-700: 64 64 64;
		--color-magnum-50: 255 249 237;
		--color-magnum-100: 254 242 214;
		--color-magnum-200: 252 224 172;
		--color-magnum-300: 249 201 120;
		--color-magnum-400: 247 177 85;
		--color-magnum-500: 243 141 28;
		--color-magnum-600: 228 115 18;
		--color-magnum-700: 189 87 17;
		--color-magnum-800: 150 69 22;
		--color-magnum-900: 121 58 21;
		--color-magnum-950: 65 28 9;
	}

	* {
		all: unset;
	}

	.container {
		display: flex;
		min-width: max-content;
		align-items: center;
		gap: 1rem;
		border-radius: 0.375rem;
		background: rgb(var(--color-white) / 1);
		padding: 0.75rem;
		color: rgb(var(--color-neutral-700) / 1);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	.save-btn {
		margin-left: auto;
		border-radius: 0.375rem;
		background: rgb(var(--color-magnum-600) / 1);
		padding: 0.25rem 0.75rem;
		font-weight: 500;
		color: rgb(var(--color-magnum-100) / 1);

		&:hover {
			opacity: 0.75;
		}

		&:active {
			opacity: 0.5;
		}
	}

	.toolbar-items {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.item {
		padding: 0.25rem;
		border-radius: 0.375rem;

		&:hover {
			background-color: rgb(var(--color-magnum-100) / 1);
		}

		&[data-state='on'] {
			background-color: rgb(var(--color-magnum-200) / 1);
			color: rgb(var(--color-magnum-900) / 1);
		}

		&:focus {
			box-shadow: 0 0 0 3px rgb(var(--color-magnum-400) / 1);
		}
	}

	.separator {
		width: 1px;
		background-color: rgb(var(--color-neutral-300) / 1);
		align-self: stretch;
	}

	.link {
		flex-shrink: 0;
		text-decoration-line: underline;
		text-decoration-color: rgb(var(--color-white) / 0.5);
		text-underline-offset: 4px;
		opacity: 0.75;

		&:hover {
			opacity: 1;
			text-decoration-color: rgb(var(--color-magnum-500) / 1);
		}

		&:focus {
			opacity: 1;
			text-decoration-color: rgb(var(--color-magnum-500) / 1);
		}

		&:active {
			translate-y: 1px;
		}
	}

	@media screen and (min-width: 1024px) {
		.container {
			width: 35rem;
		}
	}
</style>
