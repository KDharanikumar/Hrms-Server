const mongoose = require("mongoose");
require("dotenv").config();

const db = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
		mongoose.set("strictQuery", false);
		console.log("MongoDB Connected");
	} catch (error) {
		console.log("DB Error:", error);
	}
};

module.exports = db;
