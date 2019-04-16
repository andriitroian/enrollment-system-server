const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
	code: {
		type: String,
		index: true,
		unique: true
	},
	name: String
});

FacultySchema.methods.create = (data) => {
	return new Promise((resolve, reject) => {
		Faculty.find({code: data.code}, (err, existingFaculty) => {
			if (err) {
				reject(err);
				return;
			}
			if (existingFaculty) {
				reject('FACULTY_EXISTS');
				return;
			}
			
			const faculty = new Faculty(data);
			faculty.save((e, f) => {
				if (e) {
					reject(e);
					return;
				}
				resolve(f);
			});
		})
	});
};

const Faculty = module.exports = mongoose.model('Faculty', FacultySchema);



