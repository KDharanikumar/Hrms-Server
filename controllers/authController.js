const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");

// Register User - /api/register
exports.registerUser = async (req, res, next) => {
	const {
		name,
		email,
		password,
		mobile,
		department,
		employeeId,
		birthday,
		gender,
		marital,
		address,
		state,
		city,
		postalCode,
		personName,
		phone,
		relationShip,
		bankName,
		branch,
		ifsc,
		accountName,
		accountNo,
		micr,
		officeName,
		location,
		joiningDate,
		probationStart,
		probationEnd,
		effectiveStart,
		effectiveEnd,
		monthlySalary,
		lpa,
		reason,
		docName,
	} = req.body;

	let avatar;
	if (req.file) {
		avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
	}

	let document;
	if (req.file) {
		document = `${process.env.BACKEND_URL}/uploads/documents/${req.file.originalname}`;
	}
	try {
		const createdUser = await User.create({
			name,
			email,
			password,
			avatar,
			mobile,
			department,
			employeeId,
			birthday,
			gender,
			marital,
			address,
			state,
			city,
			postalCode,
			personName,
			phone,
			relationShip,
			bankName,
			branch,
			ifsc,
			accountName,
			accountNo,
			micr,
			officeName,
			location,
			joiningDate,
			probationStart,
			probationEnd,
			effectiveStart,
			effectiveEnd,
			monthlySalary,
			lpa,
			reason,
			docName,
			document,
		});

		sendToken(createdUser, 201, res);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

// Login User - /api/login
exports.loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			error: "Please Enter Email and Password.",
		});
	}

	try {
		// Find User in the database\
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({
				success: false,
				error: "Invalid Email or Password.",
			});
		}

		// Check if the provided password is valid
		const isPasswordValid = await user.isValidPassword(password);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				error: "Invalid email or password.",
			});
		}

		// Send token to the user
		sendToken(user, 200, res);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

// Logout User - /api/logout
exports.logoutUser = (req, res, next) => {
	res
		.cookie("token", null, {
			expires: new Date(Date.now()),
			httpOnly: true,
		})
		.status(200)
		.json({
			success: true,
			message: "LoggedOut",
		});
};

// Forgot Password - /api/password/forgot
exports.forgotPassword = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next("User Not Found with this Email", 404);
	}

	const resetToken = user.getResetToken();
	await user.save({ validateBeforeSave: false });

	// Create Reset URL
	const resetUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`;

	const message = `Your Password Reset URL is as Follows \n\n
	${resetUrl}\n\n if You Not Requested this Email, then Ignore It`;

	try {
		sendEmail({
			email: user.email,
			subject: "Avia Tech Password Recovery",
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email Sent to ${user.email}`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(error.message, 500);
	}
};

// Reset Password - /api/password/reset/:Token
exports.resetPassword = async (req, res, next) => {
	const resetPasswordToken = crypto.createHash(`sha256`).update(req.params.token).digest(`hex`);
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordTokenExpire: {
			$gt: Date.now(),
		},
	});

	if (!user) {
		return next("Password Reset Token is Invalid or Expired");
	}
	if (req.body.password !== req.body.confirmPassword) {
		return next("Password Does not Match");
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordTokenExpire = undefined;
	await user.save({ validateBeforeSave: false });

	sendToken(user, 201, res);
};

// Get User Profile - /api/myprofile
exports.getUserProfile = async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		user,
	});
};

// Change Password - /api/password/change
exports.changePassword = async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	// Check Old Password
	if (await user.isValidPassword(req.body.oldPassword)) {
		return next("OLD Password is Incorrect", 401);
	}

	// Assigning New Password
	user.password = req.body.password;
	await user.save();

	res.status(200).json({
		success: true,
	});
};

// Update Profile - /api/update
exports.updateProfile = async (req, res, next) => {
	let newUserData = {
		name: req.body.name,
		email: req.body.email,
	};

	let avatar;
	if (req.file) {
		avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
		newUserData = { ...newUserData, avatar };
	}

	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		user,
	});
};

// Admin Control : Get All Users - /api/admin/users
exports.getAllUsers = async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		success: true,
		users,
	});
};

// Admin Control : Get Specific Users - /api/admin/user/id
exports.getUser = async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(`User Not Found with this id ${req.params.id}`);
	}

	res.status(200).json({
		success: true,
		user,
	});
};

// Admin Control : Update User - /api/admin/user/id
exports.updateUser = async (req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
		mobile: req.body.mobile,
		department: req.body.department,
		employeeId: req.body.employeeId,
		birthday: req.body.birthday,
		gender: req.body.gender,
		marital: req.body.marital,
		address: req.body.address,
		state: req.body.state,
		city: req.body.city,
		postalCode: req.body.postalCode,
		personName: req.body.personName,
		phone: req.body.phone,
		relationShip: req.body.relationShip,
		bankName: req.body.bankName,
		branch: req.body.branch,
		ifsc: req.body.ifsc,
		accountName: req.body.accountName,
		accountNo: req.body.accountNo,
		micr: req.body.micr,
		officeName: req.body.officeName,
		location: req.body.location,
		joiningDate: req.body.joiningDate,
		probationStart: req.body.probationStart,
		probationEnd: req.body.probationEnd,
		effectiveStart: req.body.effectiveStart,
		effectiveEnd: req.body.effectiveEnd,
		monthlySalary: req.body.monthlySalary,
		lpa: req.body.lpa,
		reason: req.body.reason,
	};

	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		user,
	});
};

// Admin Control : Delete User - /api/admin/user/id
exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return next(`User Not Found with this id ${req.params.id}`);
		}

		await User.deleteOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
		});
	} catch (error) {
		next(error);
	}
};
