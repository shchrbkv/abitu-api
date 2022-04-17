const mongoose = require('mongoose');

module.exports = {
	connect: async (URI) => {
		mongo = await mongoose.connect(URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		connection = mongo.connections;
		console.log(`MongoDB connection established: "${connection[0].name}"`);
		return connection;
	},
};
