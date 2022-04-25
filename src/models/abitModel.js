const mongoose = require('mongoose');

const abitSchema = new mongoose.Schema(
	{
		snils: {
			type: String,
			unique: true,
			required: [true, 'Абитуриент должен иметь СНИЛС!'],
			match: [/^\d{3}-\d{3}-\d{3}-\d{2}/, 'Формат не поддерживается! (XXX-XXX-XXX-XX)'],
		},
		score: {
			total: { type: Number },
			bonus: { type: Number, default: 0, min: 0, max: 10 },
			exams: { type: Map, of: { type: Number, min: 0, max: 100 } },
		},
		priority: [{ type: mongoose.Schema.ObjectId, ref: 'Program' }],
		applications: [{ type: mongoose.Schema.ObjectId, ref: 'Application' }],
	},
	{ timestamps: true }
);

abitSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

const Abit = mongoose.model('Abit', abitSchema);

module.exports = Abit;
