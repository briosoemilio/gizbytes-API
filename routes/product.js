const express = require("express");
const router = express.Router();
const productController = require("../controllers/product")
const auth = require("../auth")
const store = require('../multer')

// Add a product
/*router.post("/add", auth.verify, store.array('images, 12'), productController.uploads, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin
	let newProduct = req.body.productName

	if (isAdmin) {
		productController.createProduct(req);
		res.send(true)
	} else {
		res.send(false)
	}
})*/

// Get all active products
router.get("/allActive", (req,res) => {
	productController.getAllActiveProduct().then(resultFromController => res.send(resultFromController))
})

//Get ALL Products
router.get("/all", (req,res) => {
	productController.getAllProduct().then(resultFromController => res.send(resultFromController))
})

// Get specific product
router.get("/:productId", (req,res) => {
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

//upload photo
/*router.post("/upload", store.array('images, 12'), productController.uploads)*/

//test upload
router.post("/add", auth.verify, store.array('images', 12), (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin
	
	if (isAdmin) {
		productController.createProduct(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(false)
	}
})


module.exports = router