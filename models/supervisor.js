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

SupervisorSchema.methods.create = (data) => {
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
					user.populate({
						path: 'pointer',
						model: Supervisor
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

const Supervisor = module.exports = mongoose.model('Supervisor', SupervisorSchema);

