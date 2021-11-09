const Order = require("../models/order")
const bcrypt = require("bcrypt")
const auth = require("../auth")
const Product = require("../models/product")
const User = require("../models/user")
const productController = require("../controllers/product")
const mongoose = require("mongoose")

//Add to cart

module.exports.addToCart = async (data) => {
	
	let productDetails = await Product.findById(data.params.productId, {price:1 , _id:0})
	let stringify = JSON.stringify(productDetails)
	let productPrice = stringify.replace(/\D/g,"")

	let newOrder = new Order({
		productId: data.params.productId,
		price: productPrice,
		quantity: data.body.quantity,
		totalAmount: productPrice*data.body.quantity,
		purchasedBy: auth.decode(data.headers.authorization).email
	})

	let createNew = newOrder.save().then((product, error) => {
		User.findById(auth.decode(data.headers.authorization).id).then(buyer => {
				buyer.orders.push({productId: product._id})
				return buyer.save()
		})

		if (error) {
			return false
		} else {
			return true
		}
	})
}

// Get cart

module.exports.getCart = (data) => {
	let loggedUser = auth.decode(data.headers.authorization).email
	
	let totalAmount = Order.aggregate([
		{$match: {}},
		{$group: {_id: loggedUser, total:{$sum: "$totalAmount"}}}
	])

	return totalAmount
}

// Check out Cart
module.exports.checkOut = async (data) => {
	let loggedUser = auth.decode(data.headers.authorization).email

	// Make order isPaid to true
	let paidified = {
		isPaid: true
	}
	let isOrderPaid = await Order.find({purchasedBy: loggedUser}).updateMany(paidified).then((order, error) => {
		if (error) {
			return false
		} else {
			return true
		}
	})

	// Check if product stocks is greater than order quantity
	// Subtract order quantity to product stocks
	let isStockSubtracted = await Order.aggregate([
			{$match: {purchasedBy: loggedUser}}
		]).then((orders, error) => {
			orders.forEach((order) => {
				let productId = order.productId
				let quantity = order.quantity
				let orderId = order._id

				Product.findById(productId).then((products => {
					if (products.stocks > quantity) {
						let updatedStocks = {
							stocks: products.stocks - quantity
						}
						Product.findByIdAndUpdate(productId, updatedStocks)
						return true
					} else {
						return false
					}
				}))
			})
			if (error) {
				return false
			} else {
				return true
			}
		})

		console.log(isStockSubtracted)

		if (isStockSubtracted && isOrderPaid) {
			return true
		} else {
			return false
		}
}