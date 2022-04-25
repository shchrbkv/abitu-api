const { User } = require('../models');
const { queryBuilder: qb, fieldWhitelist: fw } = require('../utils');

exports.getAll = async (ctx, next) => {
	users = await User.find().select('+refreshToken +loginAt +registeredAt +passwordChangedAt').lean().exec();

	if (!users) ctx.throw(404, 'No users found');

	ctx.body = {
		status: 'ok',
		data: users,
	};
};

exports.create = async (ctx, next) => {
	let data = await fw(ctx.request.body, ['role', 'email', 'password']);
	const user = await User.create(data);
	ctx.body = {
		status: 'ok',
		data: user,
	};
};

exports.getById = async (ctx, next) => {
	const id = ctx.params.user;
	const user = await User.findById(id).select('+refreshToken +loginAt +registeredAt +passwordChangedAt').lean().exec();

	if (!user) ctx.throw(404, `No users found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: user,
	};
};

exports.updateById = async (ctx, next) => {
	const id = ctx.params.user;
	const update = await fw(ctx.request.body, ['role', 'email', 'password', 'refreshToken']);
	let updated = await User.findByIdAndUpdate(id, update, {
		new: true,
		runValidators: true,
	}).exec();

	if (!updated) ctx.throw(404, `No users found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: updated,
	};
};

exports.deleteById = async (ctx, next) => {
	const id = ctx.params.user;
	const deleted = await User.findByIdAndDelete(id).exec();

	if (!deleted) ctx.throw(404, `No users found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: null,
	};
};
