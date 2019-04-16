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
	name: {
		type: String
	},
	surname: {
		type: String
	},
	faculty: {
		type: String
	},
	department: {
		type: String
	}
});

TeacherSchema.methods.create = (data) => {
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
					user.populate({
						path: 'pointer',
						model: Teacher
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

const Teacher = module.exports = mongoose.model('Teacher', TeacherSchema);

