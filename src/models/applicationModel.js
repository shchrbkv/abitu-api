const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
	{
		snils: {
			type: String,
			required: [true, 'У заявления должен быть СНИЛС!'],
			match: [/^\d{3}-\d{3}-\d{3}-\d{2}/, 'Формат не поддерживается! (XXX-XXX-XXX-XX)'],
			immutable: true,
			index: true,
		},
		program: { type: mongoose.Schema.ObjectId, required: true, ref: 'Uni', immutable: true },
		way: { type: String, enum: ['main', 'direct', 'quota', 'target'], required: true },
		enrolled: { type: Boolean },
		score: {
			total: { type: Number },
			bonus: { type: Number, default: 0, min: 0, max: 10 },
			exams: { type: Map, of: { type: Number, min: 0, max: 100 }, required: true },
		},
		index: { current: { type: Number, index: -1 }, last: Number },
		consent: {
			status: { type: Boolean, default: false },
			changed: { type: Date },
		},
	},
	{ timestamps: true }
);

// applicationSchema.pre(/^find/, function (next) {
// 	this.select('-__v');
// 	next();
// });

applicationSchema.pre('insertMany', async function (next, docs) {
	const program = await mongoose.model('Program').findById(docs[0].program).lean().exec();
	if (!program) throw new mongoose.Error(`Program with ID [${docs[0].program}] does not exist`);
	for (doc of docs) {
		doc.score.total = +doc.score.bonus;
		for (score of Object.values(doc.score.exams)) doc.score.total += +score;
	}
});

applicationSchema.post('insertMany', async function (docs) {
	const program = await mongoose.model('Program').findById(docs[0].program).exec();
	for (doc of docs) {
		program.stats.status.applications.total++;
		program.stats.status.applications[doc.way]++;
	}
	program.save();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
