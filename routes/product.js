const express = require("express");
const router = express.Router();
const productController = require("../controllers/product")
const auth = require("../auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});


// Add a product
router.post(
  "/add",
  upload.fields([
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    const productImage1 = req.files.productImage1[0];
    const productImage2 = req.files.productImage2[0];
    console.log(productImage1);
    console.log(productImage2);
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin === true) {
      productController
        .createProduct(req.body, productImage1, productImage2, userData)
        .then((resultFromController) => res.send(resultFromController));
    } else {
      res.send(false);
    }
  }
);

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
		productController.updateProduct(req)
		res.send(true)
	} else {
		res.send(`Only admins are allowed to update a product.`)
	}
})

// archive product
router.post("/archive", auth.verify, (req,res) => {
	let isAdmin = auth.decode(req.headers.authorization).isAdmin

	if (isAdmin) {
		productController.archiveProduct(req)
		res.send(true)
	} else {
		res.send(`Only admins are allowed to archive a product.`)
	}
})

module.exports = router