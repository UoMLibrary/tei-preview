<script>
	import Child from './Child.svelte';
	export let children;

	export let page;

	let last = (a, i) => i == a.length - 1;

	// on:loadimage passes the dispatched event from Child up through
	// as many levels as were created recursively
</script>

<div class="m-3 border border-gray-300 rounded-md overflow-hidden text-sm">
	{#each children as child, idx}
		{#if child.children}
			<div class="m-3 border border-gray-300 rounded-md overflow-hidden text-sm">
				<Child data={child.data} {page} />
				<div>
					<svelte:self children={child.children} {page} on:updatepage />
				</div>
			</div>
		{:else}
			<Child data={child.data} {page} on:updatepage clickable="true" />
		{/if}
	{/each}
</div>
