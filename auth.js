const jwt = require("jsonwebtoken");
const secret = "Secret"

module.exports.createAccessToken = (user) => {
	const payload = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
	return jwt.sign(payload, secret, {})
}

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token !== "undefined"){
		token = token.slice(7, token.length)

		return jwt.verify(token, secret, (err, data) => {
			if (err) {
				return res.send({auth: "failed verification of user"})
			} else {
				next()
			}
		})
	} else {
		return res.send({auth: "failed. token is undefined."})
	}
}

module.exports.decode = (token) => {
	if(typeof token!== "undefined"){
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (err,data) => {
			if (err) {
				return res.send({auth: "failed verification of user"})
			} else {
				return jwt.decode(token, {complete:true}).payload
			}
		})
	} else {
		return res.send({auth: "failed. token is undefined."})
	}
}