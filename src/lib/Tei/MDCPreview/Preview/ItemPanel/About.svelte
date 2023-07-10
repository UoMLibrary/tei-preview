<script>
	import Information from './MetaData/Information.svelte';

	export let viewModel;
</script>

<div class="">
	<h2 class="m-4 text-xl">
		{viewModel.aboutObj.title}
		{#if viewModel?.aboutObj?.shelfLocator}({viewModel.aboutObj.shelfLocator}){/if}
	</h2>
	<article class="m-4 prose-sm">
		{@html viewModel.aboutObj.abstractHTML}
	</article>
	<div class="m-4">
		<Information metadata={viewModel.metadata} />
	</div>
	<div class="m-4 text-xs text-gray-400">
		{#if viewModel?.aboutObj?.displayImageRights}{viewModel.aboutObj.displayImageRights}{/if}
	</div>
</div>
