import { error, json, text } from '@sveltejs/kit';
/* 
	Code in here will run when the application starts up, making it a useful
   	place for initializing database clients and so on.
*/
let allowedPOSTPaths = ['/preview/posted'];
let allowedOrigins = ['http://192.168.1.129:5173', 'http://localhost:5173'];

/* 
	**handle**
	This function runs every time the SvelteKit server receives a request — whether
	that happens while the app is running, or during prerendering — and determines 
	the response.

	To switch off csrf for one route, we need to switch it off for everything and then
	add it back here.
*/
export async function handle({ event, resolve }) {
	const origin = event.request.headers.get('origin') || '';
	// console.log(`origin '${origin}' !== event.url.origin '${event.url.origin}'`);

	const forbidden =
		event.request.method === 'POST' &&
		origin !== event.url.origin &&
		!(allowedOrigins.includes(origin) && allowedPOSTPaths.includes(event.url.pathname)) &&
		isFormContentType(event.request);

	if (forbidden) {
		const csrfError = error(
			403,
			`Cross-site ${event.request.method} form submissions are forbidden`
		);
		if (event.request.headers.get('accept') === 'application/json') {
			return json(csrfError.body, { status: csrfError.status });
		}
		return text(csrfError.body.message, { status: csrfError.status });
	}

	return resolve(event);
}

function isContentType(request, ...types) {
	const type = request.headers.get('content-type')?.split(';', 1)[0].trim() ?? '';
	return types.includes(type);
}

function isFormContentType(request) {
	return isContentType(request, 'application/x-www-form-urlencoded', 'multipart/form-data');
}
