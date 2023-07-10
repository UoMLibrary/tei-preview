// Convert a Cudl JSON object with a configuration object to a ViewModel
export function createViewModel(cudlJson, configObj) {
	let pdfObj = createPdfObject(cudlJson.pages, configObj);
	let pagesObj = createPagesObject(cudlJson.pages, configObj);
	let viewModel = {
		raw: cudlJson,
		pages: cudlJson.pages,
		content: '',
		metadata: '',
		pdfObj,
		pagesObj
	};
	return viewModel;
}

function createPagesObject(pagesArray, configObj) {
	let items = [];
	pagesArray.forEach((page, index) => {
		// console.log(page);
		let item = configObj.viewerTemplate.replace('{imagerefwithpage}', page.IIIFImageURL);
		items.push(item);
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
