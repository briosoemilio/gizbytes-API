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
		res.send(`User is Admin, Admin users do not have any orders. Please use non-admin account.`)
	} else {
		let orders;
		orderController.getCart(req).then(resultFromController =>{
			orders = resultFromController
			orderController.checkOut(orders).then(result => res.send result)
		})
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
module.exports = router