<script lang="ts" context="module">
	export type ToastData = {
		title: string;
		description: string;
		color: string;
	};
</script>

<script lang="ts">
	import { createToaster } from '$lib/index.js';
	import { flip } from 'svelte/animate';
	import Toast from './toast.svelte';

	const {
		elements,
		helpers: { addToast },
		states: { toasts },
		actions: { portal },
	} = createToaster<ToastData>();

	const toastData: ToastData[] = [
		{
			title: 'Success',
			description: 'Congratulations! It worked!',
			color: 'bg-green-500',
		},
		{
			title: 'Warning',
			description: 'Please check again.',
			color: 'bg-orange-500',
		},
		{
			title: 'Error',
			description: 'Something did not work!',
			color: 'bg-red-500',
		},
	];

	function addRandomToast() {
		addToast({ data: toastData[Math.floor(Math.random() * toastData.length)] });
	}
</script>

<button
	class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3
	font-medium leading-none text-magnum-700 shadow hover:opacity-75"
	on:click={addRandomToast}
>
	Show toast
</button>

<div
	class="fixed right-0 top-0 z-50 m-4 flex flex-col items-end gap-2 md:bottom-0 md:top-auto"
	use:portal
>
	{#each $toasts as toast (toast.id)}
		<div animate:flip={{ duration: 500 }}>
			<Toast {elements} {toast} />
		</div>
	{/each}
</div>
