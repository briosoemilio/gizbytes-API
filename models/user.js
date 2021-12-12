const mongoose = require("mongoose")

const userSchema = new mongoose.Schema ({
	email : {
		type: String,
		required: [true, 'Email field is required.']
	},

	password: {
		type: String,
		required: [true, 'Email field is required.']
	},

	isAdmin: {
		type: Boolean,
		default: false
	},

	firstName: {
		type: String,
		required: [true, 'First Name is required.']
	},

	lastName: {
		type: String,
		required: [true, 'Last Name is required.']
	},

	mobileNo: {
		type: String,
		required: [true, '']
	},

	orders: [{
		productId: {
			type: String,
			required: [true, 'Product ID is required.']
		},
		isPaid: {
			type: Boolean,
			default: false
		},

		orderedOn: {
			type: Date,
			default: new Date()
		}
	}],

	products: [{
		productId: {
			type: String,
			required: [true, 'Product ID is required.']
		}
	}],

	joinAdmin: {
		type: Boolean
	}
	
})

module.exports = mongoose.model('User', userSchema)