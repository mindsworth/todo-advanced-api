require('dotenv').config();
module.exports = {
	database: {
		url: process.env.DB_TEST_URL,
	}
};
