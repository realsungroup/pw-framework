import React from 'react';
import './AttendanceApply.less';
import { Card } from 'antd';
import img1Large from './img/1-large.png';
import img2Large from './img/2-large.png';
import CustomForm1 from './CustomForm1';
import CustomForm2 from './CustomForm2';
import WorkOverTimeApply from '../WorkOvertimeApply';

const { Meta } = Card;

/**
 * 考勤申请
 * @author 邓铭
 */

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
    const {
      showAllminute,
      showWorkOvertimeOptions,
      showChooseAllDay
    } = this.props;

    let page = null;
    switch (current) {
      case 1:
        // 加班申请
        page = (
          <CustomForm1
            goBack={this.goBack}
            getNotices={this.props.getNotices}
            showAllminute={showAllminute}
            showChooseAllDay={showChooseAllDay}
            showWorkOvertimeOptions={showWorkOvertimeOptions}
          />
        );
        break;
      case 2:
        // 补刷卡申请表单
        page = (
          <CustomForm2
            goBack={this.goBack}
            getNotices={this.props.getNotices}
          />
        );
        break;
      case 3:
        // 加班批量申请
        page = (
          <WorkOverTimeApply
            goBack={this.goBack}
            getNotices={this.props.getNotices}
            setLoading={this.props.setLoading}
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
    const { showBatchApply } = this.props;
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
            {showBatchApply && (
              <Card
                hoverable
                cover={<img alt="example" src={img1Large} />}
                onClick={this.onCardClick(3)}
              >
                <Meta title="加班批量申请" description="加班批量申请点这里" />
              </Card>
            )}
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
