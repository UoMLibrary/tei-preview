const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'uom-purple': '#632390'
			}
		}
	},

	plugins: [typography]
};

module.exports = config;
