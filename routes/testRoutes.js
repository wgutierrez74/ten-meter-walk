const mongoose = require("mongoose");

const Test = mongoose.model("Test");

module.exports = (app) =>{


	app.get("/tests", async (req, res)=>{
		const tests = await Test.find();
		res.send(tests);
	});

	app.post("/tests", async (req, res)=>{

		let dateObj = new Date();
		const month = dateObj.getMonth() + 1; //months from 1-12
		const day = dateObj.getDate();
		const year = dateObj.getFullYear();
		let minutes = dateObj.getMinutes();
		minutes = minutes < 10 ? "0" + minutes : minutes
		let hour = dateObj.getHours();
		let suffix = hour > 11 ? "PM" : "AM";
		hour = hour%12;
		hour = hour === 0 ? 12 : hour
		const date = month + "/" + day + "/" +year + " " + hour+":"+minutes+" "+ suffix;

		const newTest = new Test({
			...req.body,
			date,
			created: dateObj
		});

		newTest.save();
		res.send(newTest);
	
	});


}