import React, { Component } from 'react'
import { TitleBar, Container, NestedList, Panel, Button, Transition } from '@extjs/ext-react';
Ext.require('Ext.layout.Fit');

export default class AppKSLayout extends Component {

  render() {

  //   const { 
  //     selectedNavNode, 
  //     component, 
  //     navStore, 
  //     files,
  //     children,
  //     showCode,
  //     showTree,
  //     actions,
  //     layout
  // } = this.props;

  var showCode = true
  var showTree = true




    return (
      <RootContainer layout="hbox" cls="main-background">
          <Container layout="fit" flex={4}>
              <TitleBar docked="top" shadow style={{zIndex: 2}}>
                  <Button 
                      align="left"
                      iconCls="x-fa fa-bars" 
                      handler={actions.toggleTree}
                  />
                  <div className="ext ext-sencha" style={{margin: '0 5px 0 7px', fontSize: '20px', width: '20px'}}/>
                  <a href="#" className="app-title">ExtReact Kitchen Sink</a>
              </TitleBar>
           </Container>
          { files && (
              <Button 
                  align="right" 
                  iconCls={'x-font-icon ' + (showCode ? 'md-icon-close' : 'md-icon-code') }
                  ui="fab" 
                  top={Ext.os.is.Desktop ? 20 : 35}
                  right={21}
                  zIndex={1000}
                  handler={actions.toggleCode} 
              /> 
            )} 
          { files && (
              <Panel 
                  resizable={{ edges: 'west', dynamic: true }} 
                  flex={2}
                  layout="fit" 
                  width={0}
//                            width={showCode ? 400 : 0}
                  collapsed={!showCode}
                  header={false}
                  collapsible={{ direction: 'right' }}
                  shadow 
                  style={{zIndex: 3, backgroundColor: 'white'}} 
                  hideAnimation={{type: 'slideOut', direction: 'right', duration: 100, easing: 'ease' }}
                  showAnimation={{type: 'slideIn', direction: 'left', duration: 100, easing: 'ease' }}
              >
                  <Files files={files} /> 
              </Panel>
          )}
      </RootContainer>
  );
  }
}
