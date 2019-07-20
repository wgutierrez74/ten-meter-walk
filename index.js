const express = require("express");
const mongoose = require("mongoose");

//Maybe CORS
//const cors = require("cors");

const bodyParser = require("body-parser");
const path = require("path");

const keys = require("./config/keys");

require("dotenv").config();
require("./models/Test");

const mongoURI = process.env.mongoURI || keys.mongoURI;
console.log(mongoURI);
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useMongoClient: true });

const app = express();

//Maybe CORS
//app.use(cors());

app.use(bodyParser.json());

//Used to serve up REACT files
app.use(express.static(path.join(__dirname, "client", "build")))

require("./routes/testRoutes")(app);


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


//Make port hidden with environment or in keys
const port = process.env.PORT || 5000;

app.listen(port, (err)=>{
	if(err){
		console.log(err);
	}
	console.log("Online");
});