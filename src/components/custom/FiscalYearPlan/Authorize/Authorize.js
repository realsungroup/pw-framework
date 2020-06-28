import React from 'react';
import { List, message, Popconfirm, Button, Switch, Spin } from 'antd';
import http from '../../../../util20/api';
import { getItem } from '../../../../util20/util';
import './Authorize.less';

class Authorize extends React.Component {
  state = {
    data: [],
    authData: [],
    filterData: [],
    userCode: JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE,
    loading: false,
    loadingButtonId: ''
  };
  async componentDidMount() {
    this.setState({ loading: true });
    await this.getData();
    await this.getAuthData();
    this.setState({ loading: false });
  }

  getData = async () => {
    try {
      const res = await http().getTable({
        resid: '631381906960',
        cmswhere: `C3_611264173184 = '${this.props.plan.C3_609615869581}' and C3_613828994025 = '${this.props.plan.C3_609616006519}' and director = '${this.state.userCode}'`
      });
      this.setState({ data: res.data, filterData: res.data });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  getAuthData = async () => {
    try {
      const res = await http().getTable({
        resid: '611318802160',
        cmswhere: `C3_611265667729 = '${this.props.plan.C3_609615869581}' and C3_609617694934 = '${this.state.userCode}' and C3_611265267987 = 'Y'`
      });
      this.setState({ authData: res.data });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  handleAuthorize = record => async () => {
    // C3_611265257987 编号
    // C3_611265667729 财年
    // C3_611265267987 是否生效
    // C3_609617694934 经理编号
    const { authData } = this.state;
    this.setState({ loadingButtonId: record.C3_609622254861 });
    try {
      const res = await http().addRecords({
        resid: '611318802160',
        data: [
          {
            C3_611265257987: record.C3_609622254861,
            C3_609617694934: this.state.userCode,
            C3_611265667729: this.props.plan.C3_609615869581,
            C3_611265267987: 'Y'
          }
        ],
        isEditOrAdd: true
      });
      authData.push(res.data[0]);
      this.setState({ authData });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
    this.setState({ loadingButtonId: '' });
  };

  handleCancelAuthorize = record => async () => {
    this.setState({ loadingButtonId: record.C3_609622254861 });
    try {
      const auth = this.state.authData.find(
        item => item.C3_611265257987 === record.C3_609622254861
      );
      await http().removeRecords({
        resid: '611318802160',
        data: [
          {
            REC_ID: auth.REC_ID
          }
        ]
      });
      this.setState({
        authData: this.state.authData.filter(
          item => item.REC_ID !== auth.REC_ID
        )
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
    this.setState({ loadingButtonId: '' });
  };

  filterData = checked => {
    let { data, authData } = this.state;
    if (checked) {
      data = data.filter(item => {
        const isAuth = authData.find(
          i => i.C3_611265257987 === item.C3_609622254861
        );
        return !isAuth;
      });
    }
    this.setState({ filterData: data });
  };

  render() {
    const { loading, authData, loadingButtonId, filterData } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="authorize__container">
          <div className="authorize__header">
            <Switch
              checkedChildren="未授权"
              unCheckedChildren="全部"
              onChange={this.filterData}
            />
          </div>
          <List
            dataSource={filterData}
            bordered
            pagination={{ position: 'bottom', size: 20 }}
            renderItem={item => {
              const isAuth = authData.find(
                auth => auth.C3_611265257987 === item.C3_609622254861
              );
              return (
                <List.Item key={item.REC_ID}>
                  <div className="authorize__list__item">
                    <span className="authorize__list__employee-item">
                      {item.C3_609622263470}
                    </span>
                    <span className="authorize__list__employee-item">
                      {item.C3_611666091289}
                    </span>
                  </div>
                  {isAuth ? (
                    <Popconfirm
                      title="确定取消授权吗?"
                      onConfirm={this.handleCancelAuthorize(item)}
                    >
                      <Button
                        loading={loadingButtonId === item.C3_609622254861}
                        type="danger"
                      >
                        取消授权
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="确定授权吗?"
                      onConfirm={this.handleAuthorize(item)}
                    >
                      <Button
                        type="primary"
                        loading={loadingButtonId === item.C3_609622254861}
                      >
                        授权
                      </Button>
                    </Popconfirm>
                  )}
                </List.Item>
              );
            }}
          ></List>
        </div>
      </Spin>
    );
  }
}

export default Authorize;
