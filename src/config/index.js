const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

module.exports = {
	env: process.env.NODE_ENV || 'development',
	host: process.env.HOST || '127.0.0.1',
	port: parseInt(process.env.PORT, 10) || 3333,
	mongoUri: process.env.MONGO_URI,
};
