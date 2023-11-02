export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		let teistring = data.get('teistring');
		return { teistring: teistring };
	}
};
