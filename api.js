const express = require('express');
const router = express.Router();
const Teacher = require('./models/teacher');
const Supervisor = require('./models/supervisor');
const Student = require('./models/student');

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
			res.status(200).send(user).end();
		})
		.catch(e => {
			if (e === 'USER_EXISTS') {
				res.status(500).send(new Error('User with such email already exists')).end();
			} else {
				console.error(e);
			}
		});
});

router.post('/login', (req, res) => {

});



module.exports = router;