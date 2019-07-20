import React from 'react';
import axios from 'axios';

import TimedTest from './TimedTest';

class NewTest extends React.Component{
	//Yeah
	state={
		type: "Normal",
		count: 0,
		addTest: false,
		tests: [],
		name: "",
		device: "",
		averageTime: "",
		averageVelocity: "",
		error:"",
		finished: false
	} 

	componentDidMount = () =>{
		/*
		this.axios = axios.create({
			baseURL: 'http://localhost:5000'
		});
		*/
	}

	componentDidUpdate =() =>{
		if(this.state.count>2 && !this.state.finished){
			this.updateTestStats();
		}
	}

	renderError(){
		return(
			<div>
				Enter a name before submiting!!!
			</div>
		)
	}

	renderActive = (type) =>{
		if(type === this.state.type){
			return "active";
		}
	}

	submitTest = (test) =>{
		this.setState({
			count: this.state.count+1,
			tests: [...this.state.tests, test]
		});
	}

	generateTimedTest = (count) =>{
		return (
			<div className="ui padded segment">		
				<TimedTest count={count} submitTest={this.submitTest} />
			</div>
		);
	}

	addTimedTest = () =>{
		return (
			<React.Fragment>
				{this.state.count>=0?this.generateTimedTest(0):""}
				{this.state.count>=1?this.generateTimedTest(1):""}
				{this.state.count>=2?this.generateTimedTest(2):""}
			</React.Fragment>	
		);
	}

	updateTestStats = () =>{
		if(!this.state.finished){
			let averageTime = this.state.tests.reduce((accumulator, test) => parseFloat(accumulator) + parseFloat(test));
			console.log(averageTime);
			averageTime /= 3;
			const averageVelocity = (6/averageTime).toFixed(2);
			averageTime = averageTime.toFixed(2);					
			this.setState({
				averageTime,
				averageVelocity,
				finished:true
			});
		}
	}

	testComplete = () =>{
		if(this.state.count>2){
			return (
				<React.Fragment>
					<br/>
					<label><h3>Average Time: {this.state.averageTime} seconds</h3></label><br/>
					<label><h3>Average Velocity: {this.state.averageVelocity} m/s</h3></label><br/>
					<button onClick={this.completeTest} className="ui button huge primary">Submit Test</button>
				</React.Fragment>
			);
		}
	}

	completeTest = async () =>{
		
		if(this.state.name===""){
			this.setState({
				error: "Enter patients name before submitting!"
			});
			return;
		}

		const finalTest = {
			name: this.state.name,
			device: this.state.device,
			type: this.state.type,
			tests: this.state.tests,
			averageTime: this.state.averageTime,
			averageVelocity: this.state.averageVelocity

		}
	
		//const response = await this.axios.post("/tests", finalTest);

		const response = await axios.post("/tests", finalTest);

		console.log(response);
		//Indicate to user test has been updated upon recieving response.
		//Give user another button to start a new test.
	}

	render(){
		return (
			<div className="ui grid" style={{height: window.innerHeight *0.85}}>
				<div className="row">
					<div className="one wide column"></div>
					
					<div className="six wide column">
						<div className="ui form">
							<div className="field">
								<label><h3>Patient Name:</h3></label>
								<div className="ui input fluid">
									<input onChange={(e)=>this.setState({name:e.target.value})} placeholder="Patient name" />	
								</div>
							</div>
							<div className="field">
								<label><h3>Assistive Device and/or Brace Used:</h3></label>
								<div className="ui input fluid">
									<input onChange={(e)=>this.setState({device:e.target.value})} placeholder="Brace/Device used"/>
								</div>
							</div>
							<div className="field">
								<label><h3>Test Type:</h3></label>
								<div className="ui buttons">
									<button className={`ui button large ${this.renderActive("Normal")}`} onClick={()=>this.setState({type:"Normal"})}>Normal</button>
		  							<button className={`ui button large ${this.renderActive("Fast")}`} onClick={()=>this.setState({type:"Fast"})}>Fast</button>
								</div>
							</div>
							<div className="field" style={{marginTop:"5%"}}>
								{this.testComplete()}
							</div>
						</div>
					</div>

					<div className="one wide column"></div>
					
					<div className="seven wide column">
						{this.addTimedTest()}
					</div>
				</div>
			</div>
		);
	}

}


export default NewTest;