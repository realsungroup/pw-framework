import React from 'react';
import { getUserDesktop } from '../../../util/api';
import { Spin, message } from 'antd';
import HalfPanel from '../../components/HalfPanel';
import RequiredApps from './RequiredApps';
import OptionalApps from './OptionalApps';
import { FormattedMessage as FM } from 'react-intl';
import './WrokbenchSettingBody.less';
import http, { makeCancelable } from 'Util20/api';

export default class WorkbenchBody extends React.PureComponent {
  state = {
    loading: true,
    requiredApps: [],
    selectedApps: [],
    optionalApps: []
  };

  componentDidMount() {
    this.loadApps();
  }

  componentWillUnmount() {
    this.p1 && this.p1.cancel();
  }

  handleConfirmSelection = () => {
    this.loadApps();
  };

  handleRemoveApp = appId => {
    this.setState({
      selectedApps: this.state.selectedApps.filter(app => app.ResID !== appId)
    });
  };

  loadApps = async () => {
    this.p1 = makeCancelable(http().getUserDesktop());
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      this.setState({ loading: false });
      console.error(err.message);
      return message.error(err.message);
    }
    const requiredApps = res.data || [],
      selectedApps = res.userdefined || [];

    this.setState({ requiredApps, selectedApps, loading: false });
  };

  render() {
    const { requiredApps, selectedApps, loading } = this.state;

    return (
      <Spin spinning={loading}>
        <div className="workbench-setting-body">
          <HalfPanel
            title={<FM id="Setting.leftTitle" defaultMessage="必要的功能" />}
          >
            <RequiredApps apps={requiredApps} />
          </HalfPanel>
          <HalfPanel
            title={<FM id="Setting.rightTitle" defaultMessage="可选的功能" />}
          >
            <OptionalApps
              selectedApps={selectedApps}
              onRemoveApp={this.handleRemoveApp}
              onConfirmSelection={this.handleConfirmSelection}
            />
          </HalfPanel>
        </div>
      </Spin>
    );
  }
}
