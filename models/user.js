const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		index: true,
		unique: true
	},
	password: String,
	role: String,
	pointer: {type: ObjectId}
});

const User = module.exports = mongoose.model('User', UserSchema);

