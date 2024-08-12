import { json } from '@sveltejs/kit';

export function GET() {
	let obj = { status: 'success', data: { created: new Date(), version: '1.0.0' } };
	return json(obj);
}
