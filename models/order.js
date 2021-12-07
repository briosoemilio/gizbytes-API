const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
	productName: String,	
	productId: String,
	price: Number,
	quantity: {
		type: Number,
		required: [true, "Product quantity is required."]
	},
	seller: String,
	totalAmount: Number,
	isPaid: {
		type: Boolean,
		default: false
	},
	purchasedBy: {
		type: String,
	},
	purchasedOn: {
		type: Date
	}
})

module.exports = mongoose.model('Order', orderSchema)