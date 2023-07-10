<script lang="ts">
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import { fly } from 'svelte/transition';
	import { cn, createCopyCodeButton } from '$docs/utils';

	const { copied, setCodeString, copyCode } = createCopyCodeButton();

	export let copyBtnClasses = '';
</script>

<div use:setCodeString {...$$restProps} data-rehype-pretty-code-fragment>
	<slot />
</div>
<button
	class={cn('absolute right-5 top-16 z-10', copyBtnClasses)}
	aria-label="copy"
	on:click={copyCode}
	data-code-copy
>
	{#if $copied}
		<div in:fly={{ y: -4 }}>
			<Check class="text-magnum-500" />
		</div>
	{:else}
		<div in:fly={{ y: 4 }}>
			<Copy class="hover:text-magnum-500" />
		</div>
	{/if}
</button>
