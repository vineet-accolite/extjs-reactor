import React, { Component } from 'react'
import { SegmentedButton, RootPanel, Toolbar, Button, Container } from '@extjs/ext-react';
Ext.require('Ext.layout.HBox');

export default class AppSegmentedButton extends Component {

  state = { 
    button1: 'high', 
    button2: 'low' 
  };

  render() {
    return (
      <RootPanel shadow={!Ext.os.is.Phone}> 
        <Toolbar shadow={false}>

        <Container>
          <div style={{marginRight: '10px'}}>Default UIx:</div>
        </Container>
        <SegmentedButton 
            value={this.state.button1}  
            onChange={(button, value) => this.setState({ button1: value })}
        >
            <Button value="low" text="Low"/>
            <Button value="medium" text="Medium"/>
            <Button value="high" text="High"/>
        </SegmentedButton>
        </Toolbar>
      </RootPanel>
    )
  }

}
