// Holiday Models

const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please Enter Name"],
	},

	date: {
		type: String,
		required: [true, "Please Select Date"],
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

let model = mongoose.model("Holiday", holidaySchema);
module.exports = model;
