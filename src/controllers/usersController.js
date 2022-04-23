const { User } = require('../models');
const config = require('../config');
const { jwtToolbox } = require('../utils');

exports.getAll = async (ctx, next) => {};

exports.register = async (ctx, next) => {
	const user = await User.create({
		email: ctx.request.body.email,
		password: ctx.request.body.password,
	});

	ctx.status = 201;
	ctx.body = {
		status: 'ok',
		data: await jwtToolbox.refreshTokens(ctx, user, config.jwt),
	};
};
