const jwt = require('jsonwebtoken');
const promisify = require('./promisify');
const ms = require('ms');

const signToken = async (payload, config) =>
	promisify(jwt.sign)(payload, config.secret, {
		expiresIn: config.expires,
	});

const verifyToken = async (token, config) => promisify(jwt.verify)(token, config.secret);
exports.verifyToken = verifyToken;

const generateTokenPair = async (payload, config) => {
	const access = await signToken(payload, config.access);
	const refresh = await signToken(payload, config.refresh);
	return { access, refresh };
};

exports.refreshTokens = async (ctx, user, config) => {
	const payload = { _id: user._id, role: user.role };
	const tokens = await generateTokenPair(payload, config);

	ctx.cookies.set('jwtAccess', tokens.access, {
		expires: new Date(Date.now() + ms(config.access.expires)),
		httpOnly: true,
		// secure: true,
	});

	ctx.cookies.set('jwtRefresh', tokens.refresh, {
		expires: new Date(Date.now() + ms(config.refresh.expires)),
		httpOnly: true,
		path: '/auth',
		// secure: true,
	});

	user.refreshToken = tokens.refresh;

	await user.save();

	user.refreshToken = undefined;
	user.password = undefined;

	return user;
};

exports.clearTokenCookies = async (ctx) => {
	ctx.cookies.set('jwtAccess', '', {
		expires: Date.now(),
		httpOnly: true,
		// secure: true,
	});

	ctx.cookies.set('jwtRefresh', '', {
		expires: Date.now(),
		httpOnly: true,
		path: '/auth',
		// secure: true,
	});
};

exports.errors = { expired: jwt.TokenExpiredError, invalid: jwt.JsonWebTokenError };
