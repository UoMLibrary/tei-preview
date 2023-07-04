/**
 * @typedef {Object} SefObject
 * @property {Object} metadata
 * @property {Object} sef
 * @property {String} filename
 * @property {Array<String>} errors
 */

import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

let emptyStore = {
	preTransform: { metadata: null, sef: null, filename: null, errors: null },
	JSONTransform: { metadata: null, sef: null, filename: null, errors: null }
};

let emptyItem = { metadata: null, sef: null, filename: null, errors: null };

function createSefStore() {
	const sefStore = writable(emptyStore);

	// If this is running in a browser check to see if there was any config
	// left over from last time/page
	if (browser) {
		loadLocal();
		sefStore.subscribe((value) => saveLocal(value));
	}

	return {
		subscribe: sefStore.subscribe,
		clear,
		setKeyValue,
		clearKeyValue,
		loadLocal,
		saveLocal,
		getKeyCopy
	};

	function clear() {
		sefStore.set({ ...emptyStore });
	}

	/**
	 * Clears the value of a key.
	 * @param {string} key - The key to clear.
	 */
	function clearKeyValue(key) {
		setKeyValue(key, { ...emptyItem });
	}

	/**
	 * Sets the value of a key.
	 * @param {string} key - The key to set.
	 * @param {Object} value - The value to set for the key.
	 */
	function setKeyValue(key, value) {
		sefStore.update((items) => {
			if (items[key]) items[key] = null;
			items[key] = value;
			return { ...items };
		});
	}

	// Hack to get around circular issue from sef file being updated
	// during its use which triggers the store update which triggers etc...
	// Makes a copy of the object
	/**
	 * gets a copy of the value for the specified key
	 * @param {string} key - The key to retrieve a copy of the value
	 */
	function getKeyCopy(key) {
		let store = get(sefStore);
		let sefForKey = store?.[key]?.sef;
		let sefCopy = JSON.stringify(sefForKey);
		return JSON.parse(sefCopy);
	}

	/**
	 * Save a copy of all the sef data in localstorage
	 * @param {Object} value - The value to save
	 */
	function saveLocal(value) {
		localStorage.setItem('stringifiedSefStore', JSON.stringify(value));
	}

	function loadLocal() {
		let localStoredValue = localStorage.getItem('stringifiedSefStore');
		let localStoredObj = { ...emptyStore };
		if (localStoredValue) localStoredObj = JSON.parse(localStoredValue);
		sefStore.set(localStoredObj);
	}
}

export default createSefStore();
