const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")
const auth = require("../auth")


// Register
router.post("/register", (req,res) => {
	userController.checkEmailExists(req.body).then(checkRegister => {
		if (checkRegister) {
			res.send(`You have already created an account on this email ${req.body.email}. Click here to log in.`)
		} else {
		userController.registerUser(req.body).then(resultFromController => res.send(`Successfully registered user: ${req.body.email}.`))
		}
	})
})

// Log in
router.get("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController))
})

// get all users
router.get("/all", (req,res) => {
	userController.getAllUsers().then(resultFromController => res.send(resultFromController))
});

// Get specific user
router.get("/:userId", auth.verify, (req,res) => {
	userController.getUser(req.params).then(resultFromController => res.send(resultFromController))
})

// Set admin
router.post("/:userId/setadmin/", auth.verify, (req, res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin
	
	userController.getUser(req.params).then(resultFromController => {
		let newAdmin = resultFromController.email
	
		if (isAdmin) {
			userController.setAdmin(req.params)
			res.send(`You have set user: ${newAdmin} as a new admin.`)
			
		} else {
			res.send(`User is not admin. Cannot set other users as admin.`)
		}
	})
})



module.exports = router