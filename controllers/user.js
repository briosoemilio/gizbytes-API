const User = require("../models/user")
const bcrypt = require("bcrypt")
const auth = require("../auth")
const mongoose = require("mongoose")


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
		mobileNo: reqBody.mobileNo,
		joinAdmin: reqBody.joinAdmin
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
	let allUsers = User.aggregate([
			{$match: {}}
		])

	return allUsers
}

// Get a specific user
module.exports.getUser = (reqBody) => {
	return User.findById(reqBody.userId, {password: 0})
}

// Set user as admin

module.exports.setAdmin = (req) => {
	let adminified = {
		isAdmin: true,
		joinAdmin: false
	}
	console.log(req.body.user)

	return User.findByIdAndUpdate(req.body.user, adminified).then((user, error) => {
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

// Retrieve customer users
module.exports.getCustomerUsers = (data) => {
	let allCustomerUsers = User.aggregate([
			{$match: {isAdmin:false}}
		])

	return allCustomerUsers
}

// Retrieve pending admin users
module.exports.getPendingAdminUser = (data) => {
	let allPendingAdminUsers = User.aggregate([
			{$match: {joinAdmin:true}}
		])

	return allPendingAdminUsers
}

//Retrieve all admin users
module.exports.getAdminUser = (data) => {
	let allAdminUsers = User.aggregate([
			{$match: {isAdmin:true}}
		])

	return allAdminUsers
}

//Retrieve specific orders
module.exports.getSpecificUser = (data) => {
	
	let searchParam = data.body.searchParam
	let search = data.body.search

	let getSpecificUser

	if (searchParam == "userEmail") {
		return getSpecificUser = User.aggregate([
				{$match: {email: search}}
			])	
	} else if (searchParam == "._id") {
		const ObjectId = require('mongoose').Types.ObjectId
		return getSpecificUser = User.aggregate([
				{$match: {_id: ObjectId(`${search}`)}}
			])
	}
	
}