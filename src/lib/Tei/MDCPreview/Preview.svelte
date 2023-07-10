<script>
	// Preview UI Components
	import Header from './Preview/Header.svelte';
	import TitleBar from './Preview/TitleBar.svelte';
	import ImageViewer from './Preview/ImageViewer.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let viewModel;
	export let page;
</script>

<Header />
<TitleBar
	title="My Item"
	{page}
	pageTotal={viewModel.pages.length}
	pdfData={viewModel.pdfObj}
	on:updatepage
/>
<div class="flex flex-col md:flex-row">
	<div class="flex-1 bg-red-200">
		<ImageViewer pages={viewModel.pagesObj} {page} showNavigator={true} />
	</div>
	<div class="flex-1">&nbsp;</div>
</div>
<!-- style="min-height: 60vh;" -->
