const mongoose = require('mongoose');
const User = require('./user');
const encrypt = require('../utils').encrypt;
const ROLE = require('../utils').ROLE;

const SupervisorSchema = new mongoose.Schema({
		email: {
			type: String,
			index: true,
			unique: true
		},
		name: String,
		surname: String,
		facultyCode: String,
		departmentCode: String
	},
	{
		toJSON: { virtuals: true }
	});

SupervisorSchema.virtual('faculty', {
	ref: 'Faculty',
	localField: 'facultyCode',
	foreignField: 'code',
	justOne: true
});

SupervisorSchema.virtual('department', {
	ref: 'Department',
	localField: 'departmentCode',
	foreignField: 'code',
	justOne: true
});

SupervisorSchema.statics.new = (data) => {
	return new Promise((res, rej) => {
		User.findOne({email: data.email}, (er, existingSupervisor) => {
			if (er) {
				rej(er);
				return;
			}
			
			if (existingSupervisor) {
				rej('USER_EXISTS');
				return;
			}
			
			const supervisor = new Supervisor(data);
			supervisor.save((error, supervisor) => {
				if (error) {
					rej(error);
				} else {
					const user = new User({
						email: supervisor.email,
						password: encrypt(data.password),
						role: ROLE.supervisor,
						pointer: supervisor._id
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

const Supervisor = module.exports = mongoose.model('Supervisor', SupervisorSchema);

