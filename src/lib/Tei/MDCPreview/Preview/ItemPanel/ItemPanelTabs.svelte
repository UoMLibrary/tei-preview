<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let tabItems = [];
	export let activeItem;

	function handleKeyPress(event, item) {
		// Handle the key press event
		if (event.key === 'Enter' || event.key === ' ') {
			dispatch('tabChange', item);
		}
	}
</script>

<nav class="bg-zinc-100">
	<ul class="flex text-sm text-zinc-800 border-b-[1px]">
		{#each tabItems as item}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li
				class="cursor-pointer px-5 py-3 relative"
				on:click={() => dispatch('tabChange', item)}
				on:keydown={(event) => handleKeyPress(event, item)}
				tabIndex="0"
				class:active={item === activeItem}
			>
				<div class="select-none">{item}</div>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.active {
		background: white;
	}

	.active::after {
		content: '';
		display: inline;
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		border-bottom: 1px solid #fff !important;
	}
</style>
