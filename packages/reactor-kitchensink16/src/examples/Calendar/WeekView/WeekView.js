import React, { Component } from 'react';
import { Calendar_Week, Calendar_List, Container, SegmentedButton, Button, ToolTip } from '@extjs/ext-react-calendar';
import { Panel } from '@extjs/ext-react';
import './data';

export default class CalendarWeekViewExample extends Component {

  state = {
    calendarview: 'fullweek',
    visibleDays: 7,
    firstDayOfWeek: 0
  }

  store = Ext.create('Ext.calendar.store.Calendars', {
    autoLoad: true,
    proxy: {
      type: 'ajax',
      url: '/KitchenSink/CalendarWeek'
    }
  })
 
  changeCalendarView = (button, value) => {
    if (value == 'fullweek') {
      this.setState({ 
        calendarview: value,
        visibleDays: 7,
        firstDayOfWeek: 0
      })
    }
    else {
      this.setState({ 
        calendarview: value,
        visibleDays: 5,
        firstDayOfWeek: 0
      })
    }
  }

  render() {
      return (
        <Container
          layout="vbox"
          padding={10}
        >
          <Container layout="hbox" margin="0 0 10 0">
            <Container flex={1} padding="10 0 0 10" style={{fontSize:'20px'}} html={Ext.Date.format(new Date(),'F Y')}/>
            <SegmentedButton value={this.state.calendarview} onChange={this.changeCalendarView} defaultUI="toolbar-default">
                <Button text="Full Week" value="fullweek"/>
                <Button text="Work Week" value="workweek"/>
            </SegmentedButton>
          </Container>
          <Container
              flex={1}
              shadow
              layout="hbox"
          >
            <Panel
              title={'Calendars'}
              ui={'light'}
              width={150}
              bodyPadding={5}
              hidden={Ext.os.is.Phone}
            >
              <Calendar_List store={this.store}/>
            </Panel>
            <Calendar_Week
              store={this.store}
              flex={1}
              timezoneOffset={0}
              gestureNavigation={false}
              value={new Date()}
              firstDayOfWeek={this.state.firstDayOfWeek}
              visibleDays={this.state.visibleDays}
            />
          </Container>
        </Container>
      )
  }
}
