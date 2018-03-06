import React, { Component } from 'react'
import { TitleBar, RootContainer, Button } from '@extjs/ext-react';
Ext.require('Ext.layout.Fit');

export default class AppKitchenSinkTitle extends Component {

  render() {
    return (
      <RootContainer layout="fit" flex={4}>
      <TitleBar docked="top" shadow style={{zIndex: 2}}>
          <Button 
              align="left"
              iconCls="x-fa fa-bars" 
          />
          <div className="ext ext-sencha" style={{margin: '0 5px 0 7px', fontSize: '20px', width: '20px'}}/>
          <a href="#" className="app-title">ExtReact Kitchen Sink</a>
      </TitleBar>
      </RootContainer>
    )
  }
}
