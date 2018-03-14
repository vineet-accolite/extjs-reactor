import React, { Component } from 'react';

import { SegmentedButton, Button, Panel, Toolbar } from '@extjs/ext-react';

export default class SegementedButtonExample extends Component {

    state = { 
        button1: 'low', 
        button2: 'low' 
    };
    //value={this.state.button1}  
    //value={this.state.button2} 

    render() {
        return (
            <Panel shadow={!Ext.os.is.Phone}> 
                <Toolbar shadow={false}>
                    <div style={{marginRight: '10px'}}>Default UI:</div>
                    <SegmentedButton 
                        onChange={(button, value) => this.setState({ button1: value })}
                    >
                        <Button value="low" text="Low"/>
                        <Button value="medium" text="Medium"/>
                        <Button value="high" text="High"/>
                    </SegmentedButton>
                </Toolbar>
                
                <Toolbar shadow={false}>
                    <div style={{marginRight: '10px'}}>Toolbar UI:</div>
                    <SegmentedButton 
                        defaultUI="toolbar-default" 
                        onChange={(button, value) => this.setState({ button2: value })}
                    >
                        <Button value="low" text="Low"/>
                        <Button value="medium" text="Medium"/>
                        <Button value="high" text="High"/>
                    </SegmentedButton>
                </Toolbar>
            </Panel>
        )
    }
}