const Todo = require("../models/toDoModel");

// Get All News - /api/todo
exports.gettodo = async (req, res, next) => {
	const todo = await Todo.find();

	// Loading Time Out
	// await new Promise((resolve) => setTimeout(resolve, 5000));
	res.status(200).json({
		success: true,
		todo,
	});
};

// Create New News - /api/todo/new
exports.newTodo = async (req, res, next) => {
	req.body.user = req.user.id;
	const todo = await Todo.create(req.body);
	res.status(201).json({
		success: true,
		todo,
	});
};

//Get Single News - /api/todo/:id
exports.getSingleTodo = async (req, res, next) => {
	const todo = await Todo.findById(req.params.id);

	if (!todo) {
		res.status(404).json({
			success: false,
			message: "News Not Found",
		});
	}

	res.status(201).json({
		success: true,
		todo,
	});
};

//Update News - /api/todo/:id
exports.updateTodo = async (req, res, next) => {
	let todo = Todo.findById(req.params.id);

	if (!todo) {
		res.status(404).json({
			success: false,
			message: "News Not Found",
		});
	}

	todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		todo,
	});
};

exports.deleteTodo = async (req, res, next) => {
	try {
		const todo = await Todo.findById(req.params.id);

		if (!todo) {
			return res.status(404).json({
				success: false,
				message: "News Not Found",
			});
		}

		await Todo.deleteOne({ _id: req.params.id });

		res.status(200).json({
			success: true,
			message: "News Deleted",
		});
	} catch (error) {
		next(error);
	}
};
