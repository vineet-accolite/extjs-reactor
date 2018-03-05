import React, { Component } from 'react'
//import {ExtReact} from '@extjs/ext-react';
import { RootContainer, Container, Button, TextField } from '@extjs/ext-react';

export default class App extends Component {
//export default function App() {

  componentWillMount() {
    this._refs = {};
  }

  componentDidMount() {
    console.log(`$$$$$$$$$$$$$$$$$`)
    console.log(this._refs[`textRefId`])
    this._refs[`textRefId`]._cmp.setLabelAlign('right')
//    this._refs[`textRefId`].setFocus();
  }

//https://github.com/facebook/react/issues/7371
  render() {
    return (
      <RootContainer>
        <Container layout="vbox" padding="20">
          <TextField ref={(c) => this._refs[`textRefId`] = c } label="Name" value="hi" anchor="100%"/>
          <TextField label="Email" value="there" anchor="100%"/>
        </Container>
      </RootContainer>
    )
  }
}
