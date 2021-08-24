import React from 'react';
import { Input, Button, message } from 'antd';
import PropTypes from 'prop-types';
import PersonGourpList from '../PersonGroupList';
import SelectedPersonGoupList from './SelectedPersonGoupList';
import { remove } from 'lodash';

import './PersonGroupSelect.less';

class PersonGroupSelect extends React.Component {
  static propTypes = {
    /**
     * 人员分组被选中时的回调
     */
    onGroupSelect: PropTypes.func
  };

  state = {
    // 左侧
    selectedRowKeys: [],
    personGroupList: [],

    // 右侧
    rightRows: [],
    rightSelectedRowKeys: []
  };

  handleToRight = () => {
    const { personGroupList, selectedRowKeys } = this.state;
    const newPersonGroupList = [...personGroupList];
    const rightRows = remove(newPersonGroupList, item => {
      return !!selectedRowKeys.find(key => key === item.groupId);
    });
    this.setState({
      personGroupList: newPersonGroupList,
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
      personGroupList: [...this.state.personGroupList, ...removedRows],
      rightRows: newRightRows,
      rightSelectedRowKeys: []
    });
    const { onGroupSelect } = this.props;
    onGroupSelect && onGroupSelect(newRightRows);
  };

  render() {
    const {
      selectedRowKeys,
      personGroupList,
      rightSelectedRowKeys,
      rightRows
    } = this.state;

    return (
      <div className="person-group-select">
        <PersonGourpList
          onFetchPersonGroupList={personGroupList =>
            this.setState({ personGroupList })
          }
          personGroupList={personGroupList}
          selectedRowKeys={selectedRowKeys}
          onGroupSelect={selectedRowKeys => this.setState({ selectedRowKeys })}
        ></PersonGourpList>
        <div className="person-group-select__buttons">
          <Button
            className="person-group-select__button"
            disabled={!selectedRowKeys.length}
            onClick={this.handleToRight}
          >
            {'>'}
          </Button>
          <Button
            className="person-group-select__button"
            disabled={!rightSelectedRowKeys.length}
            onClick={this.handleToLeft}
          >
            {'<'}
          </Button>
        </div>
        <SelectedPersonGoupList
          list={rightRows}
          selectedRowKeys={rightSelectedRowKeys}
          onGroupSelect={rightSelectedRowKeys =>
            this.setState({ rightSelectedRowKeys })
          }
        ></SelectedPersonGoupList>
      </div>
    );
  }
}

export default PersonGroupSelect;
