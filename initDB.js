const MongoClient = require('mongodb').MongoClient;

const mongoClient = new MongoClient('mongodb://localhost/enrollment', { useNewUrlParser: true });

mongoClient.connect().then((client, err) => {

  if(err){
    return console.log(err);
  }
  const db = client.db('enrollment');
  const student = db.collection('Student');
  const teacher = db.collection('Teacher');
  const supervisor = db.collection('Supervisor');
  const faculty = db.collection('Faculty');
  const degreeProgram = db.collection('DegreeProgram');
  const department = db.collection('Department');
  const coursework = db.collection('Coursework');
  const enrollmentRequest = db.collection('EnrollmentRequest');

  db.dropDatabase().then(() => {

    const initFaculties = faculty.insertMany([
      {code: 'fh', name: 'Faculty of Humanities'},
      {code: 'fe', name: 'Faculty of Economics'},
      {code: 'fcs', name: 'Faculty of Computer Sciences'},
      {code: 'fl', name: 'Faculty of Law'},
      {code: 'fns', name: 'Faculty of Natural Sciences'},
      {code: 'fssst', name: 'Faculty of Social Sciences and Social Technologies'},
    ]);

    const initDegreePrograms = degreeProgram.insertMany([
      {code: '034', name: 'Cultural Studies', faculty: 'fh'},
      {code: '033', name: 'Philosophy', faculty: 'fh'},
      {code: '032', name: 'History and Archeology', faculty: 'fh'},
      {code: '035.01', name: 'Philology: Language, Literature and Comparative Studies', faculty: 'fh'},
      {code: '035.04', name: 'Philology: English and Ukrainian Languages', faculty: 'fh'},

      {code: '051', name: 'Economics', faculty: 'fe'},
      {code: '073', name: 'Management', faculty: 'fe'},
      {code: '075', name: 'Marketing', faculty: 'fe'},
      {code: '072', name: 'Finance, Banking and Insurance', faculty: 'fe'},

      {code: '113', name: 'Applied Mathematics', faculty: 'fcs'},
      {code: '122', name: 'Computer Sciences', faculty: 'fcs'},
      {code: '121', name: 'Software Engineering', faculty: 'fcs'},

      {code: '081', name: 'Law', faculty: 'fl'},

      {code: '102', name: 'Chemistry', faculty: 'fns'},
      {code: '091', name: 'Biology and Biotechnology', faculty: 'fns'},
      {code: '101', name: 'Environmental Studies', faculty: 'fns'},
      {code: '104', name: 'Physics and Astronomy', faculty: 'fns'},

      {code: '054', name: 'Sociology', faculty: 'fssst'},
      {code: '052', name: 'Political Science', faculty: 'fssst'},
      {code: '231', name: 'Social Work', faculty: 'fssst'},
      {code: '053', name: 'Psychology', faculty: 'fssst'},
      {code: '055', name: 'International Relations, Social Communications and Regional Studies', faculty: 'fssst'},
    ]);

    const initDepartments = department.insertMany([
      {code: 'fh-cs', name: 'Cultural Studies', faculty: 'fh'},
      {code: 'fh-el', name: 'English Language', faculty: 'fh'},
      {code: 'fh-gsl', name: 'General and Slavic Linguistics', faculty: 'fh'},
      {code: 'fh-h', name: 'History', faculty: 'fh'},
      {code: 'fh-l', name: 'Literature', faculty: 'fh'},
      {code: 'fh-prs', name: 'Philosophy and Religious Studies', faculty: 'fh'},
      {code: 'fh-ul', name: 'Ukrainian Language', faculty: 'fh'},

      {code: 'fe-et', name: 'Economic Theory', faculty: 'fe'},
      {code: 'fe-f', name: 'Finance', faculty: 'fe'},
      {code: 'fe-mbm', name: 'Marketing and Business Management', faculty: 'fe'},

      {code: 'fl-als', name: 'Applied Legal Studies', faculty: 'fl'},
      {code: 'fl-lc', name: 'Experimental educational laboratory "Law clinic"', faculty: 'fl'},
      {code: 'fl-iel', name: 'International and European Law', faculty: 'fl'},
      {code: 'fl-lpcl', name: 'Legal Philosophy and Constitutional Law', faculty: 'fl'},
      {code: 'fl-eul', name: 'Jean Monnet Chair in European Union Law', faculty: 'fl'},

      {code: 'fns-b', name: 'Biology', faculty: 'fns'},
      {code: 'fns-c', name: 'Chemistry', faculty: 'fns'},
      {code: 'fns-es', name: 'Environmental Studies', faculty: 'fns'},
      {code: 'fns-ldbs', name: 'Laboratory diagnostics of biological system', faculty: 'fns'},
      {code: 'fns-pm', name: 'Physics and Mathematics', faculty: 'fns'},
      {code: 'fns-pe', name: 'Physical Education', faculty: 'fns'},

      {code: 'fcs-cs', name: 'Computer Sciences', faculty: 'fcs'},
      {code: 'fcs-m', name: 'Mathematics', faculty: 'fcs'},
      {code: 'fcs-ms', name: 'Multimedia Systems', faculty: 'fcs'},
      {code: 'fcs-nt', name: 'Network Technologies', faculty: 'fcs'},

      {code: 'fssst-ps', name: 'Political Science', faculty: 'fssst'},
      {code: 'fssst-prs', name: 'PR Studies', faculty: 'fssst'},
      {code: 'fssst-pp', name: 'Psychology and Pedagogics', faculty: 'fssst'},
      {code: 'fssst-s', name: 'Sociology', faculty: 'fssst'},
      {code: 'fssst-j', name: 'Kyiv-Mohyla School of Journalism', faculty: 'fssst'},
      {code: 'fssst-sph', name: 'School of Public Health', faculty: 'fssst'},
      {code: 'fssst-sw', name: 'Volodymyr Poltavets School of Social Work', faculty: 'fssst'},
    ]);

    const initSupervisors = supervisor.insertMany([
      {department: 'fh-cs', faculty: 'fh', email: 'info-fh-cs@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fh-el', faculty: 'fh', email: 'info-fh-el@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fh-gsl', faculty: 'fh', email: 'info-fh-gsl@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fh-h', faculty: 'fh', email: 'info-fh-h@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fh-l', faculty: 'fh', email: 'info-fh-l@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fh-prs', faculty: 'fh', email: 'info-fh-prs@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fh-ul', faculty: 'fh', email: 'info-fh-ul@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fe-et', faculty: 'fe', email: 'info-fe-et@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fe-f', faculty: 'fe', email: 'info-fe-f@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fe-mbm', faculty: 'fe', email: 'info-fe-mbm@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fl-als', faculty: 'fl', email: 'info-fl-als@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fl-lc', faculty: 'fl', email: 'info-fl-lc@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fl-iel', faculty: 'fl', email: 'info-fl-iel@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fl-lpcl', faculty: 'fl', email: 'info-fl-lpcl@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fl-eul', faculty: 'fl', email: 'info-fl-eul@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fns-b', faculty: 'fns', email: 'info-fns-b@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fns-c', faculty: 'fns', email: 'info-fns-c@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fns-es', faculty: 'fns', email: 'info-fns-es@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fns-ldbs', faculty: 'fns', email: 'info-fns-ldbs@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fns-pm', faculty: 'fns', email: 'info-fns-pm@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fns-pe', faculty: 'fns', email: 'info-fns-pe@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fcs-cs', faculty: 'fcs', email: 'info-fcs-cs@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fcs-m', faculty: 'fcs', email: 'info-fcs-m@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fcs-ms', faculty: 'fcs', email: 'info-fcs-ms@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fcs-nt', faculty: 'fcs', email: 'info-fcs-nt@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fssst-ps', faculty: 'fssst', email: 'info-fssst-ps@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fssst-prs', faculty: 'fssst', email: 'info-fssst-prs@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fssst-pp', faculty: 'fssst', email: 'info-fssst-pp@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fssst-s', faculty: 'fssst', email: 'info-fssst-s@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fssst-j', faculty: 'fssst', email: 'info-fssst-j@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fssst-sph', faculty: 'fssst', email: 'info-fssst-sph@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
      {department: 'fssst-sw', faculty: 'fssst', email: 'info-fssst-sw@ukma.edu.ua', password: 'qwerty', name: 'Supervisor', midName: '', surname: ''},
    ]);

    const initTeachers = teacher.insertMany([
      {department: 'fcs-cs', faculty: 'fcs', email: 'obuchko@gmail.com', password: 'qwerty', name: 'Olena', midName: 'Andriivna', surname: 'Buchko'},
      {department: 'fcs-cs', faculty: 'fcs', email: 'gulayeva@ukma.edu.ua', password: 'qwerty', name: 'Natalia', midName: 'Mykhailivna', surname: 'Gulaeva'},
      {department: 'fcs-cs', faculty: 'fcs', email: 'procukvs@gmail.com', password: 'qwerty', name: 'Volodymyr', midName: 'Semenovych', surname: 'Protsenko'},
      {department: 'fcs-m', faculty: 'fcs', email: 'mbratyk@ukr.net', password: 'qwerty', name: 'Mykhailo', midName: 'Vasyliovych', surname: 'Bratyk'},
      {department: 'fcs-m', faculty: 'fcs', email: 'sdiachenko@ukma.edu.ua', password: 'qwerty', name: 'Serhii', midName: 'Mykolaiovych', surname: 'Diachenko'},
      {department: 'fcs-m', faculty: 'fcs', email: 'oliynyk@ukma.edu.ua', password: 'qwerty', name: 'Bogdana', midName: 'Vitaliivna', surname: 'Oliinyk'},
      {department: 'fcs-ms', faculty: 'fcs', email: 'afonin@ukma.edu.ua', password: 'qwerty', name: 'Andrii', midName: 'Oleksandrovych', surname: 'Afonin'},
      {department: 'fcs-ms', faculty: 'fcs', email: 'oletsky@ukma.edu.ua', password: 'qwerty', name: 'Oleksii', midName: 'Vitaliovych', surname: 'Oletsky'},
      {department: 'fcs-ms', faculty: 'fcs', email: 'slavon07@gmail.com', password: 'qwerty', name: 'Viacheslav', midName: 'Viktorovych', surname: 'Horborukov'},
      {department: 'fcs-nt', faculty: 'fcs', email: 'andriy@glybovets.com.ua', password: 'qwerty', name: 'Andrii', midName: 'Mykolaiovych', surname: 'Glybovets'},
      {department: 'fcs-nt', faculty: 'fcs', email: 'malaschonok@ukma.edu.ua', password: 'qwerty', name: 'Gennadii', midName: 'Ivanovych', surname: 'Malashonok'},
      {department: 'fcs-nt', faculty: 'fcs', email: 'chd@dnipro.net', password: 'qwerty', name: 'Dmytro', midName: 'Ivanovych', surname: 'Cherkasov'},
    ]);

    Promise.all([initFaculties, initDegreePrograms, initDepartments, initSupervisors, initTeachers]);
  })
  .then(() => {
    faculty.createIndex('code', {unique: true});
    degreeProgram.createIndex('code', {unique: true});
    department.createIndex('code', {unique: true});
    teacher.createIndex('email', {unique: true});
    student.createIndex('email', {unique: true});
  })
  .then(() => {
    console.log('fully set');
    client.close();
  });
});
