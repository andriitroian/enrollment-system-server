const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const CourseworkSchema = new mongoose.Schema({
	student: {type: ObjectId, ref: 'Student'},
	teacher: {type: ObjectId, ref: 'Teacher'},
	department: String,
	degreeProgram: String,
	theme: String,
	description: String
});

const Coursework = module.exports = mongoose.model('Coursework', CourseworkSchema);

