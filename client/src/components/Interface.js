import React from 'react';

import TestList from './TestList';
import NewTest from './NewTest';

class Interface extends React.Component{

	state = {selectedTab: 0}

	renderTab = () =>{
		if(this.state.selectedTab === 0){
			return <TestList />
		}
		else{
			return <NewTest />
		}
	}

	renderActive = (tabNum) =>{
		if(tabNum === this.state.selectedTab){
			return "active";
		}
	}
	
	render(){
		return(
			<React.Fragment>
				<div className="ui secondary pointing menu" style={{backgroundColor:"white"}}>
				  <button className={`ui button item ${this.renderActive(0)}`} onClick={()=>this.setState({selectedTab:0})}>
				    Tests:
				  </button>
				  <button className={`ui button item ${this.renderActive(1)}`} onClick={()=>this.setState({selectedTab:1})}>
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