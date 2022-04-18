const { Application, Program } = require('../models');

exports.getAll = async (ctx, next) => {
	let applications;
	if (ctx.params.program) {
		const programId = ctx.params.program;
		applications = await Application.find({ program: programId }).lean().exec();
	} else {
		applications = await Application.find({}).lean().exec();
	}
	ctx.body = {
		status: 'ok',
		data: applications,
	};
};

exports.create = async (ctx, next) => {
	if (!ctx.params.program) {
		ctx.throw(400, "You can't create an application without Program. Use /programs/:program/applications.");
	}
	const data = Array.isArray(ctx.request.body) ? ctx.params.program : [ctx.request.body];
	for (doc of data) {
		doc.program = ctx.params.program;
	}
	const applications = await Application.insertMany(data);
	ctx.body = {
		status: 'ok',
		data: applications,
	};
};

exports.getById = async (ctx, next) => {
	const id = ctx.params.application;
	const application = await Application.findById(id).lean().exec();

	if (!application) ctx.throw(404, `No applications found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: application,
	};
};

exports.updateById = async (ctx, next) => {
	const id = ctx.params.application;
	const update = ctx.request.body;
	let updated = await Application.findByIdAndUpdate(id, update, {
		new: true,
		runValidators: true,
	}).exec();

	if (!updated) ctx.throw(404, `No applications found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: updated,
	};
};

exports.deleteById = async (ctx, next) => {
	const id = ctx.params.application;
	const deleted = await Application.findByIdAndDelete(id).exec();

	if (!deleted) ctx.throw(404, `No applications found with ID [${id}]`);

	ctx.body = {
		status: 'ok',
		data: null,
	};
};
