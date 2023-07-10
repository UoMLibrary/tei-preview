<script>
	import ItemPanelTabs from './ItemPanel/ItemPanelTabs.svelte';
	import About from './ItemPanel/About.svelte';
	import Content from './ItemPanel/Content.svelte';
	import Thumbnails from './ItemPanel/Thumbnails.svelte';
	import Metadata from './ItemPanel/Metadata.svelte';
	import ActionPanel from './ItemPanel/ActionPanel.svelte';

	export let viewModel;
	export let page;

	let tabItems = ['About', 'Contents', 'Thumbnails', 'Metadata', 'More...'];
	let activeItem = 'About';
</script>

<aside class="flex flex-col h-full">
	<ItemPanelTabs {activeItem} {tabItems} on:tabChange={(e) => (activeItem = e.detail)} />
	<div class="flex-1 bg-white">
		{#if activeItem == 'About'}
			<About metadata={viewModel.about} />
		{:else if activeItem == 'Contents'}
			<Content contents={viewModel.contents} on:updatePage />
		{:else if activeItem == 'Thumbnails'}
			<Thumbnails pages={viewModel.thumbnails} on:updatePage />
		{:else if activeItem == 'Metadata'}
			<Metadata metadata={viewModel.metadata} />
		{:else}
			<div class="text-xs"><p class="flex-1">Under construction...</p></div>
		{/if}
	</div>
	<ActionPanel />
</aside>
