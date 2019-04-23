const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenSecretKey = 'y_andreia_krasivaia_popa';

const encrypt = (password) => {
	if (!password) { return ''; }
	return bcrypt.hashSync(password, 10);
};

const checkPassword = (password, hash) => {
	if (!password || !hash) {
		console.error('empty password or hash');
		return false;
	}
	return bcrypt.compareSync(password, hash);
};

const ROLE = {
	student: 'Student',
	supervisor: 'Supervisor',
	teacher: 'Teacher'
};

const getToken = (user) => {
	const payload = { subject: user._id };
	return jwt.sign(payload, tokenSecretKey);
};

const decryptToken = (token) => jwt.verify(token, tokenSecretKey);

module.exports = {
	encrypt,
	checkPassword,
	ROLE,
	getToken,
	decryptToken,
};
