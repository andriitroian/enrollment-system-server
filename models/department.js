const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
	code: {
		type: String,
		index: true,
		unique: true
	},
	facultyCode: String,
	name: String
});

DepartmentSchema.statics.new = (data) => {
	return new Promise((resolve, reject) => {
		Department.findOne({code: data.code}, (err, existingDepartment) => {
			if (err) {
				reject(err);
				return;
			}
			if (existingDepartment) {
				reject('DEPARTMENT_EXISTS');
				return;
			}
			
			const department = new Department(data);
			department.save((e, d) => {
				if (e) {
					reject(e);
					return;
				}
				resolve(d);
			});
		})
	});
};

const Department = module.exports = mongoose.model('Department', DepartmentSchema);

