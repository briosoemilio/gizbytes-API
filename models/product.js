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
	isActive: {
		type: Boolean,
		default: true
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
	filename : {
        type : String,
        unique : true,
        required: true
    },
    contentType : {
        type: String,
        required : true
    },
    imageBase64 : {
        type : String,
        required: true
    },

})

module.exports = mongoose.model('Product', productSchema)