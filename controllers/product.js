const Product = require("../models/product")
const bcrypt = require("bcrypt")
const auth = require("../auth")
const User = require("../models/user")
const fs = require('fs')


// Add a product
module.exports.createProduct = (reqBody, reqFile1, reqFile2, userData) => {
  let newProduct = new Product({
    productName: reqBody.productName,
    description: reqBody.description,
    brand: reqBody.brand,
    price: reqBody.price,
    stocks: reqBody.stocks,
    productImage1: reqFile1.path,
    productImage2: reqFile2.path,
    addedBy: userData.email,
  });

  return newProduct.save().then((product, error) => {
    User.findById(userData.id).then((creator) => {
      creator.products.push({ productId: product._id });
      return creator.save();
    });
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};




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
	
	console.log(req.params.productId)

	let updatedProduct = {
		productName: req.body.productName,
		description: req.body.description,
		price: req.body.price,
		stocks: req.body.stocks,
		updatedBy: auth.decode(req.headers.authorization).email,
		isActive: req.body.isActive,
		updatedOn: new Date()
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedProduct).then((product, error) => {
		if (error) {
			return false
		} else {
			return true
		}
	})
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