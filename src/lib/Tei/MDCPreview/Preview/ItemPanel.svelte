<script>
	import ItemPanelTabs from './ItemPanel/ItemPanelTabs.svelte';

	export let viewModel;
	export let page;

	let tabItems = ['About', 'Contents', 'Thumbnails', 'Metadata', 'More...'];
	let activeItem = 'About';
</script>

<aside class="flex flex-col">
	<ItemPanelTabs {activeItem} {tabItems} on:tabChange={(e) => (activeItem = e.detail)} />
</aside>
