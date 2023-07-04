<script>
	//import PreviewPanel from '$lib/Tei/Tools/PreviewPanel.svelte';
	import { browser } from '$app/environment';

	// Markdown popover help
	import previewToolOverviewDoc from '$lib/markdown/previewToolOverviewDoc.js';
	import SourceTeiDoc from '$lib/markdown/SourceTeiDoc.js';
	import preFilterXSLTDoc from '$lib/markdown/preFilterXSLTDoc.js';
	import preFilterOutputDoc from '$lib/markdown/preFilterOutputDoc.js';
	import jsonTransformXSLTDoc from '$lib/markdown/jsonTransformXSLTDoc.js';
	import CudlJSONDoc from '$lib/markdown/CudlJSONDoc.js';
	import ConfigDoc from '$lib/markdown/ConfigDoc.js';
	import ViewModelDoc from '$lib/markdown/ViewModelDoc.js';
	import previewPanelDoc from '$lib/markdown/previewPanelDoc.js';

	// Stores
	import TeiStore from '$lib/stores/tei-store.js';
	import SefStore from '$lib/stores/sef-store.js';
	import ConfigStore from '$lib/stores/config-store.js';

	// ViewModel processing
	import { createViewModel } from '$lib/Tei/createViewModel.js';

	// Tool Panels and Preview
	import SourceTEI from '$lib/Tei/Panels/SourceTEI.svelte';
	import XSLTViewer from '$lib/Tei/Panels/XSLTViewer.svelte';
	import XMLViewerPanel from '$lib/Tei/Panels/XMLViewerPanel.svelte';
	import JSONViewer from '$lib/Tei/Panels/JSONViewer.svelte';
	import Config from '$lib/Tei/Panels/Config.svelte';
	//import Preview from '$lib/MDCUI/Preview.svelte';

	// UI
	import Modal from '$lib/UI/Modal.svelte';
	import Icon from 'svelte-awesome';
	import { faPlus, faChevronDown, faArrowDown } from '@fortawesome/free-solid-svg-icons';

	let showModal = false;
	let page;
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

	// Handle page navigation from Previews internal components. Adds
	// the url in the browsers history without causing a page reload.
	function changePage(newPage) {
		page = newPage;
	}
</script>

<div class="p-4 bg-slate-300">
	<!-- Preview tool Help Overview button -->
	<div class="flex justify-end mb-2">
		<button
			class="w-4 h-4 mr-2 bg-gray-400 rounded-full text-white text-center text-xs"
			on:click={(e) => (showModal = true)}>?</button
		>
	</div>

	<!-- UI to load TEI XML file -->
	<SourceTEI title="Source TEI Document" markdownHelp={SourceTeiDoc} />

	<!-- + symbol (decorative) -->
	<div class="flex justify-center mb-4">
		<Icon data={faPlus} style="color: #666666" scale="1.0" />
	</div>

	<!-- UI to load preFilter XSLT doc and formats it to a form used by SaxtonJS -->
	<XSLTViewer title="Pre filter XSLT" markdownHelp={preFilterXSLTDoc} sefId="preTransform" />

	<!-- down arrow (decorative) -->
	<div class="flex justify-center mb-4">
		<Icon data={faArrowDown} style="color: #666666" scale="1.2" />
	</div>

	<!-- XML Viewer that contains preFilter transform XSLT output -->
	<XMLViewerPanel
		title="XML output from Pre filter transformation"
		xmlDoc={preTransformXmlDocOutput}
		markdownHelp={preFilterOutputDoc}
		saveFile="preFilterOutput.xml"
		message="XML content generation requires TEI XML and preFiler XSLT to be configured"
	/>

	<!-- + symbol (decorative) -->
	<div class="flex justify-center mb-4">
		<Icon data={faPlus} style="color: #666666" scale="1.0" />
	</div>

	<!-- UI to load JSONTransform XSLT doc and formats it to a form used by SaxtonJS -->
	<XSLTViewer
		title="JSON formatter XSLT"
		markdownHelp={jsonTransformXSLTDoc}
		sefId="JSONTransform"
	/>

	<!-- down arrow (decorative) -->
	<div class="flex justify-center mb-4">
		<Icon data={faArrowDown} style="color: #666666" scale="1.2" />
	</div>

	<!-- JSON Viewer that contains JSONtransform XSLT output -->
	<JSONViewer
		jsonData={JSONTransformObjOutput}
		title="Cudl JSON output"
		savefile="jsonTransformOutput.json"
		markdownHelp={CudlJSONDoc}
		message="JSON content generation requires Prefilter Output and JSON transform XSLT to be configured"
	/>

	<!-- + symbol (decorative) -->
	<div class="flex justify-center mb-4">
		<Icon data={faPlus} style="color: #666666" scale="1.0" />
	</div>

	<!-- UI to specify url paths etc for transform into final JSON ViewModel -->
	<Config title="Configuration" markdownHelp={ConfigDoc} />

	<!-- down arrow (decorative) -->
	<div class="flex justify-center mb-4">
		<Icon data={faArrowDown} style="color: #666666" scale="1.2" />
	</div>

	<!-- JSON Viewer that contains ViewModel output (not part of existing process) -->
	<JSONViewer
		jsonData={ViewModelOutput}
		title="View Model"
		savefile="viewmodel.json"
		markdownHelp={ViewModelDoc}
		message="View Model generation requires Cudl Output and Configuration be configured"
	/>

	<!-- down arrow (decorative) -->
	<div class="flex justify-center mb-4">
		<Icon data={faArrowDown} style="color: #666666" scale="1.2" />
	</div>

	<!-- Preview panel showing an example of the final viewer output -->
	<!-- <PreviewPanel
	title="title"
	markdownHelp={previewPanelDoc}
	viewModel={ViewModelOutput}
	tei={ViewModelOutput}
	on:updatepage={(e) => changePage(e.detail)}
	{page}
/> -->
	<!-- <Preview
	tei={$TeiStore}
	{page}
	on:updatepage={(e) => changePage(e.detail)}
	itemid={'Filename goes here'}
/> -->

	<!-- Print tool output -->
	<!-- Page process XMLT -->
	<!-- Transcriptions/translations XSLT -->
</div>

<Modal bind:showModal title="Preview Tool" markdown={previewToolOverviewDoc} />
