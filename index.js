const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();
require("./models/Test");

//Connect to MLab Database
const mongoURI = process.env.mongoURI;
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useMongoClient: true });

const app = express();

app.use(bodyParser.json());

//Used to serve up REACT files
app.use(express.static(path.join(__dirname, "client", "build")))

//Route Handler
require("./routes/testRoutes")(app);


//Serves React App
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, (err)=>{
	if(err){
		console.log(err);
	}
	console.log("Online");
});