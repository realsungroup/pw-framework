import React from 'react';
import qs from 'qs';
import './Reminder.less';
import { TableData } from 'Common/loadableCommon';

export default class Reminder extends React.Component {
  constructor(props) {
    super(props);
    const { resid, title, count, lngMtsID } = this.resolveQueryString();
    this.state = {
      resid: parseInt(resid, 10), // 某个提醒的表的 resid
      title, // 提醒的标题
      count, // 提醒的数量
      lngMtsID
    };
  }

  componentDidMount() {}

  resolveQueryString = () => {
    const querystring = this.props.location.search.substring(1);
    return qs.parse(querystring);
  };

  render() {
    const { resid, lngMtsID } = this.state;

    return (
      <div className="reminder">
        <TableData
          resid={resid}
          size="small"
          subtractH={180}
          hasResizeableBox
          hasAdd={false}
          hasModify={false}
          hasBeBtns={true}
          lngMtsID={lngMtsID}
        />
      </div>
    );
  }
}
