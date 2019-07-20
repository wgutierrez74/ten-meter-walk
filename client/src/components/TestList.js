import React from 'react';
import axios from 'axios';

class TestList extends React.Component{
	
	state = {
		testList:[],
		filter:"",
		selected: -1,
		currentPatient:{
			name:""
		}
	}

	getTests = async () =>{
		return; 
	}

	componentDidMount = async () =>{
		/*
		this.axios = axios.create({
			baseURL: 'http://localhost:5000'
		});
		let testList = await this.axios.get("/tests");
		*/
		let testList = await axios.get("tests");
		testList = testList.data;
		this.setState({testList});
	}

	componentDidUpdate(){
		//console.log(this.state.filter);
	}

	renderPatientTest = () =>{
		if(this.state.selected===-1){
			return;
		}
		const patient = this.state.testList.filter((test)=>test._id===this.state.selected);
		return (
			<React.Fragment>
				<div className="ui divider"></div>
				<div className="ui segment">
					<h4>Test Date: {patient[0].date}</h4>
					<h4>Test Type: {patient[0].type}</h4>
					<h4>Assitive Device/Brace: {patient[0].device === "" ? "None" : patient[0].device}</h4>
					<h4>Trial #1: {patient[0].tests[0]} s</h4>
					<h4>Trial #2: {patient[0].tests[1]} s</h4>
					<h4>Trial #3: {patient[0].tests[2]} s</h4>
					<h4>Average Test Time: {patient[0].averageTime} seconds</h4>
					<h4>Average Test Velocity: {patient[0].averageVelocity} m/s</h4>
				</div>
			</React.Fragment>
		);
	} 

	renderPatients = () =>{
		let patients = this.state.testList.filter((test)=> test.name.toLowerCase().includes(this.state.filter.toLowerCase()));
		return patients.map((patient, index)=>{
			return ( 
				<div key={index} className="item" onClick={()=>this.setState({selected: patient._id, currentPatient: patient})}>
					<div className="content">
						<div className="header">
							{patient.name}
						</div>
						{patient.date}
					</div>
				</div>
				
			);
		});
	}

	renderPatientList = () =>{
		if(this.state.testList.length > 0){
			return (
				<div className="ui segment">
					<div className="ui relaxed divided selection list" style={{overflowY:"scroll"}}>
						{this.renderPatients()}
					</div>
				</div>
			);
		}
	}

	render(){
		return (
			<div className="ui grid" style={{height: window.innerHeight*0.85}}>
				<div className="one wide column"></div>

				<div className="six wide column">
					<h3>Select a patient to see their TMW test results:</h3>
					<div className="ui input fluid">
						<input className="ui input focus" onChange={(e)=>this.setState({filter:e.target.value})} placeholder="Search for patient"/>
					</div>
					{this.renderPatientList()}
				</div>
				
				<div className="one wide column"></div>

				<div className="seven wide column">
					<h3>Test Results: {this.state.currentPatient.name}</h3>
					{this.renderPatientTest()}
				</div>
			</div>
		);
	}

}


export default TestList;