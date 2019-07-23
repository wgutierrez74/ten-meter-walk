const mongoose = require("mongoose");

const Test = mongoose.model("Test");

module.exports = (app) =>{

	//Serve all test documents
	app.get("/tests", async (req, res)=>{
		const tests = await Test.find().sort({created:-1});
		res.send(tests);
	});

	//Create new test document
	app.post("/tests", async (req, res)=>{
		let dateObj = new Date(req.body.date);
		const date = convertDateObject(dateObj);

		const newTest = new Test({
			...req.body.test,
			date,
			created: dateObj
		});

		newTest.save();
		res.send(newTest);
	});

	//Update Test document based on id
	app.post("/tests/:id", async (req, res)=>{
		let updatedUser = await Test.findOneAndUpdate({_id:req.params.id},{notes:req.body.notes}, {new:true})
		res.send(updatedUser);
	});


}

convertDateObject = (date) =>{
	const month = date.getMonth() + 1; //months from 1-12
	const day = date.getDate();
	const year = date.getFullYear();
	let minutes = date.getMinutes();
	minutes = minutes < 10 ? "0" + minutes : minutes
	let hour = date.getHours();
	let suffix = hour > 11 ? "PM" : "AM";
	hour = hour%12;
	hour = hour === 0 ? 12 : hour

	//Date String mm/dd/yyyy hh:mm xm
	return (month + "/" + day + "/" +year + " " + hour+":"+minutes+" "+ suffix);
}