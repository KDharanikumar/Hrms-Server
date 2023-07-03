const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
	shippingInfo: {
		address: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		phoneno: {
			type: String,
			required: true,
		},
		postalCode: {
			type: String,
			required: true,
		},
	},

	user: {
		type: mongoose.SchemaType.objectId,
		required: true,
		ref: "User",
	},

	orderItems: [
		{
			name: {
				type: String,
				required: true,
			},

			quantity: {
				type: Number,
				required: true,
			},

			image: {
				type: String,
				required: true,
			},

			price: {
				type: Number,
				required: true,
			},
			product: {
				type: mongoose.SchemaType.objectId,
				required: true,
				ref: "Product",
			},
		},
	],

	itemsPrice: {
		type: Number,
		required: true,
		default: 0.0,
	},
});
