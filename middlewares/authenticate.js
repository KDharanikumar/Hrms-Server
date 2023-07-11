const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return res.status(401).json({
			success: false,
			error: "Login First to Access This Resource",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			error: "Invalid Token",
		});
	}
};

exports.authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				error: `User role'${req.user.role}'is not authorized to access this resource`,
			});
		}
		next();
	};
};
