import React, { Component } from 'react';
import { Container, Button } from '@extjs/ext-react';

export default class ReplaceNodeWithMarkup extends Component {

    state = {
        showChild: false
    }

    toggleChild = () => {
        this.setState({ showChild: !this.state.showChild })
    }

    render() {
        const { showChild } = this.state;

        return (
            <Container>
                <div>This tests that reactor's patching of ReactComponentEnvironment.replaceNodeWithMarkup correctly adds and removes components when switching between null and an ExtReact component within the render method of a composite component.</div>
                <Button itemId="toggleChild" text="Toggle Child" handler={this.toggleChild}/>
                <Container itemId="container" layout="hbox">
                    <Button text="Left"/>
                    <Child show={showChild}/>
                    <Button text="Right"/>
                </Container>
            </Container>
        )
    }
}

function Child({ show }) {
    return show ? <Button itemId="child" text="Middle"/> : null;
}

