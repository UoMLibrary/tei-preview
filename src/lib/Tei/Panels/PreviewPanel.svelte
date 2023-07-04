<script>
	import Preview from '$lib/MDCUI/Preview.svelte';

	import Modal from '$lib/UI/Modal.svelte';
	let showModal = false;

	export let title = '';
	export let markdownHelp;

	export let viewModel;
</script>

<div class="rounded-md bg-white mb-4 text-xs">
	<!-- Panel Header -->
	<div class="flex border-b justify-between">
		<div>
			{#if title}<p class="p-1 px-2 font-bold text-sm">{title}</p>{/if}
		</div>
		<div class="p-1">
			<!-- Open help button -->
			{#if markdownHelp}
				<button
					class="w-4 h-4 mr-2 bg-gray-400 rounded-full text-white text-center text-xs"
					on:click={(e) => (showModal = true)}>?</button
				>
			{/if}
		</div>
	</div>
	<!-- Panel Body -->
	<div class="m-4">
		<pre>{JSON.stringify(viewModel, null, 2)}</pre>
		<Preview tei={viewModel} />
	</div>
</div>

<Modal bind:showModal {title} markdown={markdownHelp} />
