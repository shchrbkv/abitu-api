const { ObjectId } = require('mongoose').Types;

exports.toCondition = (object) => {
	const operators = {};
	for (op of Object.keys(object)) {
		operators[`$${op}`] = Number(object[op]);
	}
	return operators;
};

exports.castSort = (string) => {
	let dir = 1;
	if (string[0] === '-') {
		string = string.substr(1);
		dir = -1;
	}
	return { [string]: dir };
};

exports.castNumber = (value) => Number(value);

exports.castBoolean = (value) => value === 'true';

exports.toArray = (string, caster) => {
	const array = string.split(',');
	if (caster) array.map(caster);
	return array;
};

exports.asIn = (array) => ({ $in: array });

exports.asAll = (array) => ({ $all: array });

exports.asOr = (array) => ({ $or: array });

exports.asPush = (array) => ({ $push: array });

exports.castPage = (page = 1, limit = 100) => ({ skip: (+page - 1) * +limit, limit: +limit });

exports.toNeighbors = (sortMode, sortDir, lastVal, lastId) => [
	{ [sortMode]: { [sortDir]: lastVal } },
	{ [sortMode]: lastVal, _id: { [sortDir]: lastId } },
];

exports.toObjectId = (val) => ObjectId(val);
