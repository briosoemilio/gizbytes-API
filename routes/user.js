const express = require("express");
const router = express.Router();
const userController = require("../controllers/user")
const auth = require("../auth")


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

// Get specific user
router.get("/:userId", auth.verify, (req,res) => {
	userController.getUser(req.params).then(resultFromController => res.send(resultFromController))
});

// Set admin
router.put("/:userId/setadmin/", auth.verify, (req, res) => {
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
});

module.exports = router