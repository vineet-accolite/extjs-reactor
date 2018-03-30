import React, { Component } from 'react';
import { Panel, TabBar, Container } from '@extjs/ext-react';
import { connect } from 'react-redux';
import { setTitle } from '../actions';
import { loadEvent } from './actions';
import days from '../util/days';

class Event extends Component {

    render() {
        const { record, header=true, ...props } = this.props;
        const data = record && record.data;
        const day = data && data.date && data.date.match(/(Monday|Tuesday|Wednesday)/)[1];
        const speaker = data && data.speakers && data.speakers.length > 0 && data.speakers.map(s => s.name).join(', ');

        const speakers = data.speakerNames ? `by ${data.speakerNames}` : ''
        const fullDay = day + ':  ' + data.start_time + ' - ' + data.end_time

        return (
            <Panel 
                {...props}
                padding="20" 
                scrollable 
                header={header}
                tools={header && { close: () => location.hash = '/schedule' }}
            >
              { data && (
                <Container>
                  <Container className="app-event-name" html={data.title} />
                  <Container className="app-event-speaker" html={speakers} />
                  <Container className="app-event-time" html={fullDay} />
                  <Container className="app-event-location" html={data.location.name} />
                  <Container html='<br/><hr>' />
                  <Container className="app-event-location" html={data.description} />
                </Container>
              )}
            </Panel>
        )
    }

}

const mapStateToProps = ({event}) => {
    return event;
}

export default connect(mapStateToProps)(Event);