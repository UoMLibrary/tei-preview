<script>
	// Preview UI Components
	import Header from './Components/Header.svelte';
	import TitleBar from './Components/TitleBar.svelte';
	import ImageViewer from './Components/ImageViewer.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let viewModel;
	export let page;
</script>

<Header />
<TitleBar title="My Item" {page} />
<div class="flex flex-col md:flex-row min-vh-60">
	<div class="flex-1 bg-black">
		<ImageViewer pages={viewModel.pagesObj} {page} showNavigator={true} on:updatepage />
	</div>
	<div class="flex-1">&nbsp;</div>
</div>

<!-- <button
	class="p-2 bg-slate-300 rounded text-gray-700 m-1"
	on:click={(e) => dispatch('updatepage', { page: 2 })}>Goto page 2</button
>  -->

<style>
	/* Setting a custom height for the Preview component of 60% of the screen height */
	.min-vh-60 {
		min-height: 60vh;
	}
</style>
