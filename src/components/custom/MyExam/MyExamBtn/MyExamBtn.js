import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Steps, Button, message } from 'antd';
import './MyExamBtn.less';
import http from 'Util20/api';
import moment from 'moment';

function noop() {}

/**
 * 我的考试按钮
 */
export default class MyExamBtn extends React.Component {
  static propTypes = {
    /**
     * 记录
     * 默认：-
     */
    record: PropTypes.object.isRequired
  };

  static defaultProps = {
    loading: true,
    onJoinConfirm: noop,
    onContinueExam: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      hasRequest: false, // 是否已请求了
      data: []
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.hasRequest !== this.state.hasRequest ||
      nextState.data !== this.state.data
    ) {
      return true;
    }
    return false;
  }

  getData = async () => {
    const { record } = this.props;

    // 考试安排编号
    const arrangeNum = record.C3_607197284004;
    // 试卷编号
    const examNum = record.C3_609936321951;
    // 人员编号
    const personNum = record.C3_607197253817;

    let res;
    try {
      res = await http().getTable({
        resid: 608809112309,
        cmswhere: `C3_607195889817 = '${arrangeNum}' and C3_607195947239 = '${examNum}' and C3_607195966239 = '${personNum}'`
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ data: res.data, hasRequest: true });
  };

  isShowJoinBtn = record => {
    // 参加考试次数是否大于 0
    if (record.C3_610137428463 <= 0) {
      return false;
    }

    // 判断是否在有效日期时间之前
    const timeStr = record.C3_610709944031;
    // 有效日期为空！
    if (!timeStr) {
      return false;
    }
    const validTimeUnix = moment(timeStr).unix();
    const now = moment().unix();
    if (now >= validTimeUnix) {
      return false;
    }

    // 判断是否通过，如果已通过，则不显示 参加考试 按钮
    if (record.C3_610754790085 === '通过') {
      return false;
    }

    return true;
  };

  render() {
    const { hasRequest, data } = this.state;
    const { record, onJoinConfirm, onContinueExam } = this.props;
    if (!hasRequest) {
      return (
        <Button icon="loading" disabled>
          请稍等
        </Button>
      );
    }

    // 该考试不能参加
    if (!this.isShowJoinBtn(record)) {
      return null;
    }

    // 还没有参加过考试，且在参加考试的条件内
    if (!data.length) {
      return (
        <Button
          onClick={onJoinConfirm}
          style={{ margin: '0 4px' }}
          type="primary"
        >
          参加考试
        </Button>
      );
    }

    // C3_607198887973
    const tempDataItem = data.find(
      dataItem => dataItem.C3_607198887973 !== 'Y'
    );
    // 参加过考试，且有考试未提交
    if (tempDataItem) {
      return (
        <Button
          onClick={onJoinConfirm}
          style={{ margin: '0 4px' }}
          type="primary"
          onClick={() => onContinueExam(record, tempDataItem)}
        >
          继续考试
        </Button>
      );
    }

    // 参加过考试，且所有考试都提交了
    return (
      <Button
        onClick={onJoinConfirm}
        style={{ margin: '0 4px' }}
        type="primary"
      >
        参加考试
      </Button>
    );
  }
}
