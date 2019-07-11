import React from 'react';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';

class CalendarMode extends React.Component {
  render() {
    return (
      <div style={{flex:1,height:'100%'}}>
        <Calendar
          eventKeyword=""
          events={[]}
          defaultActiveTab="month"
          height={'calc(100vh - 166px)'}
        />
      </div>
    );
  }
}

export default CalendarMode;
