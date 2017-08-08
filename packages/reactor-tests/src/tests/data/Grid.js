import React, { Component } from 'react';
import { Container, Button, Grid, Column } from '@extjs/ext-react';

export default class GridTest extends Component {

    count = 0;

    constructor() {
        super();

        this.state = {
            data: this.generateData()
        };
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
                <Grid data={data} flex={1}>
                    <Column dataIndex="text" text="Text" flex={1} />
                </Grid>
            </Container>
        )
    }

    generateData() {
        const { count } = this;

        this.count++;

        return [
            { text: 'Row 1, ' + count },
            { text: 'Row 2, ' + count },
            { text: 'Row 3, ' + count }
        ]
    }
}
