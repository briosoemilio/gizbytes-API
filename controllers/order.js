const Order = require("../models/order")
const bcrypt = require("bcrypt")
const auth = require("../auth")
const Product = require("../models/product")
const User = require("../models/user")
const productController = require("../controllers/product")
const mongoose = require("mongoose")

//Add to cart

module.exports.addToCart = async (data) => {

	console.log(`Routing works.`)

	let loggedUser = auth.decode(data.headers.authorization).email
	console.log(loggedUser)
	let orderList = []
	let newProduct = data.params.productId
	console.log(newProduct)

	let totalAmount = await Order.aggregate([
		{$match: {purchasedBy: loggedUser}},
	]).then ((orders) => {
		orders.forEach((order) => {
			console.log(order)
			orderList.push(order)
			console.log(orderList)
		})
	})

	if (orderList.length == 0) {
		console.log(`New product`)
		let newOrder = new Order({
			productName:data.body.productName,
			productId: data.params.productId,
			price: data.body.price,
			quantity: data.body.quantity,
			totalAmount: data.body.totalAmount,
			purchasedBy: auth.decode(data.headers.authorization).email
		})

		return createNew = newOrder.save().then((product, error) => {
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
	} else {
		let x = 0
		orderList.forEach(item => {
			if (item.productId == newProduct) {
				//start of if statement
				if(item.isPaid) {
					let newOrder = new Order({
						productName:data.body.productName,
						productId: data.params.productId,
						price: data.body.price,
						quantity: data.body.quantity,
						totalAmount: data.body.totalAmount,
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
				//end of if statement
				console.log(`Product existing in cart`)
				let newQty = {
					quantity: parseFloat(item.quantity) + parseFloat(data.body.quantity),
					totalAmount: item.price*(parseFloat(item.quantity) + parseFloat(data.body.quantity))
				}
				Order.findByIdAndUpdate(item._id, newQty).then((order, error) => {
					if(error) {
						return false
					} else {
						return true
					}
				})
				return true
			}
			x++;
		})
		console.log(`This is the number of forEach loops: ${x}`)
		if (x == orderList.length) {
			console.log(`Product not exist in cart`)
			let newOrder = new Order({
				productName:data.body.productName,
				productId: data.params.productId,
				price: data.body.price,
				quantity: data.body.quantity,
				totalAmount: data.body.totalAmount,
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
	}
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
}

// Check out Cart
module.exports.checkOut = async (data) => {
	let loggedUser = auth.decode(data.headers.authorization).email
	
	let orderList = []

	let totalAmount = await Order.aggregate([
		{$match: {purchasedBy: loggedUser}},
	]).then ((orders) => {
		orders.forEach((order) => {
			orderList.push(order)
		})
	})

	let paidify = {
		isPaid: true,
		purchasedOn: new Date()
	}

	let checkOutIndex = data.body.selectedIndex
	checkOutIndex.forEach(async (item) => {
		await Order.findByIdAndUpdate(orderList[item]._id, paidify).then((order, error) =>{
			if (error) {
				return false
			} else {
				return true
			}
		})

		let productStocks; 

		let x = await Product.findOne({_id: orderList[item].productId}).then((product => {
			productStocks = product.stocks;
		}))
		
		let subtractify = {
			stocks: productStocks - orderList[item].quantity
		}


		await Product.findByIdAndUpdate(orderList[item].productId, subtractify).then((newProduct, err) => {
			if (err) {
				return false
			} else {
				return true
			}
		})
	})
}

// Remove product from cart
module.exports.removeProduct = async (data) => {
	let loggedUser = auth.decode(data.headers.authorization).email
	
	let orderList = []

	let totalAmount = await Order.aggregate([
		{$match: {purchasedBy: loggedUser}},
	]).then ((orders) => {
		orders.forEach((order) => {
			orderList.push(order)
		})
	})

	let removeIndex = data.body.selectedIndex
	return removeIndex.map(index => {
		Order.findOneAndDelete({_id: orderList[index]._id}).then((del, err) => {
			if (err) {
				return false
			} else {
				return true
			}
		})
	})
}

module.exports.updateCart = async (data) => {
	let loggedUser = auth.decode(data.headers.authorization).email
	
	let orderList = []

	let totalAmount = await Order.aggregate([
		{$match: {purchasedBy: loggedUser}},
	]).then ((orders) => {
		orders.forEach((order) => {
			orderList.push(order)
		})
	})

	let updateIndex = data.body.selectedIndex
	let newQuantity = data.body.newQuantity

	let updatify = {
		quantity: newQuantity
	}

	await Order.findByIdAndUpdate(orderList[updateIndex[0]], updatify).then((newQty, err) => {
		if (err) {
			return false
		} else {
			return true
		}
	})
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

//Retrieve specific orders
module.exports.getSpecificOrder = (data) => {
	
	let searchParam = data.body.searchParam
	let search = data.body.search

	let getSpecificOrder

	if (searchParam == "productId") {
		return getSpecificOrder = Order.aggregate([
				{$match: {productId: search}}
			])	
	} else if (searchParam == "purchasedBy") {
		return getSpecificOrder = Order.aggregate([
				{$match: {purchasedBy: search}}
			])
	} else if (searchParam == "._id") {
		const ObjectId = require('mongoose').Types.ObjectId
		return getSpecificOrder = Order.aggregate([
				{$match: {_id: ObjectId(`${search}`)}}
			])
	}
	
}