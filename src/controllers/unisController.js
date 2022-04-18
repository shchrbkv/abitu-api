const { Uni } = require('../models');

const previewProgramFactory = (program) => {
	return {
		okso: program.okso,
		title: program.title,
		spots: program.stats.spots,
		bound: program.stats.bound,
		exams: program.exams,
	};
};

exports.getAll = async (ctx, next) => {
	let unis = await Uni.find().lean().exec();
	ctx.body = {
		status: 'ok',
		data: unis,
	};
};

exports.create = async (ctx, next) => {
	const uni = await Uni.create(ctx.request.body);
	ctx.body = {
		status: 'ok',
		data: uni,
	};
};

exports.getById = async (ctx, next) => {
	const id = ctx.params.uni;
	const uni = await Uni.findById(id).lean().populate('programs').exec();

	if (!uni) ctx.throw(404, `No universities found with ID [${id}]`);

	if (uni.programs) uni.programs = uni.programs.map(previewProgramFactory);

	ctx.body = {
		status: 'ok',
		data: uni,
	};
};

exports.updateById = async (ctx, next) => {
	const id = ctx.params.uni;
	const update = ctx.request.body;
	let updated = await Uni.findByIdAndUpdate(id, update, {
		new: true,
		runValidators: true,
	}).exec();

	if (!updated) ctx.throw(404, `No universities found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: updated,
	};
};

exports.deleteById = async (ctx, next) => {
	const id = ctx.params.uni;
	const deleted = await Uni.findByIdAndDelete(id).exec();

	if (!deleted) ctx.throw(404, `No universities found with ID [${id}]`);
	deleted.clearPrograms();

	ctx.body = {
		status: 'ok',
		data: null,
	};
};
