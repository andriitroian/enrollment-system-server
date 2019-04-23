const mongoose = require('mongoose');

const Teacher = require('./models/teacher');
const Supervisor = require('./models/supervisor');
const Student = require('./models/student');
const Coursework = require('./models/coursework');
const DegreeProgram = require('./models/degreeProgram');
const Department = require('./models/department');
const Faculty = require('./models/faculty');

mongoose.connect('mongodb://localhost:27017/enrollment', {useNewUrlParser: true})
	.then( () => mongoose.connection.db.dropDatabase())
	.then(() => {
		const promises = [];
		
		const faculties = [
			{code: 'fh', name: 'Faculty of Humanities'},
			{code: 'fe', name: 'Faculty of Economics'},
			{code: 'fcs', name: 'Faculty of Computer Sciences'},
			{code: 'fl', name: 'Faculty of Law'},
			{code: 'fns', name: 'Faculty of Natural Sciences'},
			{code: 'fssst', name: 'Faculty of Social Sciences and Social Technologies'}
		];
		
		const degreePrograms = [
			{code: '034', name: 'Cultural Studies', facultyCode: 'fh'},
			{code: '033', name: 'Philosophy', facultyCode: 'fh'},
			{code: '032', name: 'History and Archeology', facultyCode: 'fh'},
			{code: '035.01', name: 'Philology: Language, Literature and Comparative Studies', facultyCode: 'fh'},
			{code: '035.04', name: 'Philology: English and Ukrainian Languages', facultyCode: 'fh'},
			
			{code: '051', name: 'Economics', facultyCode: 'fe'},
			{code: '073', name: 'Management', facultyCode: 'fe'},
			{code: '075', name: 'Marketing', facultyCode: 'fe'},
			{code: '072', name: 'Finance, Banking and Insurance', facultyCode: 'fe'},
			
			{code: '113', name: 'Applied Mathematics', facultyCode: 'fcs'},
			{code: '122', name: 'Computer Sciences', facultyCode: 'fcs'},
			{code: '121', name: 'Software Engineering', facultyCode: 'fcs'},
			
			{code: '081', name: 'Law', facultyCode: 'fl'},
			
			{code: '102', name: 'Chemistry', facultyCode: 'fns'},
			{code: '091', name: 'Biology and Biotechnology', facultyCode: 'fns'},
			{code: '101', name: 'Environmental Studies', facultyCode: 'fns'},
			{code: '104', name: 'Physics and Astronomy', facultyCode: 'fns'},
			
			{code: '054', name: 'Sociology', facultyCode: 'fssst'},
			{code: '052', name: 'Political Science', facultyCode: 'fssst'},
			{code: '231', name: 'Social Work', facultyCode: 'fssst'},
			{code: '053', name: 'Psychology', facultyCode: 'fssst'},
			{code: '055', name: 'International Relations, Social Communications and Regional Studies', facultyCode: 'fssst'},
		];
		
		const departments = [
			{code: 'fcs-cs', name: 'Computer Sciences', facultyCode: 'fcs'},
			{code: 'fcs-m', name: 'Mathematics', facultyCode: 'fcs'},
			{code: 'fcs-ms', name: 'Multimedia Systems', facultyCode: 'fcs'},
			{code: 'fcs-nt', name: 'Network Technologies', facultyCode: 'fcs'},
			
			{code: 'fh-cs', name: 'Cultural Studies', facultyCode: 'fh'},
			{code: 'fh-el', name: 'English Language', facultyCode: 'fh'},
			{code: 'fh-gsl', name: 'General and Slavic Linguistics', facultyCode: 'fh'},
			{code: 'fh-h', name: 'History', facultyCode: 'fh'},
			{code: 'fh-l', name: 'Literature', facultyCode: 'fh'},
			{code: 'fh-prs', name: 'Philosophy and Religious Studies', facultyCode: 'fh'},
			{code: 'fh-ul', name: 'Ukrainian Language', facultyCode: 'fh'},
			
			{code: 'fe-et', name: 'Economic Theory', facultyCode: 'fe'},
			{code: 'fe-f', name: 'Finance', facultyCode: 'fe'},
			{code: 'fe-mbm', name: 'Marketing and Business Management', facultyCode: 'fe'},
			
			{code: 'fl-als', name: 'Applied Legal Studies', facultyCode: 'fl'},
			{code: 'fl-lc', name: 'Experimental educational laboratory "Law clinic"', facultyCode: 'fl'},
			{code: 'fl-iel', name: 'International and European Law', facultyCode: 'fl'},
			{code: 'fl-lpcl', name: 'Legal Philosophy and Constitutional Law', facultyCode: 'fl'},
			{code: 'fl-eul', name: 'Jean Monnet Chair in European Union Law', facultyCode: 'fl'},
			
			{code: 'fns-b', name: 'Biology', facultyCode: 'fns'},
			{code: 'fns-c', name: 'Chemistry', facultyCode: 'fns'},
			{code: 'fns-es', name: 'Environmental Studies', facultyCode: 'fns'},
			{code: 'fns-ldbs', name: 'Laboratory diagnostics of biological system', facultyCode: 'fns'},
			{code: 'fns-pm', name: 'Physics and Mathematics', facultyCode: 'fns'},
			{code: 'fns-pe', name: 'Physical Education', facultyCode: 'fns'},
			
			{code: 'fssst-ps', name: 'Political Science', facultyCode: 'fssst'},
			{code: 'fssst-prs', name: 'PR Studies', facultyCode: 'fssst'},
			{code: 'fssst-pp', name: 'Psychology and Pedagogics', facultyCode: 'fssst'},
			{code: 'fssst-s', name: 'Sociology', facultyCode: 'fssst'},
			{code: 'fssst-j', name: 'Kyiv-Mohyla School of Journalism', facultyCode: 'fssst'},
			{code: 'fssst-sph', name: 'School of Public Health', facultyCode: 'fssst'},
			{code: 'fssst-sw', name: 'Volodymyr Poltavets School of Social Work', facultyCode: 'fssst'},
		];
		
		const supervisors = [
			{departmentCode: 'fcs-cs', facultyCode: 'fcs', email: 'cs-admin@ukma.edu.ua', password: 'Admin', name: 'Supervisor', midName: '', surname: ''},
			{departmentCode: 'fcs-m', facultyCode: 'fcs', email: 'm-admin@ukma.edu.ua', password: 'Admin', name: 'Supervisor', midName: '', surname: ''},
			{departmentCode: 'fcs-ms', facultyCode: 'fcs', email: 'ms-admin@ukma.edu.ua', password: 'Admin', name: 'Supervisor', midName: '', surname: ''},
			{departmentCode: 'fcs-nt', facultyCode: 'fcs', email: 'nt-admin@ukma.edu.ua', password: 'Admin', name: 'Supervisor', midName: '', surname: ''},
		];
		
		const teachers = [
			{departmentCode: 'fcs-cs', facultyCode: 'fcs', email: 'obuchko@gmail.com', password: 'qwerty', name: 'Olena', midName: 'Andriivna', surname: 'Buchko', load: 18},
			{departmentCode: 'fcs-cs', facultyCode: 'fcs', email: 'gulayeva@ukma.edu.ua', password: 'qwerty', name: 'Natalia', midName: 'Mykhailivna', surname: 'Gulaeva', load: 16},
			{departmentCode: 'fcs-cs', facultyCode: 'fcs', email: 'procukvs@gmail.com', password: 'qwerty', name: 'Volodymyr', midName: 'Semenovych', surname: 'Protsenko', load: 20},
			{departmentCode: 'fcs-m', facultyCode: 'fcs', email: 'mbratyk@ukr.net', password: 'qwerty', name: 'Mykhailo', midName: 'Vasyliovych', surname: 'Bratyk', load: 31},
			{departmentCode: 'fcs-m', facultyCode: 'fcs', email: 'sdiachenko@ukma.edu.ua', password: 'qwerty', name: 'Serhii', midName: 'Mykolaiovych', surname: 'Diachenko', load: 12},
			{departmentCode: 'fcs-m', facultyCode: 'fcs', email: 'oliynyk@ukma.edu.ua', password: 'qwerty', name: 'Bogdana', midName: 'Vitaliivna', surname: 'Oliinyk', load: 9},
			{departmentCode: 'fcs-ms', facultyCode: 'fcs', email: 'afonin@ukma.edu.ua', password: 'qwerty', name: 'Andrii', midName: 'Oleksandrovych', surname: 'Afonin', load: 13},
			{departmentCode: 'fcs-ms', facultyCode: 'fcs', email: 'oletsky@ukma.edu.ua', password: 'qwerty', name: 'Oleksii', midName: 'Vitaliovych', surname: 'Oletsky', load: 33},
			{departmentCode: 'fcs-ms', facultyCode: 'fcs', email: 'slavon07@gmail.com', password: 'qwerty', name: 'Viacheslav', midName: 'Viktorovych', surname: 'Horborukov', load: 32},
			{departmentCode: 'fcs-nt', facultyCode: 'fcs', email: 'andriy@glybovets.com.ua', password: 'qwerty', name: 'Andrii', midName: 'Mykolaiovych', surname: 'Glybovets', load: 8},
			{departmentCode: 'fcs-nt', facultyCode: 'fcs', email: 'malaschonok@ukma.edu.ua', password: 'qwerty', name: 'Gennadii', midName: 'Ivanovych', surname: 'Malashonok', load: 17},
			{departmentCode: 'fcs-nt', facultyCode: 'fcs', email: 'chd@dnipro.net', password: 'qwerty', name: 'Dmytro', midName: 'Ivanovych', surname: 'Cherkasov', load: 37},
		];
		
		faculties.forEach(item => promises.push(Faculty.new(item)));
		degreePrograms.forEach(item => promises.push(DegreeProgram.new(item)));
		departments.forEach(item => promises.push(Department.new(item)));
		supervisors.forEach(item => promises.push(Supervisor.new(item)));
		teachers.forEach(item => promises.push(Teacher.new(item)));
		
		return Promise.all(promises);
	})
	.then(() => Teacher.find({}))
	.then(_teachers => {
		const dps = ['113', '121', '122'];
		const courseworks = _teachers.map((t, i) => {
			const dp = dps[i % 3];
			return {
				teacher: t._id,
				facultyCode: t.facultyCode,
				year: i % 6 + 1,
				departmentCode: t.departmentCode,
				degreeProgramCode: dp,
				theme: 'Coursework' + (i + 1),
				description: 'Coursework from degree program number ' + dp + ' by ' + t.name + ' ' + t.surname,
				load: i + 3,
				complexity: i % 5
			};
		});
		const courseworkPromises = courseworks.map(c => Coursework.new(c));
		return Promise.all(courseworkPromises);
	})
	.then(() => {
		console.log('fully set');
		mongoose.connection.close();
	})
	.catch(console.error);