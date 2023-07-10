<script>
	// display the metadata key pairs
	export let metadata = [];
</script>

{#if metadata?.length > 0}
	<div class="m-4 border border-purple-400 rounded-md overflow-hidden text-sm">
		<div class="flex justify-between bg-zinc-300 p-3">
			<h4 class="m-0 text-uom-purple">Information about this document</h4>
		</div>

		<div class="p-3">
			<ul>
				{#each metadata as data}
					<li>
						<b>{data.label}: </b>
						{#each data.value as value, idx}
							{#if value?.link}
								<a href={value.link} class="cudLink" alt={value.text}>{@html value.text}</a
								>{#if idx < data.value.length - 1};&nbsp;{/if}
							{:else}
								{@html value.text}{#if idx < data.value.length - 1};&nbsp;{/if}
							{/if}
						{/each}
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
