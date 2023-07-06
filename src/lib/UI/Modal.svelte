<script>
	import { marked } from 'marked';
	export let showModal; // boolean

	let dialog; // HTMLDialogElement
	export let title = '';
	export let markdown = '';

	$: if (dialog && showModal) dialog.showModal();
</script>

<div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog
		class="max-w-full w-full sm:w-3/4 lg:w-[1024px] p-0 md:rounded-md"
		bind:this={dialog}
		on:close={() => (showModal = false)}
		on:click|self={() => dialog.close()}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click|stopPropagation>
			<div class="flex justify-between">
				<h2 class="p-2 px-4 text-base lg:text-lg">{title}</h2>
				<!-- svelte-ignore a11y-autofocus -->
				<button class="px-4 py-2 text-sm" autofocus on:click={() => dialog.close()}>Close</button>
			</div>

			<hr />
			{#if markdown && markdown != ''}
				<article class="p-4 prose-sm 2xl:prose-base">
					{#if markdown}
						{@html marked.parse(markdown, { mangle: false, headerIds: false, headerPrefix: false })}
					{/if}
				</article>
			{:else}
				<slot />
			{/if}
		</div>
	</dialog>
</div>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(1px);
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
