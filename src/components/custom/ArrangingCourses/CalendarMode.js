import React from 'react';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';

class CalendarMode extends React.Component {
  render() {
    return (
      <div style={{flex:1,height:'100%',overflow:'auto'}}>
        <Calendar
          eventKeyword=""
          events={[]}
          defaultActiveTab="month"
        ></Calendar>
      </div>
    );
  }
}

export default CalendarMode;
