const mongoose = require("mongoose");
require("dotenv").config();

const uri = "mongodb+srv://hrsoftware:hrsoftware@hrsoftware.nxvpbiw.mongodb.net/?retryWrites=true&w=majority";

const db = async () => {
	try {
		await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		mongoose.set("strictQuery", false);
		console.log("MongoDB Connected");
	} catch (error) {
		console.log("DB Error:", error);
	}
};

module.exports = db;
