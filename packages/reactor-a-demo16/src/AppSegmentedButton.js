import React, { Component } from 'react'
import { SegmentedButton, RootContainer, Button } from '@extjs/ext-react';
Ext.require('Ext.layout.HBox');

export default class AppSegmentedButton extends Component {

  state = { 
    button1: 'high', 
    button2: 'low' 
  };

  //value={this.state.button1}
  //<SegmentedButton 
  //value={this.state.button1}
  //onChange={(button, value) => this.setState({ button1: value })}
  //>

  render() {
    return (
    <RootContainer layout="hbox" cls="main-background">
      <SegmentedButton 
        value={this.state.button1}
        onChange={(button, value) => this.setState({ button1: value })}
      >
        <Button value="low" text="Low"/>
        <Button value="medium" text="Medium"/>
        <Button value="high" text="High"/>
      </SegmentedButton>
    </RootContainer>
    );
  }
}
