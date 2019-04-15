const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const EnrollmentRequestSchema = new mongoose.Schema({
	student: {type: ObjectId, ref: 'Student'},
	teacher: {type: ObjectId, ref: 'Teacher'},
	coursework: {type: ObjectId, ref: 'Coursework'},
	approved: Boolean
});

const EnrollmentRequest = module.exports = mongoose.model('EnrollmentRequest', EnrollmentRequestSchema);

