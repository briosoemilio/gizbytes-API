const Product = require("../models/product")
const UploadModel = require('../models/upload');
const bcrypt = require("bcrypt")
const auth = require("../auth")
const User = require("../models/user")
const fs = require('fs')


// Add a product
/*module.exports.createProduct = (req) => {
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
}*/

// Get all active products
module.exports.getAllActiveProduct = () => {
	return Product.find({isActive: true})
}

// Get ALL products
module.exports.getAllProduct = () => {
	let allProducts = Product.aggregate([
			{$match: {}}
		])

	return allProducts
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
		isActive: req.body.isActive,
		updatedOn: new Date()
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
}

// Archive a specific product
module.exports.archiveProduct = (req) => {
	console.log(req.body.isActive)
	let productId = req.body.productId
	let archivify = {
		isActive: req.body.isActive
	}
	
	return Product.findByIdAndUpdate(productId, archivify).then((product, error) => {
		if(error) {
			return false
		} else {
			return true
		}
	})
}

// test upload
module.exports.createProduct = async (req, res, next) => {
	const files = req.files;
	let message;
	if(!files) {
		const error = new Error('Please choose files');
		error.httpStatusCode = 400;
		return next(error)
	}

	let imgArray = await files.map((file) => {
		let img = fs.readFileSync(file.path)
		return encode_image = img.toString('base64')
	})

	let result = Promise.all(imgArray.map(async(src, index) => {
		
		let newProduct = new Product({
			productName: req.body.productName,
			description: req.body.description,
			price: req.body.price,
			stocks: req.body.stocks,
			addedBy: auth.decode(req.headers.authorization).email,
			filename: files[index].originalname,
			contentType: files[index].mimetype,
			imageBase64: src
		})
		
		return newProduct.save().then(()=> {
			message = true;
			console.log(message)
			return message
		}).catch(error => {			
			if(error.name === 'MongoError' && error.code === 11000) {
				message = 'duplicate'
				console.log(message)
				return message
			} else {
				message = 'file not found'
				console.log(message)
				return message
			}
		})
	}))	
	await result
	return result
}