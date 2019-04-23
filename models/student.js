const mongoose = require('mongoose');
const User = require('./user');
const encrypt = require('../utils').encrypt;
const ROLE = require('../utils').ROLE;

const StudentSchema = new mongoose.Schema({
		email: {
			type: String,
			index: true,
			unique: true
		},
		name: String,
		surname: String,
		facultyCode: String,
		degreeProgramCode: String,
		year: Number
	},
	{
		toJSON: { virtuals: true }
	});

StudentSchema.virtual('faculty', {
	ref: 'Faculty',
	localField: 'facultyCode',
	foreignField: 'code',
	justOne: true
});

StudentSchema.virtual('degreeProgram', {
	ref: 'DegreeProgram',
	localField: 'degreeProgramCode',
	foreignField: 'code',
	justOne: true
});

StudentSchema.statics.new = (data) => {
	return new Promise((res, rej) => {
		User.findOne({email: data.email}, (er, existingUser) => {
			if (er) {
				rej(er);
				return;
			}
			
			if (existingUser && existingUser.role === ROLE.student) {
				
				existingUser.populate({path: 'pointer', model: Student}, (_err, _user) => {
					if (_err) {
						rej(_err);
						return;
					}
					res(_user);
				});
				return;
			} else if (existingUser && existingUser.role !== ROLE.student) {
				rej('USER_EXISTS');
			}
			
			const student = new Student(data);
			student.save((error, student) => {
				if (error) {
					rej(error);
				} else {
					const user = new User({
						email: student.email,
						password: encrypt(data.id),
						role: ROLE.student,
						pointer: student._id
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

const Student = module.exports = mongoose.model('Student', StudentSchema);

