import React from 'react';
import { Modal } from 'semantic-ui-react';

//Displays timer to conduct TMW test
class TimedTrial extends React.Component{

	state={
		started:false,
		time: 0,
		date: 0,
		modal: false
	}

	componentDidMount(){
		//Hide Certian HTML buttons on load
		const count = this.props.count;
		document.getElementById(`reset-button${count}`).style.visibility="hidden";
		document.getElementById(`confirm-button${count}`).style.visibility="hidden";
		document.getElementById(`edit-button${count}`).style.visibility="hidden";
	}

	//Handles starting and stopping of timer
	timerActions = () =>{
		const count = this.props.count;
		//Start Timer
		if(!this.state.started){
			//Update styling and visibility of HTML buttons
			document.getElementById(`reset-button${count}`).style.visibility="visible";
			let timerButton = document.getElementById(`timer-button${count}`);
			timerButton.innerHTML="Stop Test";
			timerButton.classList.remove("green");
			timerButton.classList.add("red");
			
			this.setState({
				started:true,
				date: Date.now()
			});

			this.timerID = setInterval(()=>this.tick(),10);
			return;
		}
		//Stop Timer
		clearInterval(this.timerID);
		document.getElementById(`confirm-button${count}`).style.visibility="visible";
		document.getElementById(`edit-button${count}`).style.visibility="visible";
		document.getElementById(`timer-button${count}`).style.visibility="hidden";

	}

	//Updates state attribute time every 10ms
	tick = () =>{
		this.setState({
			time: ((Date.now() - this.state.date)/1000).toFixed(2)
		});
	}

	//Allows user to restart trial 
	resetTrial = () =>{
		const count = this.props.count;
		clearInterval(this.timerID);
		document.getElementById(`reset-button${count}`).style.visibility="hidden";
		document.getElementById(`confirm-button${count}`).style.visibility="hidden";
		document.getElementById(`edit-button${count}`).style.visibility="hidden";
		let timerButton = document.getElementById(`timer-button${count}`);
		timerButton.innerHTML="Start Test";
		timerButton.classList.remove("red");
		timerButton.classList.add("green");
		timerButton.style.visibility="visible";

		this.setState({
			time:0,
			date:0,
			started:false
		});
	}	

	//Sends trial data to parent component NewTest
	submitTrial = () =>{
		const count = this.props.count;
		document.getElementById(`confirm-button${count}`).style.visibility="hidden";
		document.getElementById(`reset-button${count}`).style.visibility="hidden";
		this.props.submitTrial(this.state.time);
	}

	//Render Modal when user wants to edit Trial time manually
	renderModal = () =>{
		if(this.state.modal){
			const content=this.generateModalContent();
			const actions=this.generateModalActions();
			return (
				<Modal open={true} size="tiny" onClose={()=>this.setState({modal:false})}>
					<Modal.Header>Edit Trial#{this.props.count+1}</Modal.Header>
					<Modal.Content>{content}</Modal.Content>
					<Modal.Actions>{actions}</Modal.Actions>
				</Modal>
			);
		}
	}
	
	//Modal content which allows user to manually edit trial time
	generateModalContent(){
		return (
			<div className="ui segment">
				<div className="six wide column"></div>
				<div className="four wide column">
					<div className="ui form">
						<div className="field">
							<label>Edit Trial Time</label>
							<input autoComplete="off" value={this.state.editedTime} onChange={(e)=>this.setState({editedTime:e.target.value})}/>
						</div>	
					</div>
				</div>
			</div>
		);
	}

	//Modal buttons which allow user to update trial time or exit without updating
	generateModalActions(){
		return (
			<React.Fragment>
				<button className="ui button primary" 
					onClick={()=>this.updateTrialTime(this.state.editedTime)}>
					Update Trial Time
				</button>
				<button className="ui button red" onClick={()=>this.setState({modal:false})}>Close</button>
			</React.Fragment>
		);
	}

	//Passes new trial time to parent component if input is a number
	updateTrialTime = (newTime) =>{
		newTime = Number(newTime);
		if(typeof newTime === "number" && !isNaN(newTime)){
			newTime=newTime.toFixed(2);
			this.props.updateTrial(newTime, this.props.count);
			this.setState({time:newTime, modal:false});
		}
		else{
			this.setState({modal:false})
		}
	}

	render(){
		const count = this.props.count;
		return(
			<div>
				<h3>
					Trial #{count+1}:
					&nbsp;&nbsp;
					<span id={`elapsed${count}`}>{this.state.time}</span>
				</h3>
				<button id={`timer-button${count}`} className="ui button green" onClick={this.timerActions}>Start Test</button>
				<button id={`edit-button${count}`} className="ui button right floated orange" onClick={()=>this.setState({modal:true, editedTime:this.state.time})}>Edit Trial</button>
				<button id={`confirm-button${count}`}className="ui button right floated blue" onClick={this.submitTrial}>Continue</button>
				<button id={`reset-button${count}`} className="ui button right floated yellow" onClick={this.resetTrial}>Reset</button>
				{this.renderModal()}
			</div>
		);
	}

}

export default TimedTrial;