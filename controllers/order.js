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
		productName:data.body.productName,
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

module.exports.getCart = async (data) => {
	let loggedUser = auth.decode(data.headers.authorization).email
	
	let orderList = []

	let totalAmount = await Order.aggregate([
		{$match: {purchasedBy: loggedUser}},
	]).then ((orders) => {
		orders.forEach((order) => {
			orderList.push(order)
		})
	})

	return orderList

	/*let totalAmount = await Order.aggregate([
		{$match: {purchasedBy: loggedUser}},
		{$group: {_id: loggedUser, total:{$sum: "$totalAmount"}}}
	])

	return totalAmount*/
}

// Check out Cart
module.exports.checkOut = async (data) => {

	return data;
	
	/*let loggedUser = auth.decode(data.headers.authorization).email

	let isStockSubtracted = await Order.aggregate([
			{$match: {purchasedBy: loggedUser}}
		]).then((orders => {
			orders.forEach((order) => {
				let productId = order.productId
				let quantity = order.quantity
				let orderId = order._id
				let isPaid = order.isPaid
				
				Product.findById(productId).then((products => {
					// Check if product stocks is gte order quantity
					if (products.stocks >= quantity) {

						// Make order isPaid to true
						let paidified = {
							isPaid: true
						}
						Order.findByIdAndUpdate(orderId, paidified).then((order, error) => {
							if (error) {
								return false
							} else {
								return true
							}
						})

						// Subtract order quantity to product stocks
						let updatedStocks = {
							stocks: products.stocks - quantity
						}

						Product.findByIdAndUpdate(productId, updatedStocks).then((updateProduct, err) => {
							if (err) {
								return false
							} else {
								return true
							}
						})

						res.send(`Success you have bought ${quantity} pcs of product: ${productId}`)
						return true
					} else {
						res.send(`Error: no more stocks for product: ${productId}`)
						return false
					}
				}))
			})
		}))		*/
}

//Retrieve all Orders
module.exports.getAllOrders = (data) => {
	let allOrders = Order.aggregate([
			{$match: {}}
		])

	return allOrders
}

//Retrieve paid orders
module.exports.getAllPaidOrders = (data) => {
	let allPaidOrders = Order.aggregate([
			{$match: {isPaid:true}}
		])

	return allPaidOrders
}

//Retrieve pending orders
module.exports.getAllPendingOrders = (data) => {
	let allPendingOrders = Order.aggregate([
			{$match: {isPaid:false}}
		])

	return allPendingOrders
}