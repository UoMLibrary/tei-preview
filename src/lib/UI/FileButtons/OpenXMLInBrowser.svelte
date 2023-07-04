<script>
	// Open XML Doc button in a new browser tab. Defaults to hidden if there is no
	// valid xml doc
	export let tabName = '_blank';
	export let xmlDoc;

	function openXMLInBrowser(xmlDoc, tabName) {
		if (!xmlDoc?.documentElement) return;
		let xmlString = new XMLSerializer().serializeToString(xmlDoc.documentElement);
		// Create a Blob URL from the XML content
		const blob = new Blob([xmlString], { type: 'text/xml' });
		const url = URL.createObjectURL(blob);
		window.open(url, tabName);
	}
</script>

{#if xmlDoc?.documentElement}
	<button class="p-1 mr-2" on:click={(e) => openXMLInBrowser(xmlDoc, tabName)}>View XML</button>
{/if}
