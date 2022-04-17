const mongoose = require('mongoose');
// const slugify = require('slugify');

const uniSchema = new mongoose.Schema(
	{
		slug: String,
		title: {
			type: String,
			required: [true, 'ВУЗ должен иметь краткое название!'],
			unique: true,
			trim: true,
			maxlength: [50, 'Краткое название ВУЗа не должно превышать 50 символов!'],
			minlength: [2, 'Краткое название ВУЗа должно быть больше 2 символов!'],
		},
		titleFull: {
			type: String,
			required: [true, 'ВУЗ должен иметь полное название!'],
			trim: true,
			maxlength: [256, 'Полное название ВУЗа не должно превышать 256 символов!'],
			minlength: [10, 'Полное название ВУЗа должно быть больше 10 символов!'],
		},
		city: {
			type: String,
			required: [true, 'ВУЗ должен иметь город'],
			enum: ['spb', 'mow'],
		},
		website: {
			type: String,
			trim: true,
			maxlength: [256, 'Ссылка не должна превышать 256 символов!'],
			minlength: [3, 'Ссылка не может быть короче 3 символов!'],
		},
		rating: {
			type: Number,
		},
		specsMax: {
			type: Number,
			required: [true, 'ВУЗ должен иметь ограничение по специальностям!'],
			min: [1, 'Специальностей не может быть меньше одной!'],
			max: [10, 'Специальностей не может быть больше десяти!'],
		},
		amenities: {
			dorm: { type: Boolean, required: true },
			state: { type: Boolean, required: true },
			military: { type: Boolean, required: true },
		},
		bonusWeight: {
			gto: { type: Number, required: true },
			medal: { type: Number, required: true },
			portfolio: { type: Number, required: true },
			essay: { type: Number, required: true },
			spo: { type: Number, required: true },
			volunteer: { type: Number, required: true },
		},
		timeline: {
			docsStart: { type: Date, required: true },
			docsContest: { type: Date },
			docsHouse: { type: Date },
			docsMain: { type: Date, required: true },
			lists: { type: Date, required: true },
			appTarget: { type: Date },
			appMain: { type: Date, required: true },
			enrolTarget: { type: Date },
			enrolMain: { type: Date, required: true },
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		id: false,
	}
);

uniSchema.virtual('programs', {
	ref: 'Program',
	localField: '_id',
	foreignField: 'uni',
});

uniSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

uniSchema.pre('findOneAndDelete', async function (next) {
	// Delete all associated programs
	const id = this._conditions._id;
	await mongoose.model('Program').deleteMany({ uni: id });
	next();
});

const Uni = mongoose.model('Uni', uniSchema);

module.exports = Uni;
