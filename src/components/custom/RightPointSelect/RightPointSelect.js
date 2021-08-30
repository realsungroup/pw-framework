import React from 'react';
import './RightPointSelect.less';
import { Input, message, Tabs } from 'antd';
import http from 'Util20/api';
import PropTypes from 'prop-types';
import DoorGroupSelect from '../DoorGroupSelect';
import DoorsSelect from '../DoorsSelect';

const { Search } = Input;
const { TabPane } = Tabs;

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

/**
 * 门禁分组列表组件
 */
class RightPointSelect extends React.Component {
  static propTypes = {
    /**
     * 门禁分组/点选择改变时的回调
     */
    onChange: PropTypes.func,

    /**
     * 激活的标签页 key
     */
    activeKey: PropTypes.string.isRequired,

    /**
     * 区域 indexCode 列表
     */
    regionIndexCodes: PropTypes.array.isRequired
  };

  static defaultProps = {
    activeKey: '门禁分组'
  };

  state = {
    groupList: [],
    doors: []
  };

  render() {
    const { regionIndexCodes, onChange, activeKey } = this.props;
    const { groupList, doors } = this.state;
    return (
      <div className="right-point-select">
        <Tabs
          activeKey={activeKey}
          onChange={activeKey =>
            onChange &&
            onChange(activeKey, activeKey === '门禁分组' ? groupList : doors)
          }
          type="card"
        >
          <TabPane tab="门禁分组" key="门禁分组">
            <DoorGroupSelect
              onGroupSelect={groupList => {
                this.setState({ groupList });
                onChange && onChange('门禁分组', groupList);
              }}
            ></DoorGroupSelect>
          </TabPane>
          <TabPane tab="门禁点" key="门禁点">
            <DoorsSelect
              regionIndexCodes={regionIndexCodes}
              onSelectedDoorsChange={doors => {
                this.setState({ doors });
                onChange && onChange('门禁点', doors);
              }}
            ></DoorsSelect>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RightPointSelect;
