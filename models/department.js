const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
	code: {
		type: String,
		index: true
	},
	faculty: String,
	name: String
});

const Department = module.exports = mongoose.model('Department', DepartmentSchema);

