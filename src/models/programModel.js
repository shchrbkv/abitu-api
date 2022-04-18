const mongoose = require('mongoose');
// const slugify = require('slugify');

const programSchema = new mongoose.Schema({
	uni: { type: mongoose.Schema.ObjectId, required: true, ref: 'Uni', index: true, immutable: true },
	okso: {
		type: String,
		required: [true, 'Программа должна иметь код ОКСО!'],
		match: [/^\d{2}.\d{2}.\d{2}/, 'Формат не поддерживается! (XX.XX.XX)'],
	},
	title: {
		type: String,
		required: [true, 'Программа должна иметь название!'],
		trim: true,
		maxlength: [100, 'Название программы не должно превышать 50 символов!'],
		minlength: [2, 'Название программы должно быть больше 2 символов!'],
	},
	website: {
		type: String,
		trim: true,
		maxlength: [256, 'Ссылка не должна превышать 256 символов!'],
		minlength: [3, 'Ссылка не может быть короче 3 символов!'],
	},
	exams: {
		type: [
			{
				type: String,
				enum: [
					'russian',
					'math',
					'mathAdv',
					'physics',
					'chemistry',
					'history',
					'socstud',
					'cs',
					'biology',
					'geography',
					'foreign',
					'essay',
					'contest',
				],
			},
		],
	},
	bonusWeight: Object,
	timeline: Object,
	stats: {
		general: {
			bound: {},
			average: { type: Number, default: 69 },
			spots: { type: Number, default: 69 },
			retention: { type: Number, default: 69 },
			peoplePerSpot: { type: Number, default: 0 },
			percentDqt: [{ type: Number, default: 0 }],
			percentEnrolled: {
				total: [{ type: Number, default: 0 }],
				consent: [{ type: Number, default: 0 }],
			},
		},
		analytics: {},
		status: {
			applications: {
				total: { type: Number, default: 0 },
				main: { type: Number, default: 0 },
				direct: { type: Number, default: 0 },
				quota: { type: Number, default: 0 },
				target: { type: Number, default: 0 },
			},
			applicationsLast: { type: Number, default: 0 },
			progress: { type: Number, default: 69 },
			daysLeft: { type: Number, default: 69 },
			graphs: {
				activity: {
					current: [{ type: Number, default: 0 }],
					base: [{ type: Number, default: 0 }],
				},
				total: {
					current: [{ type: Number, default: 0 }],
					base: [{ type: Number, default: 0 }],
				},
			},
		},
	},
});

programSchema.methods.clearApplications = async function () {
	await mongoose.model('Application').deleteMany({ program: this._id });
};

// programSchema.pre(/^find/, function (next) {
// 	this.select('-__v');
// 	next();
// });

programSchema.pre('save', async function (next) {
	if (this.uni) {
		const uni = await mongoose.model('Uni').findById(this.uni).lean().exec();
		if (!uni) throw new mongoose.Error(`Uni with ID [${this.uni}] does not exist`);
		this.timeline = uni.timeline;
		this.bonusWeight = uni.bonusWeight;
	}
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
