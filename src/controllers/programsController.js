const { Uni, Program } = require('../models');

exports.getAll = async (ctx, next) => {
	let programs;
	if (ctx.params.uni) {
		const uniId = ctx.params.uni;
		programs = await Program.find({ uni: uniId }).lean().exec();
	} else {
		programs = await Program.find({}).lean().exec();
	}
	ctx.body = {
		status: 'ok',
		data: programs,
	};
};

exports.create = async (ctx, next) => {
	const data = ctx.request.body;
	data.uni = ctx.params.uni || data.uni;
	const program = await Program.create(data);
	ctx.body = {
		status: 'ok',
		data: program,
	};
};

exports.getById = async (ctx, next) => {
	const id = ctx.params.program;
	const program = await Program.findById(id).lean().exec();

	if (!program) ctx.throw(404, `No programs found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: program,
	};
};

exports.updateById = async (ctx, next) => {
	const id = ctx.params.program;
	const update = ctx.request.body;
	let updated = await Program.findByIdAndUpdate(id, update, {
		new: true,
		runValidators: true,
	}).exec();

	if (!updated) ctx.throw(404, `No programs found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: updated,
	};
};

exports.deleteById = async (ctx, next) => {
	const id = ctx.params.program;
	const deleted = await Program.findByIdAndDelete(id).exec();

	if (!deleted) ctx.throw(404, `No programs found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: null,
	};
};
