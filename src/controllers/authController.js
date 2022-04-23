const { User } = require('../models');
const { jwtToolbox } = require('../utils');
const { jwt } = require('../config');

exports.refresh = async (ctx, next) => {
	const refreshToken = ctx.cookies.get('jwtRefresh');

	// Check if cookie exists
	if (!refreshToken) ctx.throw(400, 'Request has no refresh token');

	// Try verifying against refresh secret
	let payload;
	try {
		payload = await jwtToolbox.verifyToken(refreshToken, jwt.refresh);
	} catch (err) {
		if (err instanceof jwtToolbox.errors.expired) ctx.throw(401, 'Refresh token has expired, please login again');
		if (err instanceof jwtToolbox.errors.token) ctx.throw(400, 'Bad refresh token');
	}

	// Find user from token payload
	const user = await User.findById(payload._id).select('+refreshToken');

	// Check if user still exists
	if (!user) ctx.throw(401, 'User no longer exist, please login again');

	// Check user's saved refreshToken differs from request (manually logged out/banned)
	if (user.refreshToken !== refreshToken) ctx.throw(403, 'Refresh token is no longer valid for this user');

	ctx.body = {
		status: 'ok',
		data: await jwtToolbox.refreshTokens(ctx, user, jwt),
	};
};

exports.login = async (ctx, next) => {
	const { email, password } = ctx.request.body;

	if (!email || !password) ctx.throw(400, 'No email or password provided!');

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.validatePassword(password))) ctx.throw(401, 'Incorrect email or password');

	ctx.body = {
		status: 'ok',
		data: await jwtToolbox.refreshTokens(ctx, user, jwt),
	};
};

exports.logout = async (ctx, next) => {
	const user = await User.findById(ctx.state.user._id);
	await jwtToolbox.clearTokens(ctx, user);
	ctx.body = {
		status: 'ok',
		data: null,
	};
};
