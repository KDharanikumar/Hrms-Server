const Holiday = require("../models/holidayModel");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

// Get All Holiday - /api/holidays
exports.getHolidays = async (req, res, next) => {
	const holiday = await Holiday.find();
	res.status(200).json({
		success: true,
		holiday: holiday,
	});
};

// Create New Holiday - /api/holiday/new
exports.newHoliday = catchAsyncError(async (req, res, next) => {
	const holiday = await Holiday.create(req.body);
	res.status(201).json({
		success: true,
		holiday,
	});
});

//Update Holiday - /api/holiday/:id
exports.updateHoliday = async (req, res, next) => {
	let holiday = Holiday.findById(req.params.id);

	if (!holiday) {
		res.status(404).json({
			success: false,
			message: "Holiday Not Found",
		});
	}

	holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		holiday,
	});
};

//Delete Holiday - /api/holiday/:id

exports.deleteHoliday = async (req, res, next) => {
	try {
		const holiday = await Holiday.findById(req.params.id);

		if (!holiday) {
			return res.status(404).json({
				success: false,
				message: "Holiday Not Found",
			});
		}

		await Holiday.deleteOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			message: "Holiday Deleted",
		});
	} catch (error) {
		next(error);
	}
};
