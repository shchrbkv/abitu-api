const { Uni, Program } = require('../models');
const qb = require('../utils').queryBuilder;

exports.getAll = async (ctx, next) => {
	const query = ctx.query;

	// Filtering
	const filter = {};
	if (ctx.params.uni) filter.uni = ctx.params.uni;
	if (query.okso) filter.okso = qb.asAll(qb.toArray(query.okso));
	if (query.exams) filter.exams = qb.asAll(qb.toArray(query.exams));
	if (query.bound) filter['stats.general.boundTotal'] = qb.toCondition(query.bound);

	console.log(filter);

	programs = await Program.find(filter).lean().exec();
	ctx.body = {
		status: 'ok',
		data: programs,
	};
};

exports.create = async (ctx, next) => {
	if (!ctx.params.uni) {
		ctx.throw(400, "You can't create a program without Uni. Use /unis/:uni/programs.");
	}
	const data = { ...ctx.request.body, uni: ctx.params.uni };
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
	deleted.clearApplications();

	ctx.body = {
		status: 'ok',
		data: null,
	};
};
