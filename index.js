const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

mongoose.connect("mongodb+srv://admin:8260560aw@zuittbootcamp.3f2rk.mongodb.net/e-commerce?retryWrites=true&w=majority" , {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

let db = mongoose.connection;
	
	db.on('error', () => console.error.bind(console, "Connection Error"));
	db.once('open', () => console.log('Connected to the cloud database.'))

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.listen(port, () => console.log (`Server running @ port: ${port}.`))