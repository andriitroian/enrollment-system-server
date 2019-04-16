const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Teacher = require('./models/teacher');
const Supervisor = require('./models/supervisor');
const Student = require('./models/student');
const checkPassword = require('./utils').checkPassword;
const ROLE = require('./utils').ROLE;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/enrollment', {useNewUrlParser: true}, () => {
	console.log('DB connection is established');
});

router.get('/', (req, res) => {
	res.send('I\'m just an API').end();
});

router.post('/register', (req, res) => {
	const body = req.body;
	let user;
	switch (body.role) {
		case 'Teacher':
			user = new Teacher();
			break;
		case 'Supervisor':
			user = new Supervisor();
			break;
		case 'Student':
			user = new Student();
			break;
	}
	user.create(body)
		.then(user => {
			const token = getToken(user);
			res.status(200).send({token}).end();
		})
		.catch(e => {
			if (e === 'USER_EXISTS') {
				res.status(409).send('User with such email already exists').end();
			} else {
				console.error(e);
				res.status(e.code).send(e).end()
			}
		});
});

router.post('/login', (req, res) => {
	const body = req.body;
	User.findOne({email: body.email, role: body.role}, (err, user) => {
		let password;
		if (user.role === ROLE.student) {
			password = body.id;
		} else {
			password = body.password;
		}
		if (err) {
			res.send(err).end();
			return;
		}
		if (!user) {
			res.status(401).send('Invalid email').end();
			return;
		}
		if (!checkPassword(password, user.password)) {
			res.status(401).send('Invalid password').end();
			return;
		}
		user.populate({path: 'pointer', model: user.role}, (e, fullUser) => {
			if (e) {
				res.status(e.code).send(e.message).end();
				return;
			}
			const token = getToken(fullUser);
			res.status(200).send({token}).end();
		});
	})
});

const getToken = (user) => {
	const payload = { subject: user._id };
	const secretKey = 'y_andreia_krasivaia_popa';
	return jwt.sign(payload, secretKey);
};

module.exports = router;