const express = require("express");
require("dotenv").config();
const db = require("./db/connect");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorMiddleware = require("./middlewares/error");

// Import Routes
const news = require("./routes/news");
const todo = require("./routes/todo");
const auth = require("./routes/auth");
const holiday = require("./routes/holiday");

const app = express();

// CORS
app.use(cors());

// Connecting DB
db();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", news);
app.use("/api", todo);
app.use("/api", auth);
app.use("/api", holiday);

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`App is Running on Port ${PORT}`);
});

module.exports = app;
