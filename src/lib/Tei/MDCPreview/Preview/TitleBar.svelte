<script>
	export let title = '';
	export let page = 1;
	export let pdfData;
</script>

<div class="text-xs text-white bg-uom-purple px-4 py-2 flex justify-between">
	<p>{title} - Page: {page}</p>
	<div>
		{#if pdfData}
			<!-- <PrintItemButton data={pdf_data} /> -->
		{/if}
	</div>
</div>
