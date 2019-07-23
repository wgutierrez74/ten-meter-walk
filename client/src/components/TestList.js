import React from 'react';
import axios from 'axios';

/*
Dispaly all Test Documents
Users can update notes of completed Test Documents
*/
class TestList extends React.Component{
	
	state = {
		testList:[],
		filter:"",
		selected: -1,
		currentPatient:{
			name:""
		},
		update:false,
		updatedPatientNotes:""
	}

	//Retrieve Test Documents from DB
	componentDidMount = async () =>{
		let testList = await axios.get("tests");
		testList = testList.data;
		this.setState({testList});
	}

	//Render List of Patient's Test Documnets
	renderPatientList = () =>{
		if(this.state.testList.length > 0){
			return (
				<div className="ui segment">
					<div className="ui relaxed divided selection list" style={{overflowY:"scroll", height:window.innerHeight*0.60}}>
						{this.renderPatients()}
					</div>
				</div>
			);
		}
	}

	renderPatients = () =>{
		let patients = this.state.testList.filter((test)=> test.name.toLowerCase().includes(this.state.filter.toLowerCase()));
		return patients.map((patient, index)=>{
			return ( 
				<div key={index} className="item" onClick={()=>this.selectPatientTest(patient)}>
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

	//Update state to reflect that a patient's Test document has been selected
	selectPatientTest = (patient) =>{
		if(this.state.update){
			this.cancelUpdate();
		}
		this.setState({
			selected: patient._id,
			currentPatient: patient,
			updatedPatientNotes: patient.notes,
		});
	}


	renderPatientTest = () =>{
		//No Selection made
		if(this.state.selected===-1){
			return;
		}
		//Display Test Doc information
		const patientTest = this.state.testList.filter((test)=>test._id===this.state.selected)[0];
		return (
			<React.Fragment>
				<div className="ui divider"></div>
				<div className="ui segment">
					<div className="container">
						<div className="ui grid">
							<div className="row" style={{marginTop:"1%"}}>
								<div className="nine wide column">
									<h4><span style={{textDecoration:"underline"}}>Test Date:</span> <br/>{patientTest.date}</h4>
									<h4><span style={{textDecoration:"underline"}}>Assitive Device/Brace:</span> <br/>{patientTest.device === "" ? "None" : patientTest.device}</h4>
									<h4><span style={{textDecoration:"underline"}}>Test Type: </span><br/>{patientTest.type}</h4>
								</div>
								<div className="seven wide column">
									<h4><span style={{textDecoration:"underline"}}>Trials:</span><br/>
									<span className="detail">Trial #1: &nbsp;{patientTest.trials[0]} s</span><br/>
									<span className="detail">Trial #2: &nbsp;{patientTest.trials[1]} s</span><br/>
									<span className="detail">Trial #3: &nbsp;{patientTest.trials[2]} s</span>
									</h4>
								</div>
							</div>
							<div className="row">
								<div className="nine wide column">
									<h4 style={{textDecoration:"underline"}}>Test Notes:</h4>
									<div className="ui form">
										<div className="field">
											<textarea id="patient-notes" readOnly disabled onChange={(e)=>this.setState({updatedPatientNotes:e.target.value})} rows="2"  value={this.state.updatedPatientNotes}></textarea>
										</div>
									</div>
								</div>
								<div className="seven wide column">
									<h4><span style={{textDecoration:"underline"}}>Average Trial Time: </span><br/>{patientTest.averageTime} seconds</h4>
									<h4><span style={{textDecoration:"underline"}}>Average Trial Velocity: </span><br/>{patientTest.averageVelocity} m/s</h4>
								</div>
							</div>
							<div className="row" style={{marginTop:"1%"}}>
								<div className="one wide column"></div>
								<div className="eight wide column">
									<button id="update-notes-button" className="ui button yellow" onClick={this.handleUpdates}>Update Test Notes</button>
									<button id="cancel-update-button"style={{visibility:"hidden"}} className="ui button orange" onClick={this.cancelUpdate}>Cancel</button>
								</div>
							</div>
						</div>
					</div>
				
				</div>
			</React.Fragment>
		);
	} 

	handleUpdates = async () =>{
		//Allow editing of notes in Test doc and update HTML elements
		if(!this.state.update){
			let updateButton = document.getElementById("update-notes-button");
			updateButton.classList.remove("yellow");
			updateButton.classList.add("primary");
			updateButton.innerHTML="Save Changes";
			document.getElementById("cancel-update-button").style.visibility="visible";

			let patientNotes = document.getElementById("patient-notes");
			patientNotes.readOnly=false;
			patientNotes.disabled=false;

			this.setState({update:true});
			return;
		}
		//Update test notes
		let response = await axios.post(`tests/${this.state.currentPatient._id}`, {notes: this.state.updatedPatientNotes});
		response = response.data;
		
		//Update state attribute testList with proper test doc
		let newTestList = [...this.state.testList];
		let index;
		for(let i=0; i<this.state.testList.length;i++){
			if(response._id === this.state.testList[i]._id){
				index=i;
				break;
			}
		}
		newTestList[index]=response;
		this.setState({
			testList: [...newTestList],
			currentPatient: response
		});
		this.cancelUpdate();

	}

	//Do not update Test Doc and revert HTML elements to initial states
	cancelUpdate = () =>{
		let updateButton = document.getElementById("update-notes-button");
		updateButton.classList.remove("primary");
		updateButton.classList.add("yellow");
		updateButton.innerHTML="Update Test Notes";
		document.getElementById("cancel-update-button").style.visibility="hidden";

		let patientNotes = document.getElementById("patient-notes");
		patientNotes.readOnly=true;
		patientNotes.disabled=true;

		this.setState({update:false, updatedPatientNotes:this.state.currentPatient.notes});
	}

	render(){
		return (
			<div className="ui grid" style={{height: window.innerHeight*0.85, overflowY:"hidden"}}>
				<div className="six wide column">
					<h3>Select a patient to see their TMW test results:</h3>
					<div className="ui input fluid">
						<input autoComplete="off" className="ui input focus" onChange={(e)=>this.setState({filter:e.target.value})} placeholder="Search for patient"/>
					</div>
					{this.renderPatientList()}
				</div>
				
				<div className="one wide column"></div>

				<div className="nine wide column">
					<h3>Test Results: {this.state.currentPatient.name}</h3>
					{this.renderPatientTest()}
				</div>
			</div>
		);
	}

}

export default TestList;