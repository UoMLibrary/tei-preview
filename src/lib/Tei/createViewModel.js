// Convert a Cudl JSON object with a configuration object to a ViewModel
export function createViewModel(cudlObj, configObj) {
	let pdfObj = createPdfObject(cudlObj.pages, configObj);
	let pages = createPagesArray(cudlObj.pages, configObj);
	let thumbnails = createThumbnailsArray(cudlObj.pages, configObj);
	let metadata = createMetadataArray(cudlObj);
	let viewModel = {
		metadata,
		pdfObj,
		pages,
		thumbnails,
		content: ''
	};
	return viewModel;
}

function createPagesArray(pagesArray, configObj) {
	let items = [];
	pagesArray.forEach((page, index) => {
		// console.log(page);
		let item = configObj.viewerTemplate.replace('{imagerefwithpage}', page.IIIFImageURL);
		items.push(item);
	});
	return items;
}

function createThumbnailsArray(pagesArray, configObj) {
	let items = [];
	pagesArray.forEach((page, index) => {
		// console.log(page);
		let url = configObj.thumbnailTemplate.replace('{imagerefwithpage}', page.IIIFImageURL);
		let label = page.label ?? '';
		items.push({ url, label });
	});
	return items;
}

function createPdfObject(pagesArray, configObj) {
	// TODO: PASS IN ITEM REFERENCE FROM CONFIG OR CUDL JSON?
	let pdfObj = {};
	// TODO: PASS IN ITEM REF FROM CUDL BUT OFFER OVERRIDE ON CONFIG OBJECT
	//let downloadImageRights = tei?.raw?.descriptiveMetadata?.[0]?.downloadImageRights;
	let itemid = 'TESTID';
	let downloadImageRights = 'Missing copyright message';

	// TODO: This should live elsewhere or in the tei JSON data structure
	// update print data structure
	pdfObj = {
		filename: `${itemid}.pdf`,
		header_text: `${itemid}`,
		footer_text: downloadImageRights
	};
	let items = [];
	pagesArray.forEach((page, index) => {
		// console.log(page);
		let item = {
			height: page.imageHeight,
			width: page.imageWidth,
			image_url: configObj.printTemplate.replace('{imagerefwithpage}', page.IIIFImageURL),
			image_text: `${index + 1}: ${page.label || ''}\n${page.IIIFImageURL || ''}\n${
				page.imageWidth
			} x ${page.imageHeight}`
		};
		items.push(item);
	});
	pdfObj.items = items;
	return pdfObj;
}

// Returns an array of metadata in the form of key pair values. Values are objects that may have
// extra fields such as type and text.
// Possibility this is also RECURSIVE. Structure may contain children
function createMetadataArray(cudlObj) {
	let descriptiveMetadata = cudlObj.descriptiveMetadata?.[0] ?? {};
	let metadataArray = [];

	// TODO: handle the case where there is no label but there is an array of items
	// containing labels (not this is a recursive call)
	// NOTE: There is no testing for seq on the array of items version
	for (const [key, value] of Object.entries(descriptiveMetadata)) {
		if (value?.label && value?.display && value?.seq) metadataArray.push(value);
	}
	metadataArray = metadataArray.sort((a, b) => a.seq - b.seq);
	// console.log(JSON.stringify(metadataArray, null, 2));

	// TODO: 'Date of Creation' missing see below link
	// https://stage.digitalcollections.manchester.ac.uk/view/VS-VPH-00023/1

	let data = [];
	// Format the metadata into final form
	metadataArray.forEach((item) => {
		if (item?.displayForm) {
			data.push({ label: item.label, value: [{ text: item.displayForm }] });
		} else if (item?.value && item?.value instanceof Array) {
			let textArray = [];
			// value should ideally be values but they provide an array named singular
			// Assume we satisfy the seq, label, display test as this should have happened
			// prior to getting here in the metadataArray construction.
			item.value.forEach((value) => {
				if (value?.displayForm) {
					let textObj = { text: value.displayForm };
					// If there is a link, encode it
					if (value?.linktype === 'keyword search') {
						textObj.link = `/search?keyword=${encodeURIComponent(value.displayForm)}`;
					}
					textArray.push(textObj);
				}
			});
			// Add the metadata item if there is any value to display
			if (textArray.length > 0) data.push({ label: item.label, value: textArray });
			// TODO: Why not using provided authorityURI or valueURI with viaf links?
			//data.push({ label: item.label, text: item.displayForm });
		}
	});
	// console.log(JSON.stringify(data, null, 2));

	return data;
}
