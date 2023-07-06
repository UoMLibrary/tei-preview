<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let viewModel;
	export let page;
</script>

<h1>Page: {page}</h1>
<button
	class="p-2 bg-slate-300 rounded text-gray-700 m-1"
	on:click={(e) => dispatch('updatepage', { page: 2 })}>Goto page 2</button
>
<pre>{JSON.stringify(viewModel, null, 2)}</pre>
