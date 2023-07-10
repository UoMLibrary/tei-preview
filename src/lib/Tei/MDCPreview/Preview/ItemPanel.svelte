<script>
	import ItemPanelTabs from './ItemPanel/ItemPanelTabs.svelte';
	import About from './ItemPanel/About.svelte';
	import Content from './ItemPanel/Content.svelte';
	import Thumbnails from './ItemPanel/Thumbnails.svelte';
	import Metadata from './ItemPanel/Metadata.svelte';
	import ActionPanel from './ItemPanel/ActionPanel.svelte';

	export let viewModel;
	export let page;

	$: console.log(viewModel);

	let tabItems = ['About', 'Contents', 'Thumbnails', 'Metadata', 'More...'];
	let activeItem = 'About';
</script>

<aside class="flex flex-col min-h-[500px] h-[500px]">
	<ItemPanelTabs {activeItem} {tabItems} on:tabChange={(e) => (activeItem = e.detail)} />
	<div class="flex-1 bg-white overflow-y-auto">
		{#if activeItem == 'About'}
			<About {viewModel} />
		{:else if activeItem == 'Contents'}
			<Content contents={viewModel.contents} on:updatepage />
		{:else if activeItem == 'Thumbnails'}
			<Thumbnails thumbnails={viewModel.thumbnails} on:updatepage />
		{:else if activeItem == 'Metadata'}
			<Metadata metadata={viewModel.metadata} />
		{:else}
			<div class="text-xs"><p class="flex-1">Under construction...</p></div>
		{/if}
	</div>
	<ActionPanel />
</aside>
