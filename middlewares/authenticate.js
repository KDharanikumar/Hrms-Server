const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
	const { token } = req.cookies;

	// if (!token) {
	// 	return next("Login First Handle Resource", 401);
	// }

	if (!token) {
		return res.status(401).json({
			success: false,
			error: "Login First Handle Resource",
		});
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.user = await User.findById(decoded.id);
	next();
};

exports.authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(`Role ${req.user.role} is not Allowed`, 401);
		}
		next();
	};
};
