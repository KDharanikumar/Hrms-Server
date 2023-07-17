const Holiday = require("../models/holidayModel");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

// Get All Holiday - /api/holiday
exports.getHoliday = async (req, res, next) => {
	const holiday = await Holiday.find();
	res.status(200).json({
		success: true,
		holiday,
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
