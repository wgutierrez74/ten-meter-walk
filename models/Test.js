const mongoose = require("mongoose");
const { Schema } = mongoose;

const testSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	device: String,
	type: String,
	tests: [String],
	averageTime: String,
	averageVelocity: String,
	date: String,
	created: Date
});

mongoose.model('Test', testSchema);