<script>
	import { browser } from '$app/environment';

	// Tool Panels and Preview
	import SourceTEI from '$lib/Tei/Panels/SourceTEI.svelte';
	import PreviewPanel from '$lib/Tei/Panels/PreviewPanel.svelte';

	// Stores
	import TeiStore from '$lib/stores/tei-store.js';
	import SefStore from '$lib/stores/sef-store.js';
	import ConfigStore from '$lib/stores/config-store.js';

	// ViewModel processing
	import { createViewModel } from '$lib/Tei/createViewModel.js';

	let page;

	let config = {
		printTemplate:
			'https://image.digitalcollections.manchester.ac.uk/iiif/{imagerefwithpage}/info.json',
		thumbnailTemplate:
			'https://image.digitalcollections.manchester.ac.uk/iiif/{imagerefwithpage}/full/,150/0/default.jpg',
		viewerTemplate:
			'https://image.digitalcollections.manchester.ac.uk/iiif/{imagerefwithpage}/full/,600/0/default.jpg'
	};

	let preTransformXmlDocOutput; // the output of the preTransform (transient)
	let JSONTransformObjOutput; // the output of the JSON transform (transient)
	let ViewModelOutput; // output of the View model transform (transient)

	// Reactive statements. Any change to a var/store in the line starting with $:
	// causes the whole statement to execute
	$: runPreTransform($TeiStore.xmlDoc, $SefStore?.preTransform);
	$: runJSONTransform(preTransformXmlDocOutput, $SefStore?.jsonTransform);
	$: runViewModelTransform(JSONTransformObjOutput, $ConfigStore);

	async function runPreTransform(xmlDoc, sefObj) {
		// browser check to prevent new XMLSerializer being called during a SSR attempt
		if (!browser || !xmlDoc || !$SefStore?.preTransform?.sef)
			return (preTransformXmlDocOutput = null);

		let xmlString = new XMLSerializer().serializeToString(xmlDoc.documentElement);
		let sefObjCopy = SefStore.getKeyCopy('preTransform'); // get a copy (see sef store for details)

		let transformConfig = {
			sourceText: xmlString,
			destination: 'serialized',
			stylesheetInternal: sefObjCopy
		};
		let transform = await SaxonJS.transform(transformConfig, 'async');

		// TODO: Handle errors
		let parser = new DOMParser();
		preTransformXmlDocOutput = parser.parseFromString(transform.principalResult, 'text/xml');
	}

	async function runJSONTransform(xmlDoc, sefObj) {
		// browser check to prevent new XMLSerializer being called during a SSR attempt
		if (!browser || !xmlDoc || !$SefStore?.JSONTransform?.sef)
			return (JSONTransformObjOutput = null);

		let xmlString = new XMLSerializer().serializeToString(xmlDoc.documentElement);
		let sefObjCopy = SefStore.getKeyCopy('JSONTransform'); // get a copy (see sef store for details)

		let transformConfig = {
			sourceText: xmlString,
			destination: 'serialized',
			stylesheetInternal: sefObjCopy
		};
		let transform = await SaxonJS.transform(transformConfig, 'async');

		// TODO: Handle errors
		JSONTransformObjOutput = JSON.parse(transform.principalResult);
	}

	async function runViewModelTransform(cudlJson, configObj) {
		if (!cudlJson || !validateConfig(configObj)) {
			return (ViewModelOutput = null);
		}
		// Quick hack for new Object, transformation will make a copy
		let cudlJsonCopy = JSON.parse(JSON.stringify(cudlJson));
		ViewModelOutput = createViewModel(cudlJsonCopy, configObj);
	}

	function validateConfig(config) {
		// Check the required template strings are there and that the contain
		// the substitution strings
		if (
			config.printTemplate == '' ||
			config.thumbnailTemplate == '' ||
			config.viewerTemplate == '' ||
			!config.printTemplate.includes('{imagerefwithpage}') ||
			!config.thumbnailTemplate.includes('{imagerefwithpage}') ||
			!config.viewerTemplate.includes('{imagerefwithpage}')
		)
			return false;
		else return true;
	}

	// Handle page navigation from Preview internal components.
	function changePage(event) {
		page = event.detail.page;
	}
</script>

<div class="p-4 bg-slate-300 pb-32 h-screen">
	<!-- UI to load TEI XML file -->
	<SourceTEI title="Source TEI Document" markdownHelp="" />

	<!-- Preview panel showing an example of the final viewer output, contains an embedded
		 Preview component. TODO: specify 'Preview' here to swap between a pure data view 
		 and a styled view for a particular organisation.  -->
	<PreviewPanel
		title="Preview"
		markdownHelp=""
		message="Preview generation requires a TEI to be loaded"
		viewModel={ViewModelOutput}
		{page}
		on:updatepage={changePage}
	/>
</div>
