import React, { Fragment } from 'react';
import { message } from 'antd';
import LzPersonCA from '../LzPersonCA';
import { getMainTableData } from 'Util/api';

const resid = 593257182832;
const subresid = 593257166942;

/**
 * 个人考勤
 */
export default class LzMyCA extends React.Component {
  static propTypes = {};

  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      record: null
    };
  }

  componentDidMount = () => {
    this.getRecord();
  };

  getRecord = async () => {
    let userInfo;
    try {
      userInfo = JSON.parse(localStorage.getItem('userInfo'));
    } catch (err) {
      return message.error(err.message);
    }
    const pnid = userInfo.UserInfo.EMP_USERCODE;
    let res;
    try {
      res = await getMainTableData(resid, {
        cmswhere: `PNID = ${pnid}`
      });
    } catch (err) {
      return message.error(err.message);
    }
    if (res.data.length !== 1) {
      return;
    }
    this.setState({ record: res.data[0] });
  };

  render() {
    return (
      <Fragment>
        {this.state.record && (
          <LzPersonCA
            record={this.state.record}
            resid={resid}
            subresid={subresid}
          />
        )}
      </Fragment>
    );
  }
}
