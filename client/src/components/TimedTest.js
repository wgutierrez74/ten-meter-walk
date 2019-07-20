import React from 'react';



class TimedTest extends React.Component{

	state={
		started:false,
		stage: 0,
		time: 0,
		date: 0,
	}

	componentDidMount(){
		const count = this.props.count;
		document.getElementById(`reset-button${count}`).style.visibility="hidden";
		document.getElementById(`confirm-button${count}`).style.visibility="hidden";
	}


	resetTrial = () =>{
		const count = this.props.count;
		clearInterval(this.timerID);
		document.getElementById(`reset-button${count}`).style.visibility="hidden";
		document.getElementById(`confirm-button${count}`).style.visibility="hidden";
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

	tick = () =>{
		this.setState({
			time: ((Date.now() - this.state.date)/1000).toFixed(2)
		});
	}

	startTimer = () =>{
		const count = this.props.count;
		if(!this.state.started){
			document.getElementById(`reset-button${count}`).style.visibility="visible";
			let timerButton = document.getElementById(`timer-button${count}`);
			timerButton.innerHTML="Stop Test";
			timerButton.classList.remove("green");
			timerButton.classList.add("red");
			this.setState({
				started:true,
				stage: this.state.stage+1,
				date: Date.now()
			});
			this.timerID = setInterval(
				()=>this.tick(),
				10
				);
			return;
		}
		clearInterval(this.timerID);
		document.getElementById(`confirm-button${count}`).style.visibility="visible";
		document.getElementById(`timer-button${count}`).style.visibility="hidden";

	}

	submitTrial = () =>{
		const count = this.props.count;
		document.getElementById(`confirm-button${count}`).style.visibility="hidden";
		document.getElementById(`reset-button${count}`).style.visibility="hidden";
		
		this.props.submitTest(this.state.time);
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
				<button id={`timer-button${count}`} className="ui button green" onClick={this.startTimer}>Start Test</button>
				<button id={`reset-button${count}`} className="ui button yellow" onClick={this.resetTrial}>Reset</button>
				<button id={`confirm-button${count}`}className="ui button right floated blue" onClick={this.submitTrial}>Continue</button>
			</div>
		);
	}

}

export default TimedTest;