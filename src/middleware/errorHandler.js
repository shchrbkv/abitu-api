module.exports = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		status = ctx.status;
		message = ctx.message;
		ctx.body = {
			status: 'error',
			error: err.message,
		};
		ctx.status = status;
		ctx.message = message;
	}
};
