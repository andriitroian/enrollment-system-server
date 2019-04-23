const mongoose = require('mongoose');
const User = require('./user');
const encrypt = require('../utils').encrypt;
const ROLE = require('../utils').ROLE;

const TeacherSchema = new mongoose.Schema({
		email: {
			type: String,
			index: true,
			unique: true
		},
		name: String,
		surname: String,
		facultyCode: String,
		departmentCode: String,
		load: Number
	},
	{
		toJSON: { virtuals: true }
	});

TeacherSchema.virtual('faculty', {
	ref: 'Faculty',
	localField: 'facultyCode',
	foreignField: 'code',
	justOne: true
});

TeacherSchema.virtual('department', {
	ref: 'Department',
	localField: 'departmentCode',
	foreignField: 'code',
	justOne: true
});

TeacherSchema.statics.new = (data) => {
	return new Promise((res, rej) => {
		User.findOne({email: data.email}, (er, existingTeacher) => {
			if (er) {
				rej(er);
				return;
			}
			
			if (existingTeacher) {
				rej('USER_EXISTS');
				return;
			}
			
			const teacher = new Teacher(data);
			teacher.save((error, teacher) => {
				if (error) {
					rej(error);
				} else {
					const user = new User({
						email: teacher.email,
						password: encrypt(data.password),
						role: ROLE.teacher,
						pointer: teacher._id
					});
					user.save((err, user) => {
						if (err) {
							rej(err);
						} else {
							res(user);
						}
					});
				}
			});
		});
	});
};

const Teacher = module.exports = mongoose.model('Teacher', TeacherSchema);

