import React, { Component } from 'react';
import { Container, Button } from '@extjs/ext-react';

export default class UpdateFunctions extends Component {

    state = {
        value: 0
    };

    render() {
        const { value } = this.state;

        return (
            <Container>
                <Button text="handler"
                    handler={() => this.setState({ value: value + 1 })} 
                />
                <Button text="tap"
                    onTap={() => this.setState({ value: value + 1 })} 
                />
                <div id="value">{ value }</div>
            </Container>
        )
    }

}