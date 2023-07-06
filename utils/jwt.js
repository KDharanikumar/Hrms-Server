// const sendToken = (user, statusCode, res) => {
// 	// Create JWT Token
// 	const token = user.getJwtToken();

// 	// Setting Cookies

// 	const options = {
// 		expires: new Date(Date.now() + process.env.COOKIES_EXPIRES_TIME * 24 * 60 * 60 * 1000),
// 		httpOnly: true,
// 	};

// 	res.status(statusCode).cookie("token", token, options).json({
// 		success: true,
// 		user: user,
// 		token: token,
// 	});
// };

// module.exports = sendToken;

const sendToken = (user, statusCode, res) => {
	//Creating JWT Token
	const token = user.getJwtToken();

	//setting cookies
	const options = {
		expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token,
		user,
	});
};

module.exports = sendToken;
