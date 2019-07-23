const mongoose = require("mongoose");
const { Schema } = mongoose;

//Test Document Schema
const testSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	device: String,
	type: String,
	notes: String,
	trials: [String],
	averageTime: String,
	averageVelocity: String,
	date: String,
	created: Date
});

mongoose.model('Test', testSchema);