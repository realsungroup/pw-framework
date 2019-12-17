import React from 'react';
import qs from 'qs';
import './Reminder.less';
import { TableData } from 'Common/loadableCommon';

export default class Reminder extends React.Component {
  constructor(props) {
    super(props);
    const { resid, title, count, lngMtsID } = this.resolveQueryString();
    this.state = {
      resid, // 某个提醒的表的 resid
      title, // 提醒的标题
      count, // 提醒的数量
      lngMtsID
    };
  }

  componentDidMount() {}

  componentDidUpdate() {
    const { resid: _resid, lngMtsID } = this.resolveQueryString();
    const { resid } = this.state;
    if (_resid != resid) {
      this.setState({
        resid: _resid,
        lngMtsID
      });
    }
  }

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
          key={resid}
          size="small"
          subtractH={180}
          height={600}
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
