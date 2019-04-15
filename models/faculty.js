const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
	code: {
		type: String,
		index: true
	},
	name: String
});

const Faculty = module.exports = mongoose.model('Faculty', FacultySchema);



