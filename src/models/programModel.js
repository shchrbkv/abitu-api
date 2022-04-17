const mongoose = require('mongoose');
// const slugify = require('slugify');

const programSchema = new mongoose.Schema({
	uni: { type: mongoose.Schema.ObjectId, required: true, ref: 'Uni' },
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
		bound: { type: Number, default: 69 },
		average: { type: Number, default: 69 },
		spots: { type: Number, default: 69 },
		retention: { type: Number, default: 69 },
	},
});

programSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

programSchema.pre('save', async function (next) {
	const uni = await mongoose.model('Uni').findById(this.uni).exec();
	this.timeline = uni.timeline;
	this.bonusWeight = uni.bonusWeight;
	next();
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
