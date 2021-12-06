const User = require("../models/user")
const bcrypt = require("bcrypt")
const auth = require("../auth")


// Register
module.exports.checkEmailExists = (reqBody) => {
	return User.find({email: reqBody.email}).then(result => {
		console.log(result)
		if (result.length > 0) {
			return true
		} else {
			return false
		}
	})
}

module.exports.registerUser = (reqBody) => {
	let newUser = new User ({
		email: reqBody.email,
		password: bcrypt.hashSync(reqBody.password, 10),
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		mobileNo: reqBody.mobileNo
	})

	return newUser.save().then((user, error) => {
		if (error) {
			return false
		} else {
			return true
		}
	})
}

// Log in

module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if (result == null) {
			return (false)
		} else {
			const isPwCorrect = bcrypt.compareSync(reqBody.password, result.password)
			if (isPwCorrect) {
				return {access: auth.createAccessToken(result)}
			} else {
				return (false)
			}
		}
	})
}

// Get all users
module.exports.getAllUsers = (reqBody) => {
	return User.find({})
}

// Get a specific user
module.exports.getUser = (reqBody) => {
	return User.findById(reqBody.userId, {password: 0})
}

// Set user as admin

module.exports.setAdmin = (reqParams) => {
	let adminified = {
		isAdmin: true
	}

	return User.findByIdAndUpdate(reqParams.userId, adminified).then((course, error) => {
		if(error) {
			return false
		} else {
			return true
		}
	})
}

//Get token details
module.exports.getProfile = (data) => {
console.log(data)
			return User.findById(data.userId).then(result => {				
				result.password = "";				
				return result;
			});
		};