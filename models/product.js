const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
	productName: {
		type: String,
		required: [true, "Product name is required."]
	},
	description: {
		type: String,
		required: [true, "Product description is required."]
	},
	price: {
		type: Number,
		required: [true, "Product price is required."]
	},
	stocks: {
		type: Number,
		required: [true, "Product price is required."]
	},
	brand: {
		type: String,
		required: [true, "Product brand is required."]
	},
	reviews: {
		type: Number
	},
	isActive: {
		type: Boolean,
		default: true
	},
	productImage1: {
	  type: String,
	},
	productImage2: {
	  type: String,
	},
	addedBy: {
		type: String,
	},
	addedOn:{
		type: Date,
		default: new Date()
	},
	updatedBy: {
		type: String
	},
	updatedOn: {
		type: Date,
		default: new Date()
	},
});

module.exports = mongoose.model('Product', productSchema)