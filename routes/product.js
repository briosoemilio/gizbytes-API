const express = require("express");
const router = express.Router();
const productController = require("../controllers/product")
const auth = require("../auth")


// Add a product
router.post("/add", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin
	let newProduct = req.body.productName

	if (isAdmin) {
		productController.createProduct(req);
		res.send(`You have successfully created product: ${newProduct}`)
	} else {
		res.send(`Only admins are allowed to create a product.`)
	}
})

// Get all active products
router.get("/all", auth.verify, (req,res) => {
	productController.getAllProduct().then(resultFromController => res.send(resultFromController))
})

// Get specific product
router.get("/:productId", auth.verify, (req,res) => {
	productController.getProduct(req.params).then(resultFromController => res.send (resultFromController))
})

// update product
router.post("/:productId/update", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		productController.updateProduct(req).then(resultFromController => {res.send(`You have successfully updated this product.`)})
	} else {
		res.send(`Only admins are allowed to update a product.`)
	}
})

// archive product
router.post("/:productId/archive", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		productController.archiveProduct(req.params)
		res.send(`You have successfully archived this product.`)
	} else {
		res.send(`Only admins are allowed to archive a product.`)
	}
})

module.exports = router