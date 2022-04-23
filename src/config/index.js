const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

module.exports = {
	env: process.env.NODE_ENV || 'development',
	host: process.env.HOST || '127.0.0.1',
	port: parseInt(process.env.PORT, 10) || 3333,
	mongoUri: process.env.MONGO_URI,
	mongoose: {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	},
	jwt: {
		refresh: { secret: process.env.JWT_REFRESH, expires: process.env.JWT_REFRESH_EXPIRES },
		access: { secret: process.env.JWT_ACCESS, expires: process.env.JWT_ACCESS_EXPIRES },
	},
};
