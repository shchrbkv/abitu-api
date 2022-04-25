const jwtToolbox = require('./jwtToolbox');
const { jwt } = require('../config');

// TODO: Check for editor UNI

exports.auth = async (ctx, next) => {
	const accessToken = ctx.cookies.get('jwtAccess');

	// Check if cookie exists
	if (!accessToken) ctx.throw(400, 'No access token: please login or refresh');

	// Try verifying against access secret
	let payload;
	try {
		payload = await jwtToolbox.verifyToken(accessToken, jwt.access);
	} catch (err) {
		if (err instanceof jwtToolbox.errors.expired) ctx.throw(401, 'Access token has expired: please refresh at /auth');
		if (err instanceof jwtToolbox.errors.invalid) ctx.throw(400, 'Bad access token');
	}

	// Build user from payload
	const user = { _id: payload._id, role: payload.role };

	// Append user to context
	ctx.state.user = user;

	await next();
};

exports.for = (...roles) => {
	return async (ctx, next) => {
		// Check clearance
		if (!roles.includes(ctx.state.user.role)) ctx.throw(403, 'You do not have permission to perform this action');
		await next();
	};
};
