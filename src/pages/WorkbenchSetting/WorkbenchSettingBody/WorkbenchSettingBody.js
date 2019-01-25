import React from 'react';
import { getUserDesktop } from '../../../util/api';
import { Spin, message } from 'antd';
import PageBody from '../../components/PageBody';
import HalfPanel from '../../components/HalfPanel';
import RequiredApps from './RequiredApps';
import OptionalApps from './OptionalApps';
import './WrokbenchSettingBody.less';

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

  handleConfirmSelection = () => {
    this.loadApps();
  };

  handleRemoveApp = appId => {
    this.setState({
      selectedApps: this.state.selectedApps.filter(app => app.ResID !== appId)
    });
  };

  loadApps = async () => {
    let res;
    try {
      res = await getUserDesktop();
    } catch (err) {
      console.error(err.message);
      message.error(err.message);
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
          <HalfPanel title="必要的功能">
            <RequiredApps apps={requiredApps} />
          </HalfPanel>
          <HalfPanel title="可选的功能">
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
