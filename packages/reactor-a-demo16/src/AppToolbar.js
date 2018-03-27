import React, { Component } from 'react'
import { RootPanel, Panel, Draw, Toolbar, Button, Spacer, Label } from '@extjs/ext-react';



export default class AppToolbar extends Component {

  render() {
    return (
      <RootPanel shadow layout="fit">
      <Toolbar docked="top">
          <div style={{fontSize: Ext.os.is.Phone ? '12px' : '14px'}}>Use your {Ext.supports.Touch ? 'finger' : 'mouse'} to paint on the surface below.</div>
          <Spacer/>
          <Button handler={this.clear} text="Clear"/>
      </Toolbar>
      </RootPanel>
    )
  }

}
