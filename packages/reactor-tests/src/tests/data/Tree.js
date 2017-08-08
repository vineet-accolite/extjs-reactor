import React, { Component } from 'react';
import { Container, Button } from '@extjs/ext-react';
import { Tree } from '@extjs/ext-react-treegrid';

export default class TreeTest extends Component {

    count = 0;

    state = {
        data: this.generateData()
    }

    render() {
        const { data } = this.state;
        return (
            <Container layout="vbox" fullscreen>
                <Button 
                    itemId="refresh" 
                    handler={() => this.setState({ data: this.generateData() })}
                    text="Refresh"
                />
                <Button 
                    itemId="clear"
                    handler={() => this.setState({ data: null })}
                    text="Clear"
                />
                <Tree data={data} flex={1}/>
            </Container>
        )
    }

    generateData() {
        const { count } = this;

        this.count++;

        return {
            text: 'Root ' + count,
            expanded: true,
            children: [
                { text: 'Child ' + count, leaf: true },
                { text: 'Child ' + count, leaf: true },
                { text: 'Child ' + count, leaf: true }
            ]
        }
    }
}
