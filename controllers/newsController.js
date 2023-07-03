const News = require("../models/newsModel");

// Get All News - /api/news
exports.getnews = async (req, res, next) => {
	const news = await News.find();

	// Loading Time Out
	// await new Promise((resolve) => setTimeout(resolve, 5000));
	res.status(200).json({
		success: true,
		news,
	});
};

// Create New News - /api/news/new
exports.newNews = async (req, res, next) => {
	req.body.user = req.user.id;
	const news = await News.create(req.body);
	res.status(201).json({
		success: true,
		news,
	});
};

//Get Single News - /api/news/:id
exports.getSingleNews = async (req, res, next) => {
	const news = await News.findById(req.params.id);

	if (!news) {
		res.status(404).json({
			success: false,
			message: "News Not Found",
		});
	}

	res.status(201).json({
		success: true,
		news,
	});
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
