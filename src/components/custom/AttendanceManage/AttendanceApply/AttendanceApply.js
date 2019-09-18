import React from 'react';
import './AttendanceApply.less';
import { Card } from 'antd';
import img1Large from './img/1-large.png';
import img2Large from './img/2-large.png';
import CustomForm1 from './CustomForm1';
import CustomForm2 from './CustomForm2';

const { Meta } = Card;

class AttendanceApply extends React.Component {
  state = {
    current: 0,
    isIndex: true
  };
  onCardClick = current => {
    return () =>
      this.setState({
        isIndex: false,
        current: current
      });
  };

  goBack = () => {
    this.setState({
      isIndex: true,
      current: 0
    });
  };

  renderForm() {
    const { current } = this.state;
    let page = null;
    switch (current) {
      case 1:
        page = (
          <CustomForm1
            goBack={this.goBack}
            getNotices={this.props.getNotices}
          />
        );
        break;
      case 2:
        page = (
          <CustomForm2
            goBack={this.goBack}
            getNotices={this.props.getNotices}
          />
        );
        break;
      default:
        break;
    }
    return page;
  }

  render() {
    const { isIndex } = this.state;
    return (
      <div className="attendace-aplly">
        {isIndex ? (
          <div className="attendace-aplly__index">
            <Card
              hoverable
              cover={<img alt="example" src={img1Large} />}
              onClick={this.onCardClick(1)}
            >
              <Meta title="填写申请" description="我要请假/加班" />
            </Card>
            <Card
              hoverable
              cover={<img alt="example" src={img2Large} />}
              onClick={this.onCardClick(2)}
            >
              <Meta title="补刷卡申请" description="忘记刷卡点这里" />
            </Card>
          </div>
        ) : (
          this.renderForm()
        )}
      </div>
    );
  }
}

export default AttendanceApply;
