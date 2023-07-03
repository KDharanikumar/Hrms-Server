const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please Enter Tilte"],
	},
	message: {
		type: String,
		required: [true, "Please Enter Message"],
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
	},

	createAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("ToDo", todoSchema);
