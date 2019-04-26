require('dotenv').config();
const PORT = process.env.PORT || 3000;
module.exports = {
	app: {
		name: 'Todo Api',
		superSecret: 'ipa-BUhBOJAm',
		baseUrl: `http://localhost:${PORT}`,
		port: PORT,
		auth: {
			expiresIn: 86400
		}
	},
	api: {
		prefix: '^/api/v[1-9]',
		versions: [1],
		patch_version: '1.0.0',
		lang: 'en',
		pagination: {
			itemsPerPage: 10
		},
	},
	database: {
		url: process.env.DB_URL,
	}
};
