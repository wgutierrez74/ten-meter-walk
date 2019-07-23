import React from "react";
import axios from "axios";
import { Modal } from 'semantic-ui-react'

import TimedTrial from "./TimedTrial";

//Beginning State for component
const freshState = {
		count: 0,
		type: "Normal",
		trials: [],
		name: "",
		device: "",
		notes:"",
		averageTime: "",
		averageVelocity: "",
		error:"",
		finished: false,
		modal: false,
		modalSize: "large",
		modalHeader:"",
		modalContent:"",
		modalActions:"",
		modalClose: () => this.setState({modal:false})
}

//Creates New Test Document
class NewTest extends React.Component{

	state={...freshState}

	componentDidUpdate =() =>{
		//Updates Trial stats if all three trials have been completed/updated
		if(this.state.count>2 && !this.state.finished){
			this.updateTrialStats();
		}
	}

	//Allows user to select between Fast or Normal speed for test
	renderActive = (type) =>{
		if(type === this.state.type){
			return "active";
		}
	}

	//Displays TimedTrials compnents on screen
	renderTimedTrial = () =>{
		return (
			<React.Fragment>
				{this.state.count>=0?this.generateTimedTrial(0):""}
				{this.state.count>=1?this.generateTimedTrial(1):""}
				{this.state.count>=2?this.generateTimedTrial(2):""}
			</React.Fragment>	
		);
	}

	//Creates new TimedTrial component
	generateTimedTrial = (count) =>{
		return (
			<div className="ui padded segment">		
				<TimedTrial updateTrial={this.updateTrial} count={count} submitTrial={this.submitTrial} />
			</div>
		);
	}

	//Add trial time to state attribute trials & update count to reflect how many TimedTrials should be rendered
	submitTrial = (trial) =>{
		this.setState({
			count: this.state.count+1,
			trials: [...this.state.trials, trial]
		});
	}

	//Update state attribute trials with new trial time
	updateTrial = (newTime, index) =>{
		//trial time hasn't been added to state component yet
		if(index>=this.state.trials.length){
			return;
		}
		let newTrials = [...this.state.trials]
		newTrials[index] = newTime;
		//3 Trials have not been completed yet
		if(this.state.count<=2){
			this.setState({
				trials:[...newTrials]
			})
		}
		else{
			//Trials have been completed.Finished set to false to call updateTrialStats
			this.setState({
				trials:[...newTrials],
				finished: false
			})
		}
	}

	//Calculate Average time and distance and end timed trials
	updateTrialStats = () =>{
		if(!this.state.finished){
			let averageTime = this.state.trials.reduce((accumulator, trial) => parseFloat(accumulator) + parseFloat(trial));
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

	//Display Submit button when all trials have been completed
	renderSubmitButton = () =>{
		if(this.state.count>2){
			return (
				<React.Fragment>
					<br/><button id="submit-test-button" type="submit" className="ui button huge primary">Submit Test</button>
				</React.Fragment>
			);
		}
	}

	//Uplad Test Doc with Patient info and Trial Data to DB
	submitTest = async (event) =>{
		event.preventDefault();
		
		const finalTest = {
			name: this.state.name,
			device: this.state.device,
			type: this.state.type,
			notes: this.state.notes,
			trials: this.state.trials,
			averageTime: this.state.averageTime,
			averageVelocity: this.state.averageVelocity,
		}
		//Prevent user from submitting document over and over again
		document.getElementById("submit-test-button").style.visibility="hidden";
		
		let response = await axios.post("/tests", {test:finalTest, date: new Date()});
		response = response.data;
		
		if(!response.error){
			//Test Doc saved properly, update state modal attributes to display test stats in modal 
			const header = `Test Statistics: ${response.name}`;
			const content = this.generateTestModalContent(response);
			const actions = this.generateTestModalActions();

			this.setState({
				modal:true, 
				modalSize:"large",
				modalContent:content,
				modalHeader: header,
				modalActions: actions,
				modalClose: this.props.resetChildren
			});
		}
		else{
			//Error saving Test Doc to DB, display modal showing errors
			document.getElementById("submit-test-button").style.visibility="visible";
			this.setState({
				modal:true,
				modalSize: "mini",
				modalContent: "Error with "+ response.error,
				modalHeader:"Error",
				modalActions: <button className="ui button red" onClick={()=>this.setState({modal:false})}>Exit</button>,
				modalClose: ()=>this.setState({modal:false})

			});
		}
		
	}

	//Modal Content upon successful save to DB
	generateTestModalContent(patientTest){
		return (
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
											<textarea id="patient-notes-modal" readOnly disabled rows="2"  value={patientTest.notes}></textarea>
										</div>
									</div>
								</div>
								<div className="seven wide column">
									<h4><span style={{textDecoration:"underline"}}>Average Trial Time: </span><br/>{patientTest.averageTime} seconds</h4>
									<h4><span style={{textDecoration:"underline"}}>Average Trial Velocity: </span><br/>{patientTest.averageVelocity} m/s</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
		);
	}

	//Modal actions upon succesful save to DB
	generateTestModalActions(){
		return (
			<React.Fragment>
				<button className="ui button green" onClick={()=>this.props.changeTab(0)}>Go to Test List Page</button>
				<button className="ui button yellow" onClick={this.props.resetChildren}>Create New Test</button>
			</React.Fragment>
		);
	}

	//Display Modal after successful save or errors with saving Test Doc
	renderModal(){
		if(this.state.modal){
			const {modalSize, modalHeader, modalContent, modalActions, modalClose} = this.state;
			return (
				<Modal size={modalSize} open={true} onClose={modalClose}>
					<Modal.Header>{modalHeader}</Modal.Header>
					<Modal.Content>{modalContent}</Modal.Content>
					<Modal.Actions>{modalActions}</Modal.Actions>
				</Modal>
			);
		}
	}

	render(){
		return (
			<React.Fragment>
			<div className="ui grid" style={{height: window.innerHeight *0.85}}>
				<div className="row">
				
					<div className="seven wide column">
						<form onSubmit={this.submitTest} className="ui form">
							<div className="field">
								<label><h3>Patient Name:</h3></label>
								<div className="ui input fluid" >
									<input required autoComplete="off" onChange={(e)=>this.setState({name:e.target.value})} placeholder="Patient name" />	
								</div>
							</div>
							<div className="field">
								<label><h3>Assistive Device and/or Brace Used:</h3></label>
								<div className="ui input fluid">
									<input autoComplete="off" onChange={(e)=>this.setState({device:e.target.value})} placeholder="Brace/Device used"/>
								</div>
							</div>
							<div className="field">
								<label><h3>Notes</h3></label>
								<div className="ui input fluid">
									 <textarea rows="2"  onChange={(e)=>this.setState({notes:e.target.value})} placeholder="Extra notes:"></textarea>
									
								</div>
							</div>
							<div className="field">
								<label><h3>Test Type:</h3></label>
								<div className="ui buttons">
									<button type="button" className={`ui button large ${this.renderActive("Normal")}`} onClick={()=>this.setState({type:"Normal"})}>Normal</button>
		  							<button type="button" className={`ui button large ${this.renderActive("Fast")}`} onClick={()=>this.setState({type:"Fast"})}>Fast</button>
								</div>
							</div>
							<div className="field">
								{this.renderSubmitButton()}
							</div>
						</form>
					</div>

					<div className="one wide column"></div>
					
					<div className="eight wide column">
						{this.renderTimedTrial()}
					</div>
				</div>
			</div>
			{this.renderModal()}
			</React.Fragment>
		);
	}

}


export default NewTest;