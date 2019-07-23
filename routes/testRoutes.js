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
		const newTest = new Test({...req.body.test});
		await newTest.save();
		res.send(newTest);
	});

	//Update Test document based on id
	app.post("/tests/:id", async (req, res)=>{
		let updatedUser = await Test.findOneAndUpdate({_id:req.params.id},{notes:req.body.notes}, {new:true})
		res.send(updatedUser);
	});


}
