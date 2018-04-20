import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Panel, Container, Div, Button } from '@extjs/ext-react';
const REACT_VERSION = require('react').version

// export default function App() {
//   return (
//     <Panel title={`React v${REACT_VERSION}`} layout="vbox">
//       <Button text="two" flex={2}/>
//       <Button text="one" flex={1}/>
//     </Panel>
//   )
// }

export default class App extends Component {

  constructor() {
      super();

      this.state = {
          name: 'marc',
          toggle: true,
          style: 'padding:50px;fontSize:24px;height:200px;'
      };
  }

  handleClick() {
    this.setState(prevState => ({
      toggle: !prevState.toggle
    }));
    console.log('The link was clicked.');
  }


  render() {
    const { name, toggle, style } = this.state;
    return (

      <Panel 
      title={name}
      scrollable 
      >
        <Div style={style}>hello</Div>
      </Panel>
      
      
      )


  }

}

// <Div style={style} html={`<div>hi</div> ${name} - toggle is ${toggle}`}></Div>
// <Button text="Change Toggle" ontap={this.handleClick.bind(this)}></Button>


      
// <div>hello</div>
// <div className="app-event-name">
// mjg - {name} - <div>hi</div>

// </div>




// <div>
// <div className="app-event-name">mjg</div>
// <div className="app-event-name">mjg</div>
// </div>