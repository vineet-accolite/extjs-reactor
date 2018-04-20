import React, { Component } from 'react';
import { Toolbar, Container, Panel, Button, Indicator, SegmentedButton, ToolTip } from '@extjs/ext-react';

export default class WizardExample extends Component {

    state = {
        step: 0,
        tapMode: 'direction'
    }

//     <ToolTip maxWidth="300" align="t-b" anchor html={`
//     <div style={styles.tooltipHeader}>&lt;Indicator tapMode="direction" /&gt;</div>
//     <p>
//         Clicking on a dot in the indicator will move the wizard one step forward or backward depending on the side that was clicked.
//     </p>
// `}>
// </ToolTip>

    render() {
        const { step, tapMode } = this.state;
var t = <div style={styles.tooltipHeader}>&lt;Indicator tapMode="direction" /&gt;</div>
        return (
            <Container
                layout="vbox"
                padding={10}
                platformConfig={{
                    "!phone": {
                        height: 350,
                        width: 550
                    }
                }}            
            >


                <Container layout="hbox" margin="0 0 10 0">
                    <SegmentedButton value={this.state.tapMode} onChange={this.changeTapMode} defaultUI="toolbar-default">
                        <Button text="direction" value="direction" 
                          tooltip={{
                            maxWidth:"300",
                            html:`
                              <div style="font-weight:bold;font-size:14px;font-family:courier;">&lt;Indicator tapMode="direction" /&gt;</div>
                              <p>
                                Clicking on a dot in the indicator will move the wizard one step forward or backward depending on the side that was clicked.
                              </p>
                            `
                          }}>
                        </Button>
                        <Button text="item" value="item">
                            <ToolTip maxWidth="300" align="t-b" anchor html={`
                                <div style={styles.tooltipHeader}>&lt;Indicator tapMode="item" /&gt;</div>
                                <p>
                                    Clicking on a dot in the indicator will move the wizard to the corresponding step.
                                </p>
                            `}>
                            </ToolTip>
                        </Button>
                    </SegmentedButton>
                </Container>

                <Panel shadow activeItem={step} layout="card" flex={1}>
                    <Container padding="5 20" style={styles.step} html={`
                        <h1>Welcome to the Demo Wizard!</h1>

                        Step 1 of 3

                        Please click the "Next" button to continue...
                    `}>
                    </Container>
                    <Container padding={20} style={styles.step} html={`
                        Step 2 of 3

                        Almost there. Please click the "Next" button to continue...
                    `}>
                    </Container>
                    <Container padding="5 20" style={styles.step} html={`
                        <h1>Congratulations!</h1>

                        Step 3 of 3 - Complete
                    `}>
                    </Container>
                    <Toolbar docked="bottom" layout={{ type: 'hbox', align: 'center', pack: 'space-between' }}>
                        <Button 
                            disabled={step === 0} 
                            text="Previous" 
                            handler={this.previous} 
                            iconCls="x-fa fa-chevron-left"
                        />
                        <Indicator 
                            count={3} 
                            activeIndex={step} 
                            onNext={this.next} 
                            onPrevious={this.previous} 
                            tapMode={tapMode}
                            onIndicatorTap={this.onIndicatorTap} 
                        />
                        <Button 
                            disabled={step === 2} 
                            text="Next" 
                            handler={this.next} 
                            iconCls="x-fa fa-chevron-right" 
                            iconAlign="right"
                        />
                    </Toolbar>
                </Panel>
            </Container>
        )
    }

    previous = () => {
        this.setState({ step: this.state.step - 1 })
    }

    next = () => {
        this.setState({ step: this.state.step + 1 })
    }

    onIndicatorTap = (indicator, dot) => {
        this.setState({ step: dot })
    }

    changeTapMode = (button, value) => {
        this.setState({ tapMode: value })
    }
}

const styles = {
    step: {
        fontSize: '16px'
    },
    tooltipHeader: {
        fontWeight: 'bold',
        fontSize: '14px',
        fontFamily: 'courier'
    }
}