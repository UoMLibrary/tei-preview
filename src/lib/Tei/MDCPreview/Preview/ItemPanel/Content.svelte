<script>
	// import { JsonView } from '@zerodevx/svelte-json-view'; // Debugging
	import Children from './Content/Children.svelte';
	import Child from './Content/Child.svelte';
	// No content - https://www.digitalcollections.manchester.ac.uk/view/AR-HAM-00001-00001-00002-00001/1
	// Simple version - https://www.digitalcollections.manchester.ac.uk/view/MS-PERSIAN-00013/773
	// can be nested - see https://stage.digitalcollections.manchester.ac.uk/view/VS-VPH-00023/1
	// recursion in Svelte - https://svelte.dev/tutorial/svelte-self
	export let contents;
</script>

<div class="">
	{#if contents?.structure?.data}
		<div class="m-3 border border-gray-300 rounded-md overflow-hidden text-sm">
			<Child data={contents.structure.data} on:updatepage clickable="true" />
		</div>
	{/if}

	{#if contents?.structure?.children?.length > 0}
		<Children children={contents.structure.children} on:updatepage />
	{/if}
</div>
<!-- DEBUGGING -->
<!-- {#if contents?.structure}
	<div class="bg-white p-2 rounded-md mb-4">
		<JsonView depth="4" json={contents.structure} />
	</div>
{/if} -->
