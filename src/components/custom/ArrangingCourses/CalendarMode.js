import React from 'react';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';

// class CalendarMode extends React.Component {
  const CalendarMode = (props)=>  {
    return (
  // render() {
    // return (
      <div style={{flex:1}}>
        <Calendar
          eventKeyword=""
          events={props.events}
          defaultActiveTab="month"
          height={'calc(100vh - 166px)'}
        />
      </div>
    );
  }
// }

export default CalendarMode;
