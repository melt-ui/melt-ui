<script lang="ts">
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import { fly } from 'svelte/transition';

	let codeString: string;

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;

	function copyCode() {
		navigator.clipboard.writeText(codeString);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}

	function copyCodeToClipboard(node: HTMLElement) {
		codeString = node.innerText.trim() ?? '';
	}
</script>

<div use:copyCodeToClipboard {...$$restProps} data-rehype-pretty-code-fragment>
	<slot />
</div>
<button class="absolute right-5 top-16 z-10" aria-label="copy" on:click={copyCode} data-code-copy>
	{#if copied}
		<div in:fly={{ y: -4 }}>
			<Check class="text-magnum-500" />
		</div>
	{:else}
		<div in:fly={{ y: 4 }}>
			<Copy class="hover:text-magnum-500" />
		</div>
	{/if}
</button>
