const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order")
const auth = require("../auth")

//Add to cart
router.post("/:productId/addtocart", auth.verify, (req, res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		res.send(false)
	} else {
		orderController.addToCart(req)
		res.send(true)
	}
})


//Get cart

router.get("/myOrders", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		res.send(false)
	} else {
		/*orderController.getCart(req).then(resultFromController => res.send(resultFromController))*/
		orderController.getCart(req).then(resultFromController => res.send(resultFromController))
		
	}
})

// Check out Cart
router.post("/myOrders/checkOut", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		res.send(false)
	} else {
		orderController.checkOut(req)
		res.send(true)
	}
})

// Remove product from Cart
router.post("/myOrders/remove", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		res.send(false)
	} else {
		orderController.removeProduct(req)
		res.send(true)
	}
})

//Change quantity in cart
router.post("/myOrders/update", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		res.send(false)
	} else {
		orderController.updateCart(req)
		res.send(true)
	}
})

// Retrieve all orders
router.get("/allOrders", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		orderController.getAllOrders(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`None admin users cannot access this page.`)
	}
})

// Retrieve paid orders
router.get("/allOrders/paid", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		orderController.getAllPaidOrders(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`None admin users cannot access this page.`)
	}
})

//Retrieve pending orders
router.get("/allOrders/pending", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		orderController.getAllPendingOrders(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`None admin users cannot access this page.`)
	}
})

//Search Current Orders
router.post("/allOrders/specific", auth.verify, (req,res)=> {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		orderController.getSpecificOrder(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`None admin users cannot access this page.`)
	}
})

//Get hot orders
router.get("/hotOrders", (req,res)=> {	
	orderController.getHotOrders(req).then(resultFromController => res.send(resultFromController))
})

module.exports = router