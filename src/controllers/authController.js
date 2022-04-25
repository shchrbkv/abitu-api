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

	user.loginAt = Date.now();

	ctx.body = {
		status: 'ok',
		data: await jwtToolbox.refreshTokens(ctx, user, jwt),
	};
};

exports.logout = async (ctx, next) => {
	const user = await User.findById(ctx.state.user._id);
	await jwtToolbox.clearTokenCookies(ctx);
	user.refreshToken = undefined;
	await user.save();
	ctx.body = {
		status: 'ok',
		data: null,
	};
};

exports.register = async (ctx, next) => {
	const data = ctx.request.body;
	const user = await User.create({
		email: data.email,
		password: data.password,
		registeredAt: Date.now(),
	});

	ctx.status = 201;
	ctx.body = {
		status: 'ok',
		data: user,
	};
};

exports.getMe = async (ctx, next) => {
	const id = ctx.state.user._id;
	const user = await User.findById(ctx.state.user._id);
	ctx.body = {
		status: 'ok',
		data: await jwtToolbox.refreshTokens(ctx, user, jwt),
	};
};

exports.updateMe = async (ctx, next) => {
	const update = ctx.request.body;
	const allowedTypes = ['password', 'email', 'watchlist'];

	// Operation type validation
	if (!update.type) ctx.throw(400, 'Operation has no type, use [password/data/role]');
	if (!allowedTypes.includes(update.type)) ctx.throw(400, 'Operation type is not valid, use [password/data]');

	const user = await User.findById(ctx.state.user._id).select('+password');
	if (!user) ctx.throw(404, `User no longer exist`);

	// Update password
	if (update.type === 'password') {
		// Check if new password provided and old password is correct
		if (!update.newPassword) ctx.throw(400, 'No new password provided');
		if (!update.password || !(await user.validatePassword(update.password)))
			ctx.throw(400, 'Current password is wrong');

		// Set new password
		user.password = update.newPassword;
		user.passwordChangedAt = Date.now();
	}

	// Update data
	if (update.type === 'email') {
		//Check if email exist
		if (!update.email) ctx.throw(400, 'No email provided');

		// Set new email
		user.email = update.email;
	}

	// Update watchlist
	if (update.type === 'watchlist') {
		// Check if watchlist exist
		if (!update.watchlist) ctx.throw(400, 'No watchlist provided');

		// Set the new watchlist
		user.watchlist = update.watchlist;
	}

	// Send updated user with refreshed tokens
	ctx.body = {
		status: 'ok',
		data: await jwtToolbox.refreshTokens(ctx, user, jwt),
	};
};

exports.deleteMe = async (ctx, next) => {
	const id = ctx.state.user._id;

	const deleted = await User.findByIdAndDelete(id).exec();
	if (!deleted) ctx.throw(404, `No users found with ID [${id}]`);

	await jwtToolbox.clearTokenCookies(ctx);

	ctx.body = {
		status: 'ok',
		data: null,
	};
};
