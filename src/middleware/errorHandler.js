const statuses = require('statuses');

module.exports = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.error(err);
		ctx.status = err.status;
		ctx.message = statuses[err.status];
		ctx.body = {
			status: 'error',
			error: err.message,
		};
	}
};
