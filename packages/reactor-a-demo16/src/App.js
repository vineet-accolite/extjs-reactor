import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Panel, Button } from '@extjs/ext-react';
const REACT_VERSION = require('react').version

export default function App() {
  return (
    <Panel title={`React v${REACT_VERSION}`} layout="vbox">
      <Button text="two" flex={2}/>
      <Button text="one" flex={1}/>
    </Panel>
  )
}
