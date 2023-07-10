<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let data;
	export let clickable = false;
</script>

{#if clickable}
	<button
		class="bg-zinc-200 hover:bg-zinc-100 w-full text-left py-1 px-2"
		on:click={(e) => dispatch('updatepage', { page: data.startPagePosition })}
	>
		{data.label}
		<span class="text-xs text-gray-400">
			(image {data.startPagePosition}, page {data.startPageLabel})</span
		>
	</button>
{:else}
	<div class="px-2 py-1">
		{data.label}
		<span class="text-xs text-gray-400">
			(image {data.startPagePosition}, page {data.startPageLabel})</span
		>
	</div>
{/if}
