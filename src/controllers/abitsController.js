const { Abit, User } = require('../models');
const { queryBuilder: qb, fieldWhitelist: fw } = require('../utils');

exports.getAll = async (ctx, next) => {
	const query = ctx.query;

	// Filtering
	const filter = {};

	const abits = await Abit.find(filter).lean().exec();

	if (!abits.length) ctx.throw(404, 'No abits found');

	ctx.body = {
		status: 'ok',
		data: abits,
	};
};

exports.create = async (ctx, next) => {
	let data = await fw(ctx.request.body, ['snils', 'score']);

	const abit = await Abit.create(data);
	ctx.body = {
		status: 'ok',
		data: abit,
	};
};

exports.getById = async (ctx, next) => {
	const id = ctx.params.abit;
	const abit = await Abit.findById(id).populate(['priority', 'applications']).lean().exec();

	if (!abit) ctx.throw(404, `No abits found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: abit,
	};
};

exports.updateById = async (ctx, next) => {
	const id = ctx.params.abit;

	const priority = ctx.request.body.priority;

	if (!priority) ctx.throw(400, 'No priority list provided');

	if (ctx.state.user.role !== 'admin') {
		const user = await User.findById(ctx.state.user._id);
		if (!user.watchlist.includes(id)) ctx.throw(403, "You don't have permissions to perform that action");
	}

	const update = { priority: priority.map(qb.toObjectId) };

	let updated = await Abit.findByIdAndUpdate(id, update, {
		new: true,
		runValidators: true,
	}).exec();

	if (!updated) ctx.throw(404, `No abits found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: updated,
	};
};

exports.deleteById = async (ctx, next) => {
	const id = ctx.params.abit;
	const deleted = await Abit.findByIdAndDelete(id).exec();

	if (!deleted) ctx.throw(404, `No abits found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: null,
	};
};
