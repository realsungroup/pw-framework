import React from 'react';
import { Input, Button, message } from 'antd';
import PropTypes from 'prop-types';
import DoorGroupList from '../DoorGroupList';
import SelectedDoorGoupList from './SelectedDoorGoupList';
import { remove } from 'lodash';

import './DoorGroupSelect.less';

class DoorGroupSelect extends React.Component {
  static propTypes = {
    /**
     * 人员分组被选中时的回调
     */
    onGroupSelect: PropTypes.func
  };

  state = {
    // 左侧
    selectedRowKeys: [],
    doorGroupList: [],

    // 右侧
    rightRows: [],
    rightSelectedRowKeys: []
  };

  handleToRight = () => {
    const { doorGroupList, selectedRowKeys } = this.state;
    const newGroupList = [...doorGroupList];
    const rightRows = remove(newGroupList, item => {
      return !!selectedRowKeys.find(key => key === item.groupId);
    });
    this.setState({
      doorGroupList: newGroupList,
      rightRows,
      selectedRowKeys: []
    });
    const { onGroupSelect } = this.props;
    onGroupSelect && onGroupSelect(rightRows);
  };

  handleToLeft = () => {
    const { rightRows, rightSelectedRowKeys } = this.state;
    const newRightRows = [...rightRows];
    const removedRows = remove(newRightRows, item => {
      return !!rightSelectedRowKeys.find(key => key === item.groupId);
    });
    this.setState({
      doorGroupList: [...this.state.doorGroupList, ...removedRows],
      rightRows: newRightRows,
      rightSelectedRowKeys: []
    });
    const { onGroupSelect } = this.props;
    onGroupSelect && onGroupSelect(newRightRows);
  };

  render() {
    const {
      selectedRowKeys,
      doorGroupList,
      rightSelectedRowKeys,
      rightRows
    } = this.state;

    return (
      <div className="door-group-select">
        <DoorGroupList
          onFetchDoorGroupList={doorGroupList =>
            this.setState({ doorGroupList })
          }
          doorGroupList={doorGroupList}
          selectedRowKeys={selectedRowKeys}
          onGroupSelect={selectedRowKeys => this.setState({ selectedRowKeys })}
        ></DoorGroupList>
        <div className="door-group-select__buttons">
          <Button
            className="door-group-select__button"
            disabled={!selectedRowKeys.length}
            onClick={this.handleToRight}
          >
            {'>'}
          </Button>
          <Button
            className="door-group-select__button"
            disabled={!rightSelectedRowKeys.length}
            onClick={this.handleToLeft}
          >
            {'<'}
          </Button>
        </div>
        <SelectedDoorGoupList
          list={rightRows}
          selectedRowKeys={rightSelectedRowKeys}
          onGroupSelect={rightSelectedRowKeys =>
            this.setState({ rightSelectedRowKeys })
          }
        ></SelectedDoorGoupList>
      </div>
    );
  }
}

export default DoorGroupSelect;
