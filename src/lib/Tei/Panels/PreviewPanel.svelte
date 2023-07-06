<script>
	// TODO: currently using a hardwired Preview, ideally pass in which one to use
	// Possibly via a <slot/>
	// import Preview from '$lib/MDCUI/Preview.svelte';
	import Preview from '$lib/Tei/MDCPreview/Preview.svelte';
	import Modal from '$lib/UI/MarkdownModal.svelte';

	// Panel data
	let showModal = false;
	export let title = '';
	export let markdownHelp;
	export let message = '';

	// Preview data
	export let viewModel;
	export let page = 1;
</script>

<div class="rounded-md bg-white mb-4 text-xs pb-1">
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
	<div>
		{#if !viewModel}
			<div class="h-4 m-4">{message}</div>
		{:else}
			<!-- Pass the update page through to the parent component -->
			<Preview {viewModel} {page} on:updatepage />
		{/if}
	</div>
</div>

<Modal bind:showModal {title} markdown={markdownHelp} />
