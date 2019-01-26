import React from 'react';
import FunctionsHeader from '../components/FunctionsHeader';
import qs from 'qs';
import './Reminder.less';

export default class Reminder extends React.Component {
  constructor(props) {
    super(props);
    console.log({ props });
    const { resid, title, count } = this.resolveQueryString();
    this.state = {
      resid, // 某个提醒的表的 resid
      title, // 提醒的标题
      count // 提醒的数量
    };
  }

  componentDidMount() {}

  resolveQueryString = () => {
    const querystring = this.props.location.search;
    return qs.parse(querystring);
  };

  render() {
    const { resid, title, count } = this.state;
    return (
      <div className="reminder">
        <FunctionsHeader title={title} />
        {/* <LzUnitComponentContainer
          style={{
            position: 'absolute',
            top: '50px',
            left: '50%',
            width: '90%',
            // height: '80%',
            overflow: 'auto',
            transform: 'translateX(-50%)'
          }}
        >
          {!this.state.tabsData.length && this.state.hasLoading ? (
            <div className="reminder__no-tip">暂无提醒</div>
          ) : (
            this.renderContent()
          )}
        </LzUnitComponentContainer> */}
      </div>
    );
  }
}
