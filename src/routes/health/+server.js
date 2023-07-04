import { json } from '@sveltejs/kit';

export function GET() {
	let obj = { status: 'success', data: { created: new Date() } };
	return json(obj);
}
