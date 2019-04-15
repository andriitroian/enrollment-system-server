const mongoose = require('mongoose');
const User = require('./user');

const StudentSchema = new mongoose.Schema({
	email: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	name: {
		type: String
	},
	surname: {
		type: String
	},
	faculty: {
		type: String
	},
	degreeProgram: {
		type: String
	},
	year: {
		type: Number
	}
});

StudentSchema.methods.create = (data) => {
	return new Promise((res, rej) => {
		Student.findOne({email: data.email}, (er, existingStudent) => {
			if (er) {
				rej(er);
				return;
			}
			
			if (existingStudent) {
				User.findOne({pointer: existingStudent._id}, (e, u) => {
					if (e) {
						rej(e);
						return;
					}
					u.populate({path: 'pointer', model: Student}, (_err, _user) => {
						if (_err) {
							rej(_err);
							return;
						}
						res(_user);
					})
				});
				return;
			}
			
			const student = new Student(data);
			student.save((error, student) => {
				if (error) {
					rej(error);
				} else {
					const user = new User({
						email: student.email,
						password: student.password,
						role: 'Student',
						pointer: student._id
					});
					user.populate({
						path: 'pointer',
						model: Student
					}, (_err, _user) => {
						if (_err) {
							rej(_err);
							return;
						}
						_user.save((err, user) => {
							if (err) {
								rej(err);
							} else {
								res(user);
							}
						});
					});
				}
			});
		});
	});
};

const Student = module.exports = mongoose.model('Student', StudentSchema);

