const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")
const auth = require("../auth")

// Set admin
router.post("/setAdminUser", auth.verify, (req, res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin
	
		if (isAdmin) {
			userController.setAdmin(req)
			res.send(true)			
		} else {
			res.send(false)
		}
});

// Register
router.post("/register", (req,res) => {
	userController.checkEmailExists(req.body).then(checkRegister => {
		if (checkRegister) {
			res.send(false)
		} else {
			userController.registerUser(req.body).then(resultFromController => res.send(true))
		}
	})
})

// Log in
router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController))
})

// get all users
router.get("/details", auth.verify, (req,res) => {

	let isAdmin = auth.decode(req.headers.authorization)
	res.send(isAdmin)
});

router.get("/all", auth.verify, (req,res) => {

	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		userController.getAllUsers().then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`Please use Admin user only.`)
	}
});

//Get customer users
router.get("/customers", auth.verify, (req,res) => {

	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		userController.getCustomerUsers(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`Please use Admin user only.`)
	}
});

//Get pending admin users
router.get("/pendingAdmins", auth.verify, (req,res) => {

	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		userController.getPendingAdminUser(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`Please use Admin user only.`)
	}
});

//Get admin users
router.get("/admins", auth.verify, (req,res) => {

	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		userController.getAdminUser(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`Please use Admin user only.`)
	}
});

//Search Current users
router.post("/specific", auth.verify, (req,res)=> {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		userController.getSpecificUser(req).then(resultFromController => res.send(resultFromController))
	} else {
		res.send(`None admin users cannot access this page.`)
	}
})

// Get specific user
router.get("/:userId", auth.verify, (req,res) => {
	userController.getUser(req.params).then(resultFromController => res.send(resultFromController))
});

module.exports = router