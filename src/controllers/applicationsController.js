const { Application, Program } = require('../models');
const { queryBuilder: qb, fieldWhitelist: fw } = require('../utils');

exports.getAll = async (ctx, next) => {
	const query = ctx.query;

	const filter = {};
	let sort = { index: 1 };

	if (ctx.params.program) {
		// Set program ID
		filter.program = ctx.params.program;

		// Filtering
		if (query.consent) filter['consent.status'] = qb.castBoolean(query.consent);

		// Sorting
		if (query.sort) sort = qb.castSort(query.sort);
		if (sort.canon) sort = { 'score.total': sort.canon, 'consent.status': sort.canon };
	}

	// Pagination
	const { skip, limit } = qb.castPage(query.page, query.limit);

	// Neighbor pagination
	if (query.lastVal && query.lastId) {
		const lastVal = qb.castNumber(query.lastVal);
		const lastId = query.lastId;
		const sortMode = Object.keys(sort)[0];
		const sortDir = ~sort[sortMode] ? '$gt' : '$lt';
		filter.$or = qb.toNeighbors(sortMode, sortDir, lastVal, lastId);
	}

	const applications = await Application.find(filter).sort(sort).limit(limit).lean().exec();

	if (!applications) ctx.throw(404, 'No applications found');

	ctx.body = {
		status: 'ok',
		data: applications,
	};
};

exports.create = async (ctx, next) => {
	const program = ctx.params.program;
	if (!program) {
		ctx.throw(400, "You can't create an application without Program. Use /programs/:program/applications.");
	}

	let data = ctx.request.body;

	// Always as array
	if (!Array.isArray(data)) data = [data];

	const existing = await Application.find({ program }).lean().distinct('snils').exec();

	// Iterate through all docs to format and filter existing ones
	const pending = [];
	for (doc of data) {
		if (existing.includes(doc.snils)) continue;
		doc = await fw(doc, ['snils', 'way', 'score', 'exams', 'stats']);
		doc.program = ctx.params.program;
		doc.updatedBy = ctx.state.user._id;
		pending.push(doc);
	}

	// If exists update, if not — create
	const applications = await Application.insertMany(pending);

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
	const update = await fw(ctx.request.body, ['snils', 'way', 'score', 'exams', 'stats']);
	update.updatedBy = ctx.state.user._id;
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
