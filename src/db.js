const mongoose = require('mongoose');

module.exports = {
	connect: async (config) => {
		mongo = await mongoose.connect(config.mongoUri, config.mongoose);
		mongoose.set('debug', config.env === 'development');
		connections = mongo.connections;
		console.log(`MongoDB connection established: "${connections[0].name}"`);
		return connections;
	},
};
