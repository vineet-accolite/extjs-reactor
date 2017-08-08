import React, { Component } from 'react';
import { Container, Panel, Mask, LoadMask } from '@extjs/ext-react';

export default class RelMasked extends Component {

    render() {
        return (
            <Container defaults={{ margin: 20 }}>
                <Panel height={300} width={300} title="LoadMask">
                    <LoadMask itemId="loadMask" message="Please Wait..."/>
                </Panel>
                <Panel height={300} width={300} title="Mask">
                    <Mask itemId="mask"/>
                </Panel>
            </Container>
        );
    }

}