const mongoose = require('mongoose');

const DegreeProgramSchema = new mongoose.Schema({
	code: {
		type: String,
		index: true,
		unique: true
	},
	faculty: String,
	name: String
});

DegreeProgramSchema.methods.create = (data) => {
	return new Promise((resolve, reject) => {
		DegreeProgram.find({code: data.code}, (err, existingDegreeProgram) => {
			if (err) {
				reject(err);
				return;
			}
			if (existingDegreeProgram) {
				reject('DEGREE_PROGRAM_EXISTS');
				return;
			}
			
			const degreeProgram = new DegreeProgram(data);
			degreeProgram.save((e, d) => {
				if (e) {
					reject(e);
					return;
				}
				resolve(d);
			});
		})
	});
};

const DegreeProgram = module.exports = mongoose.model('DegreeProgram', DegreeProgramSchema);

