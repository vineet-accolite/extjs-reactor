import React, { Component } from 'react';
import { TabPanel, Panel, Container } from '@extjs/ext-react'; 

Ext.require('Ext.layout.overflow.Scroller');

export default class ScrollingTabsExample extends Component {

    render() {
        return (
            <TabPanel 
                shadow 
                tabBar={{
                    layout: {
                        pack: 'start',
                        overflow: 'scroller'
                    }
                }} 
                platformConfig={{
                    "!phone": {
                        height: 600,
                        width: 400 
                    }
                }}
                defaults={{
                    layout: "center",
                    cls: 'card',
                    bodyPadding: 0,
                    tab: {
                        minWidth: 130
                    }
                }}
            >
                <Panel title="Home" layout="center">
                    <Container html="You can set <code>{`layout: { overflow: 'scroller' }`}</code> on the <code>tabBar</code> prop in combination with a <code>minWidth</code> on each tab to make the tab bar scroll when it runs out of room."></Container>
                </Panel>
                <Panel title="Politics" layout="center"><Container>Politics</Container></Panel>
                <Panel title="Entertainment" layout="center"><Container>Entertainment</Container></Panel>
                <Panel title="World" layout="center"><Container>World</Container></Panel>
                <Panel title="Markets" layout="center"><Container>Markets</Container></Panel>
                <Panel title="Sports" layout="center"><Container>Sports</Container></Panel>
            </TabPanel>
        )
    }

}