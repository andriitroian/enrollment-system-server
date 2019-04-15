const mongoose = require('mongoose');

const DegreeProgramSchema = new mongoose.Schema({
	code: {
		type: String,
		index: true
	},
	faculty: String,
	name: String
});

const DegreeProgram = module.exports = mongoose.model('DegreeProgram', DegreeProgramSchema);

