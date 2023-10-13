<script lang="ts">
	// A helper component to make neutral code blocks a bit easier.
	// Will likely clean this up with a custom remark plugin in the future.
	// Something like doing n`code` to get a neutral code block.
	export let neutral = true;
</script>

<code class={neutral ? 'neutral' : ''}>
	<slot />
</code>
