import React from 'react';

import TestList from './TestList';
import NewTest from './NewTest';

//Component which switch between two Main App views, TestList and NewTest
class Interface extends React.Component{

	//Selected Tab determines which View to display and key helps with re-rendering child components
	state = {
		selectedTab: 0, 
		key:0
	}

	renderActive = (tabNum) =>{
		if(tabNum === this.state.selectedTab){
			return "active";
		}
	}

	changeTab = (tabNum) =>{
		this.setState({selectedTab: tabNum});
	}

	renderTab = () =>{
		if(this.state.selectedTab === 0){
			return <TestList />
		}
		else{
			return <NewTest changeTab={this.changeTab} resetChildren={this.resetChildren}/>
		}
	}
	
	resetChildren = () =>{
		this.setState({key:this.state.key+1});
	}

	render(){
		return(
			<React.Fragment key={this.state.key}>
				<div className="ui secondary pointing menu" style={{backgroundColor:"white"}}>
				  <button className={`ui button item ${this.renderActive(0)}`} onClick={()=>this.changeTab(0)}>
				    Tests:
				  </button>
				  <button className={`ui button item ${this.renderActive(1)}`} onClick={()=>this.changeTab(1)}>
				    New Test:
				  </button>
				</div>
				<div className="ui segment">
				  {this.renderTab()}
				</div>
			</React.Fragment>
		);
	}

}

export default Interface;