import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let emptyConfig = {
	viewerTemplate: '',
	thumbnailTemplate: '',
	printTemplate: ''
};

let defaultConfig = {
	viewerTemplate:
		'https://image.digitalcollections.manchester.ac.uk/iiif/{imagerefwithpage}/info.json',
	thumbnailTemplate:
		'https://image.digitalcollections.manchester.ac.uk/iiif/{imagerefwithpage}/full/,150/0/default.jpg',
	printTemplate:
		'https://image.digitalcollections.manchester.ac.uk/iiif/{imagerefwithpage}/full/,600/0/default.jpg'
};

// Used for testing with local IIIF server
let localConfig = {
	viewerTemplate: 'http://localhost:8008/{imagerefwithpage}/info.json',
	thumbnailTemplate: 'http://localhost:8008/{imagerefwithpage}/full/,150/0/default.jpg',
	printTemplate: 'http://localhost:8008/{imagerefwithpage}/full/,600/0/default.jpg'
};

function createConfigStore() {
	const configStore = writable(emptyConfig);

	// If this is running in a browser check to see if there was any config
	// left over from last time/page
	if (browser) {
		loadLocal();
		configStore.subscribe((value) => saveLocal(value));
	}

	return {
		subscribe: configStore.subscribe,
		clear,
		setDefault,
		setLocal,
		setKeyValue,
		loadLocal,
		saveLocal,
		loadJson
	};

	function clear() {
		configStore.set({ ...emptyConfig });
	}

	function setDefault() {
		configStore.set({ ...defaultConfig });
	}

	function setLocal() {
		configStore.set({ ...localConfig });
	}

	function setKeyValue(key, value) {
		configStore.update((items) => {
			items[key] = value;
			return { ...items };
		});
	}

	function loadJson(jsonObj) {
		configStore.set(jsonObj);
	}

	function saveLocal(value) {
		localStorage.setItem('stringifiedConfigStore', JSON.stringify(value));
	}

	function loadLocal() {
		// Check for undefined
		if (!localStorage.getItem('stringifiedConfigStore')) return clear();

		let localStoredValue = localStorage.getItem('stringifiedConfigStore');
		let localStoredObj = { ...emptyConfig };
		if (localStoredValue) localStoredObj = JSON.parse(localStoredValue);
		configStore.set(localStoredObj);
	}
}

export default createConfigStore();
