<script lang="ts">
	import { Tabs } from '$docs/components/index.js';
</script>

<Tabs tabs={['npm', 'yarn', 'pnpm']} let:tab>
	{#if tab === 'npm'}
		<slot name="npm" />
	{:else if tab === 'yarn'}
		<slot name="yarn" />
	{:else if tab === 'pnpm'}
		<slot name="pnpm" />
	{/if}
</Tabs>
