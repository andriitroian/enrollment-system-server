const mongoose = require('mongoose');
const Faculty = require('./faculty');
const Department = require('./department');
const DegreeProgram = require('./degreeProgram');

const ObjectId = mongoose.Schema.Types.ObjectId;
const CourseworkSchema = new mongoose.Schema({
		teacher: {type: ObjectId, ref: 'Teacher'},
		facultyCode: String,
		departmentCode: String,
		degreeProgramCode: String,
		year: Number,
		theme: String,
		description: String,
		load: Number,
		complexity: Number
	},
	{
		toJSON: { virtuals: true }
	});

CourseworkSchema.statics.new = (data) => {
	const coursework = new Coursework(data);
	return coursework.save();
};

CourseworkSchema.virtual('faculty', {
	ref: 'Faculty',
	localField: 'facultyCode',
	foreignField: 'code',
	justOne: true
});

CourseworkSchema.virtual('department', {
	ref: 'Department',
	localField: 'departmentCode',
	foreignField: 'code',
	justOne: true
});

CourseworkSchema.virtual('degreeProgram', {
	ref: 'DegreeProgram',
	localField: 'degreeProgramCode',
	foreignField: 'code',
	justOne: true
});

const Coursework = module.exports = mongoose.model('Coursework', CourseworkSchema);

