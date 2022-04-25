const mongoose = require('mongoose');
const argon2 = require('argon2');
const config = require('../config');

const userSchema = new mongoose.Schema({
	role: {
		type: String,
		enum: config.roles,
		default: config.roles[0],
	},
	email: {
		type: String,
		required: [true, 'Please provide your email'],
		unique: true,
		lowercase: true,
		// validate: [validator.isEmail, 'Please provide a valid email']
	},
	password: {
		type: String,
		required: [true, 'Требуется пароль!'],
		minlength: 8,
		select: false,
	},
	refreshToken: { type: String, select: false },
	loginAt: { type: Date, select: false },
	registeredAt: { type: Date, select: false },
	passwordChangedAt: { type: Date, select: false },
	// Role-specific
	watchlist: [{ type: mongoose.Schema.ObjectId, ref: 'Abit' }],
});

userSchema.methods.validatePassword = async function (password) {
	return argon2.verify(this.password, password);
};

userSchema.pre(/^find/, function (next) {
	this.select('-__v');
	next();
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await argon2.hash(this.password);
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
