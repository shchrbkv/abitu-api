const app = require('./app');
const db = require('./db');
const config = require('./config');

db.connect(config.mongoUri);

function handleError(err, ctx) {
	console.error({ err, event: 'error' }, 'Unhandled exception occured');
	server.close(() => process.exit(1));
}

async function terminate(signal) {
	try {
		await app.terminate();
	} finally {
		console.log({ signal, event: 'terminate' }, 'App is terminated');
		process.kill(process.pid, signal);
	}
}

if (!module.parent) {
	const server = app.listen(config.port, config.host, () => {
		console.log(`API server listening on ${config.host}:${config.port}, in ${config.env}`);
	});
	server.on('error', handleError);

	const errors = ['unhandledRejection', 'uncaughtException'];
	errors.map((error) => {
		process.on(error, handleError);
	});

	const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
	signals.map((signal) => {
		process.once(signal, () => terminate(signal));
	});
}
