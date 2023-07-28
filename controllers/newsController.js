const News = require("../models/newsModel");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

// Get All News - /api/news
exports.getNews = catchAsyncError(async (req, res, next) => {
	const resPerPage = 10;
	const apiFeatures = new APIFeatures(News.find(), req.query).search().paginate(resPerPage);

	const news = await apiFeatures.query;
	const totalNewsCount = await News.countDocuments({});

	res.status(200).json({
		success: true,
		count: totalNewsCount,
		resPerPage,
		news,
	});
});

// Create New News - /api/news/new
// exports.newNews = catchAsyncError(async (req, res, next) => {
// 	// req.body.user = req.user.id;
// 	const news = await News.create(req.body);
// 	res.status(201).json({
// 		success: true,
// 		news,
// 	});
// });

// Controller function to create a new news article
exports.newNews = async (req, res, next) => {
	try {
		const { title, message } = req.body;

		// Validate the data
		if (!title || !message) {
			return res.status(400).json({ error: "Title and message are required." });
		}

		// Create a new News object and save it to the database
		const news = await News.create({ title, message });

		// Return success response
		res.status(201).json({ success: true, news });
	} catch (error) {
		// Handle any server-side error
		console.error("Error creating news:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

//Get Single News - /api/news/:id
// exports.getSingleNews = async (req, res, next) => {
// 	const news = await News.findById(req.params.id);

// 	if (!news) {
// 		return next(new ErrorHandler("News Not Found", 400));
// 	}

// 	res.status(201).json({
// 		success: true,
// 		news,
// 	});
// };

// exports.getSingleNews = async (req, res, next) => {
// 	try {
// 		const news = await News.findById(req.params.id);

// 		if (!news) {
// 			return next(new ErrorHandler("News Not Found", 400));
// 		}

// 		res.status(200).json({
// 			success: true,
// 			news,
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };

//Get Single News - /api/news/:id
exports.getSingleNews = async (req, res, next) => {
	try {
		const news = await News.findById(req.params.id);

		if (!news) {
			return next(new ErrorHandler("News Not Found", 400));
		}

		res.status(200).json({
			success: true,
			news,
		});
	} catch (error) {
		if (error.name === "CastError" && error.kind === "ObjectId") {
			return next(new ErrorHandler("Invalid News ID", 400));
		}

		next(error);
	}
};

//Update News - /api/news/:id
exports.updateNews = async (req, res, next) => {
	let news = News.findById(req.params.id);

	if (!news) {
		res.status(404).json({
			success: false,
			message: "News Not Found",
		});
	}

	news = await News.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		news,
	});
};

exports.deleteNews = async (req, res, next) => {
	try {
		const news = await News.findById(req.params.id);

		if (!news) {
			return res.status(404).json({
				success: false,
				message: "News Not Found",
			});
		}

		await News.deleteOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			message: "News Deleted",
		});
	} catch (error) {
		next(error);
	}
};
