const bcrypt = require('bcryptjs');

module.exports.encrypt = (password) => {
	if (!password) { return ''; }
	return bcrypt.hashSync(password, 10);
};

module.exports.checkPassword = (password, hash) => {
	if (!password || !hash) { return false; }
	return bcrypt.compareSync(password, hash);
};

module.exports.ROLE = {
	student: 'Student',
	supervisor: 'Supervisor',
	teacher: 'Teacher'
};
