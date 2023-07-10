<script>
	import Information from './MetaData/Information.svelte';

	export let viewModel;
</script>

<Information metadata={viewModel.metadata} />
