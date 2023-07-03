const express = require("express");
require("dotenv").config();
const db = require("./db/connect");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// Import Routes
const news = require("./routes/news");
const todo = require("./routes/todo");
const auth = require("./routes/auth");

const app = express();

// CORS
app.use(cors());

// Connecting DB
db();

// Middlewares
app.use(express.json());

app.use(cookieParser());

app.use("/api", news);
app.use("/api", todo);
app.use("/api", auth);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`App is Running on Port ${PORT}`);
});

module.exports = app;
