import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let emptyTei = {
	xmlDoc: null,
	fileData: null,
	metaData: null,
	errors: null
};
function createTeiStore() {
	// TEI structure
	const teiStore = writable({ ...emptyTei });

	// If this is running in a browser check to see if there was any TEI data
	// left over from last time/page
	if (browser) {
		loadLocal();
		teiStore.subscribe((value) => saveLocal(value));
	}

	return {
		subscribe: teiStore.subscribe,
		clear,
		set: teiStore.set
	};

	function clear() {
		teiStore.set({ ...emptyTei });
	}

	function saveLocal(value) {
		// Snapshot using get. We have to serialize the XML doc before
		// JSON.stringify() does its work.
		let saveObj = value; // TODO: self?
		let xmlString = null;
		if (saveObj.xmlDoc && saveObj.xmlDoc.documentElement) {
			// Save the xml string as a new field so it doesn't overwrite the
			// live xml document in the store with a string
			xmlString = new XMLSerializer().serializeToString(saveObj.xmlDoc.documentElement);
		}
		saveObj.xmlString = xmlString;
		localStorage.setItem('stringifiedTeiStore', JSON.stringify(saveObj));
	}

	function loadLocal() {
		if (!localStorage.getItem('stringifiedTeiStore')) {
			console.log('HERE');
			return clear();
		}
		let localStoredValue = localStorage.getItem('stringifiedTeiStore');
		// We need to parse the XML string back into a document
		let localStoredObj = { ...emptyTei };
		if (localStoredValue) localStoredObj = JSON.parse(localStoredValue);
		if (localStoredObj.xmlString) {
			let parser = new DOMParser();
			let xmlDoc = parser.parseFromString(localStoredObj.xmlString, 'text/xml');
			localStoredObj.xmlDoc = xmlDoc;
		}
		teiStore.set(localStoredObj);
	}
}

export default createTeiStore();
