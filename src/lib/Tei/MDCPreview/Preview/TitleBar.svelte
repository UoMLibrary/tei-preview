<script>
	import NextPrev from './TitleBar/NextPrev.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title = '';
	export let page = 1;
	export let pdfData;
	export let pageTotal = 0;
</script>

<div class="text-xs text-white bg-uom-purple px-4 py-1 flex justify-between">
	<p class="py-1">{title} - Page: {page}</p>
	<div>
		<div class="">
			<NextPrev
				min={1}
				max={pageTotal}
				current={page}
				on:update={(e) => dispatch('updatepage', { page: e.detail })}
			/>
		</div>
		{#if pdfData}
			<!-- <PrintItemButton data={pdf_data} /> -->
		{/if}
	</div>
</div>
