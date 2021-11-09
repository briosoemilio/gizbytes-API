const Product = require("../models/product")
const bcrypt = require("bcrypt")
const auth = require("../auth")
const User = require("../models/user")


// Add a product
module.exports.createProduct = (req) => {
	let newProduct = new Product({
		productName: req.body.productName,
		description: req.body.description,
		price: req.body.price,
		stocks: req.body.stocks,
		addedBy: auth.decode(req.headers.authorization).email
	})
	
	let createNew = newProduct.save().then((product, error) => {
		User.findById(auth.decode(req.headers.authorization).id).then(creator => {
				creator.products.push({productId: product._id})
				return creator.save()
		})

		if (error) {
			return false
		} else {
			return true
		}
	})
}

// Get all active products
module.exports.getAllProduct = () => {
	return Product.find({isActive: true})
}

// Get specific product
module.exports.getProduct = (reqParams) => {
	return Product.findOne({_id: reqParams.productId})
}

// Update a specific product
module.exports.updateProduct = (req) => {
	let updatedProduct = {
		productName: req.body.productName,
		description: req.body.description,
		price: req.body.price,
		stocks: req.body.stocks,
		updatedBy: auth.decode(req.headers.authorization).email,
		updatedOn: new Date()
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
}

// Archive a specific product
module.exports.archiveProduct = (req) => {
	let archivify = {
		isActive: false
	}
	
	return Product.findByIdAndUpdate(req.productId, archivify).then((course, error) => {
		if(error) {
			return false
		} else {
			return true
		}
	})
}