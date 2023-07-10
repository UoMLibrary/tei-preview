<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let thumbnails = [];
</script>

<div class="p-4">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
		{#each thumbnails as thumbnail, idx}
			<button on:click={(e) => dispatch('updatepage', { page: idx + 1 })}>
				<div class="flex flex-col px-2 py-4 bg-zinc-200 rounded-md items-center justify-center">
					<img src={thumbnail.url} alt={`An Image labelled '${thumbnail.label}'`} />
					<div class="text-xs pt-2">
						<!-- Don't show the page number if the label is the page number -->
						{#if thumbnail.label !== String(idx + 1)}{idx + 1}:{/if}&nbsp;{thumbnail.label}
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
