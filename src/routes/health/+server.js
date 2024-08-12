import { json } from '@sveltejs/kit';
import { version } from './package.json';

export function GET() {
	let obj = { status: 'success', data: { created: new Date(), version } };
	return json(obj);
}
