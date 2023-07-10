<script>
	import PDFButton from './TitleBar/PDFButton.svelte';
	import PrintModal from '$lib/UI/PrintModal.svelte';
	import NextPrev from './TitleBar/NextPrev.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title = '';
	export let page = 1;
	export let pdfData;
	export let pageTotal = 0;
	let showModal = false;
</script>

<div class="text-xs text-white bg-uom-purple px-4 py-1 flex justify-between">
	<p class="py-1">{title} - Page: {page}</p>
	<div class="flex">
		<NextPrev
			min={1}
			max={pageTotal}
			current={page}
			on:update={(e) => dispatch('updatepage', { page: e.detail })}
		/>

		{#if pdfData}
			<div class="ml-4 py-1">
				<PDFButton on:click={(e) => (showModal = true)} />
			</div>
		{/if}
	</div>
</div>

<PrintModal bind:showModal title="Save as PDF" {pdfData} />
