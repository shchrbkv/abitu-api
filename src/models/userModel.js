const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
	role: {
		type: String,
		enum: ['abit', 'editor', 'admin'],
		default: 'abit',
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
	loginAt: Date,
	registeredAt: Date,
	passwordChangedAt: Date,
});

userSchema.methods.validatePassword = async function (password) {
	return await argon2.verify(this.password, password);
};

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await argon2.hash(this.password);
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
