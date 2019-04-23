const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Teacher = require('./models/teacher');
const Supervisor = require('./models/supervisor');
const Student = require('./models/student');
const Coursework = require('./models/coursework');
const Faculty = require('./models/faculty');
const Department = require('./models/department');
const DegreeProgram = require('./models/degreeProgram');
const EnrollmentRequest = require('./models/enrollmentRequest');
const {checkPassword, ROLE, decryptToken, getToken, encrypt} = require('./utils');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/enrollment', {useNewUrlParser: true}, () => {
	console.log('DB connection is established');
});

const verifyToken = (req, res, next) => {
	if (!req.headers.authorization) {
		res.status(401).send('Unauthorized request').end();
		return;
	}
	const token = req.headers.authorization.split(' ').pop();
	if (!token || token === 'null' || token === 'undefined') {
		res.status(401).send('Unauthorized request').end();
		return;
	}
	const payload = decryptToken(token);
	if (!payload) {
		res.status(401).send('Unauthorized request').end();
		return;
	}
	User.findOne({ _id: payload.subject })
		.then(u => {
			if (!u) {
				throw Error('UNAUTHORIZED');
			}
			const populateField = u.role === ROLE.student ? 'degreeProgram' : 'department';
			return u.populate({
				path: 'pointer',
				model: u.role,
				populate: [
					{path: 'faculty'},
					{path: populateField}
				]
			}).execPopulate()
		})
		.then(u => {
			req.user = u;
			next();
		})
		.catch(e => {
			console.error(e);
			res.status(401).send('Unauthorized request').end();
		})
};

router.get('/', (req, res) => {
	res.send('I\'m just an API').end();
});

router.post('/register', (req, res) => {
	const body = req.body;
	USER_MODEL[body.role].new(body)
		.then(user => {
			const token = getToken(user);
			res.status(200).send({token}).end();
		})
		.catch(e => {
			if (e === 'USER_EXISTS') {
				res.status(409).send('User with such email already exists').end();
			} else {
				console.error(e);
				res.status(e.status).send(e).end()
			}
		});
});

router.post('/login', (req, res) => {
	const body = req.body;
	User.findOne({email: body.email, role: body.role}, (err, user) => {
		if (!user) {
			res.status(404).send('User with such email doesn\'t exist').end();
			return;
		}
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
				res.status(e.status).send(e.message).end();
				return;
			}
			const token = getToken(fullUser);
			res.status(200).send({token}).end();
		});
	})
});

router.get('/courseworks', verifyToken, (req, res) => {
	const user = req.user;
	const teacherId = req.query.teacherId;
	const query = {};
	
	if (teacherId !== 'undefined' && teacherId !== 'null') {
		query.teacher = teacherId;
	} else {
		if (user.role === ROLE.student) {
			if (user.pointer.facultyCode) { query.facultyCode = user.pointer.facultyCode }
			if (user.pointer.degreeProgramCode) { query.degreeProgramCode = user.pointer.degreeProgramCode }
			if (user.pointer.year) { query.year = user.pointer.year }
		}
		
		if (user.role === ROLE.teacher) {
			query.teacher = user.pointer._id;
		}
	}
	
	Coursework
		.find(query)
		.populate('teacher')
		.populate('faculty')
		.populate('department')
		.populate('degreeProgram')
		.exec()
		.then(result => res.status(200).send(result).end())
		.catch(e => {
			console.error(e);
			res.status(500).send('Server Error').end();
		});
});

router.get('/coursework', verifyToken, (req, res) => {
	const courseworkId = req.query.id;
	
	if (!courseworkId) {
		res.status(404).send('Coursework not found').end();
		return;
	}
	
	Coursework
		.findOne({_id: courseworkId})
		.populate('teacher')
		.populate('faculty')
		.populate('department')
		.populate('degreeProgram')
		.exec()
		.then(result => {
			if (!result) {
				res.status(404).send('Coursework not found').end();
				return;
			}
			res.status(200).send(result).end()
		})
		.catch(e => {
			res.status(404).send('Coursework not found').end();
		});
});

router.get('/myEnrollments', verifyToken, (req, res) => {
	const user = req.user;
	
	if (user.role === ROLE.supervisor) {
		res.status(403).send('Only teachers and students has access to their enrollments').end();
		return;
	}
	
	const query = {};
	
	if (user.role === ROLE.teacher) {
		query.teacher = user.pointer._id;
	}
	
	if (user.role === ROLE.student) {
		query.student = user.pointer._id;
	}
	
	return EnrollmentRequest.find(query)
		.populate({
			path: 'coursework',
			populate: [
				{path: 'faculty'},
				{path: 'department'},
				{path: 'degreeProgram'},
				{path: 'teacher'}
			]
		})
		.populate({
			path: 'student',
			populate: [
				{path: 'faculty'},
				{path: 'degreeProgram'}
			]
		})
		.populate('teacher')
		.select('coursework student approved expired teacher')
		.exec()
		.then(requests => {
			res.status(200).send(requests).end();
		});
});

router.post('/cancelEnrollmentRequest', verifyToken, (req, res) => {
	const data = req.body;
	const user = req.user;
	const student = user.pointer;
	
	if (user.role !== ROLE.student) {
		res.status(403).send('Only student can cancel request').end();
		return;
	}
	
	EnrollmentRequest.deleteMany({student: student._id, coursework: data.coursework, approved: false, expired: false})
		.then(() => {
			res.status(200).send().end();
		})
		.catch(e => {
			res.status(e.status).send(e.message).end();
		})
});

router.post('/enroll', verifyToken, (req, res) => {
	const user = req.user;
	const student = user.pointer;
	const data = req.body;
	
	if (user.role !== ROLE.student) {
		res.status(403).send('Only students can enroll to coursework').end();
		return;
	}
	
	const payload = {
		expired: false,
		approved: false,
		teacher: data.teacher,
		student: student._id,
		coursework: data.coursework
	};
	
	EnrollmentRequest.findOne({$or: [
			{approved: true, student: student._id},
			{student: student._id, coursework: data.coursework}
		]})
		.then(request => {
			if (request) {
				res.status(403).send('You\'ve been already approved to another coursework or you\'ve already applied to this one').end();
				throw Error('STUDENT_APPROVED');
			}
			return EnrollmentRequest.new(payload);
		})
		.then(request => {
			res.status(200).send(request).end();
		})
		.catch(e => {
			console.error(e);
			if (e.message === 'STUDENT_APPROVED') {
				res.status(403).send('You\'ve been already approved to another coursework').end();
			}
		});
});

router.post('/accept', verifyToken, (req, res) => {
	const user = req.user;
	const teacher = user.pointer;
	const data = req.body;
	
	if (user.role !== ROLE.teacher) {
		res.status(403).send('Only teachers can accept/reject requests').end();
		return;
	}
	
	EnrollmentRequest.findOne({student: data.studentId, approved: true})
		.then(request => {
			if (request) {
				res.status(403).send('Student has been already approved').end();
				throw Error('STUDENT_APPROVED');
			}
			return EnrollmentRequest.updateMany(
				{ $or: [
						{student: data.studentId, coursework: {$ne: data.courseworkId}},
						{coursework: data.courseworkId, student: {$ne: data.studentId}}
					]}, {expired: true});
		})
		.then(() => {
			return EnrollmentRequest.findOne({student: data.studentId, coursework: data.courseworkId})
				.populate('coursework')
				.exec();
		})
		.then(request => {
			if (!request) {
				res.status(404).send('Enrollment request was not found').end();
				throw Error('REQUEST_NOT_FOUND');
			}
			request.approved = true;
			request.expired = true;
			teacher.load += request.coursework.load;
			return request.save();
		})
		.then(() => teacher.save())
		.then(() => {
			res.status(200).send().end();
		})
		.catch(e => {
			if (e.message === 'STUDENT_APPROVED') { return; }
			if (e.message === 'REQUEST_NOT_FOUND') { return; }
			console.error(e);
		})
	
});

router.post('/reject', verifyToken, (req, res) => {
	const user = req.user;
	const data = req.body;
	
	if (user.role !== ROLE.teacher) {
		res.status(403).send('Only teachers can accept/reject requests').end();
		return;
	}
	
	EnrollmentRequest.findOne({student: data.studentId, coursework: data.courseworkId})
		.then(request => {
			if (!request) {
				res.status(404).send('Enrollment request was not found').end();
				throw Error('REQUEST_NOT_FOUND');
			}
			request.approved = false;
			request.expired = true;
			return request.save();
		})
		.then(() => {
			res.status(200).send().end();
		})
		.catch(e => {
			if (e.message === 'REQUEST_NOT_FOUND') { return; }
			console.error(e);
		})
});

router.get('/me', verifyToken, (req, res) => {
	res.status(200).send(req.user.pointer).end();
});

router.post('/updateProfile', verifyToken, (req, res) => {
	const user = req.user;
	const data = req.body;
	const userPayload = {};
	if (data.oldPassword && data.newPassword && data.newPasswordConfirm) {
		if (data.newPassword !== data.newPasswordConfirm) {
			res.status(403).send('Password mismatch').end();
			return;
		}
		if (!checkPassword(data.oldPassword, user.password)) {
			res.status(403).send('Wrong password').end();
			return;
		}
		userPayload.password = encrypt(data.newPassword);
	}
	USER_MODEL[user.role].findByIdAndUpdate(user.pointer._id, data)
		.then(_ => {
			if (data.email) {
				return User.findByIdAndUpdate(user._id, userPayload);
			}
		})
		.then(() => {
			return User.findOne(user._id)
				.populate({path: 'pointer', model: user.role})
				.exec()
		})
		.then(user => res.status(200).send(user.pointer).end())
		.catch(e => {
			console.error(e);
			res.status(500).send('Unable to modify user').end();
		})
});

router.post('/updateCoursework', verifyToken, (req, res) => {
	const user = req.user;
	const teacher = user.pointer;
	const data = req.body;
	let updateTeachersLoad = false;
	let updatedCoursework;
	
	const payload = {
		degreeProgramCode: data.degreeProgramCode,
		year: data.year,
		theme: data.theme,
		description: data.description,
		load: data.load,
		complexity: data.complexity
	};
	
	if (user.role !== ROLE.teacher) {
		res.status(403).send('Only teachers can modify courseworks').end();
		return;
	}
	
	EnrollmentRequest.findOne({teacher: teacher._id, coursework: data.id, approved: true})
		.populate('coursework')
		.exec()
		.then(r => {
			if (r) {
				teacher.load -= r.coursework.load;
				updateTeachersLoad = true;
			}
			return Coursework.findByIdAndUpdate(data.id, payload);
		})
		.then(() => {
			return Coursework.findOne({_id: data.id})
				.populate('teacher')
				.populate('faculty')
				.populate('department')
				.populate('degreeProgram')
				.exec();
		})
		.then(c => {
			updatedCoursework = c;
			if (updateTeachersLoad) {
				teacher.load += c.load;
			}
			return teacher.save();
		})
		.then(() => {
			res.status(200).send(updatedCoursework).end();
		});
});

router.post('/deleteCoursework', verifyToken, (req, res) => {
	const user = req.user;
	const courseworkId = req.body.courseworkId;
	
	if (user.role !== ROLE.teacher) {
		res.status(403).send('Only teacher can delete coursework').end();
		return;
	}
	
	EnrollmentRequest.findOne({coursework: courseworkId, approved: true})
		.then(request => {
			if (request) {
				res.status(403).send('This coursework is already taken').end();
				throw Error('COURSEWORK_TAKEN');
			}
			return EnrollmentRequest.deleteMany({coursework: courseworkId});
		})
		.then(() => Coursework.findByIdAndDelete(courseworkId))
		.then(() => {
			res.status(200).send().end();
		})
		.catch(e => {
			if (e.message === 'COURSEWORK_TAKEN') { return; }
		})
});

router.post('/createCoursework', verifyToken, (req, res) => {
	const user = req.user;
	const teacher = user.pointer;
	const data = req.body;
	
	const payload = {
		degreeProgramCode: data.degreeProgramCode,
		year: data.year,
		theme: data.theme,
		description: data.description,
		load: data.load,
		complexity: data.complexity,
		teacher: teacher._id,
		facultyCode: teacher.facultyCode,
		departmentCode: teacher.departmentCode
	};
	
	if (user.role !== ROLE.teacher) {
		res.status(403).send('Only teachers can create courseworks').end();
		return;
	}
	
	Coursework.new(payload)
		.then(c => {
			res.status(200).send(c).end();
		});
});

router.get('/teachers', verifyToken, (req, res) => {
	const user = req.user.pointer;
	const query = {};
	
	if (user.facultyCode) { query.facultyCode = user.facultyCode; }
	if (user.departmentCode) { query.departmentCode = user.departmentCode; }
	
	Teacher.find(query)
		.populate('faculty')
		.populate('department')
		.exec()
		.then(teachers => {
			res.status(200).send(teachers).end();
		})
});

router.get('/teacher', verifyToken, (req, res) => {
	const id = req.query.id;
	
	if (!id) {
		res.status(403).send('Teacher\'s ID can not be empty').end();
		return;
	}
	
	Teacher.findOne({_id: id})
		.populate('faculty')
		.populate('department')
		.exec()
		.then(teacher => {
			res.status(200).send(teacher).end();
		})
		.catch(e => {
			console.error(e);
			res.status(500).send('Server Error').end();
		})
});

router.post('/addTeacher', verifyToken, (req, res) => {
	const user = req.user;
	const supervisor = user.pointer;
	const data = req.body;
	
	if (user.role !== ROLE.supervisor) {
		res.status(403).send('Only supervisors can add teachers').end();
		return;
	}
	
	const payload = {
		email: data.email,
		name: data.name,
		surname: data.surname,
		facultyCode: supervisor.faculty.code,
		departmentCode: supervisor.department.code,
		load: data.load,
		password: data.password,
	};
	
	Teacher.findOne({email: data.email})
		.then(t => {
			if (t) {
				throw Error('TEACHER_EXISTS');
			}
			return Teacher.new(payload);
		})
		.then(t => {
			res.status(200).send(t).end();
		})
		.catch(e => {
			console.error(e);
			if (e.message === 'TEACHER_EXISTS') {
				res.status(409).send('Teacher with such email already exists').end();
				return;
			}
			res.status(500).send('Server Error').end();
		})
});

router.post('/updateTeacher', verifyToken, (req, res) => {
	const user = req.user;
	const data = req.body;
	
	if (user.role !== ROLE.supervisor) {
		res.status(403).send('Only supervisors can update teachers').end();
		return;
	}
	
	const payload = {
		name: data.name,
		surname: data.surname,
		load: data.load,
	};
	
	Teacher.findByIdAndUpdate(data.teacherId, payload)
		.select('name surname load facultyCode departmentCode')
		.then(t => {
			res.status(200).send(t).end();
		})
		.catch(e => {
			res.status(500).send('Server Error').end();
		})
});

router.post('/deleteTeacher', verifyToken, (req, res) => {
	const user = req.user;
	const teacherId = req.body.teacherId;
	
	if (user.role !== ROLE.supervisor) {
		res.status(403).send('Only supervisors can update teachers').end();
		return;
	}
	
	EnrollmentRequest.findOne({teacher: teacherId, approved: true})
		.then(r => {
			if (r) {
				throw Error('TEACHER_APPROVED');
			}
			return EnrollmentRequest.deleteMany({teacher: teacherId});
		})
		.then(() => {
			return Coursework.deleteMany({teacher: teacherId});
		})
		.then(() => {
			return User.deleteMany({pointer: teacherId});
		})
		.then(() => {
			return Teacher.findByIdAndDelete(teacherId);
		})
		.then(() => {
			res.status(200).send().end();
		})
		.catch(e => {
			console.error(e);
			if (e.message === 'TEACHER_APPROVED') {
				res.status(403).send('This teacher has already approved coursework').end();
				return;
			}
			res.status(500).send('Server Error').end();
		})
	
});

const USER_MODEL = {
	Student,
	Supervisor,
	Teacher
};

module.exports = router;