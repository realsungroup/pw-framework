import React from 'react';
import { Input, Button, message } from 'antd';
import PropTypes from 'prop-types';
import OrgSelect from '../OrgSelect';
import SelectedOrgList from './SelectedOrgList';
import { remove } from 'lodash';

import './OrgsSelect.less';

class OrgsSelect extends React.Component {
  static propTypes = {
    /**
     * 组织选择改变时的回调
     */
    onOrgSelectChange: PropTypes.func
  };

  state = {
    orgList: [],

    // 左侧
    checkedKeys: {
      checked: []
    },

    // 右侧
    rightRows: [],
    rightSelectedRowKeys: []
  };

  handleToRight = () => {
    const {
      checkedKeys: { checked },
      orgList
    } = this.state;
    const newRightRows = [];
    checked.forEach(indexCode => {
      const result = orgList.find(
        orgListItem => orgListItem.orgIndexCode === indexCode
      );
      if (result) {
        newRightRows.push(result);
      }
    });
    this.setState({
      rightRows: newRightRows
    });
    const { onOrgSelectChange } = this.props;
    onOrgSelectChange && onOrgSelectChange(newRightRows);
  };

  handleToLeft = () => {
    const { rightRows, rightSelectedRowKeys } = this.state;
    const newRightRows = [...rightRows];
    remove(newRightRows, item => {
      return !!rightSelectedRowKeys.find(
        orgIndexCode => orgIndexCode === item.orgIndexCode
      );
    });
    this.setState({
      rightRows: newRightRows,
      rightSelectedRowKeys: []
    });
    const { onOrgSelectChange } = this.props;
    onOrgSelectChange && onOrgSelectChange(newRightRows);
  };

  handleCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  handleOrgListChange = orgList => {
    this.setState({ orgList });
  };

  getDisableCheckedKeys = () => {
    const { rightRows } = this.state;
    return rightRows.map(row => row.orgIndexCode);
  };

  render() {
    const { rightSelectedRowKeys, rightRows, checkedKeys } = this.state;
    const { orgIndexCodes = [] } = this.props;

    return (
      <div className="person-group-select">
        {!!orgIndexCodes.length && (
          <OrgSelect
            orgIndexCodes={orgIndexCodes}
            onOrgSelect={orgIndexCode => {
              if (orgIndexCode) {
                this.setState({ orgIndexCode });
              }
            }}
            checkable
            onCheck={this.handleCheck}
            checkedKeys={checkedKeys}
            onOrgListChange={this.handleOrgListChange}
            disableCheckedKeys={this.getDisableCheckedKeys()}
          ></OrgSelect>
        )}
        <div className="person-group-select__buttons">
          <Button
            className="person-group-select__button"
            disabled={!checkedKeys.checked.length}
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
        <SelectedOrgList
          list={rightRows}
          selectedRowKeys={rightSelectedRowKeys}
          onOrgSelect={rightSelectedRowKeys =>
            this.setState({ rightSelectedRowKeys })
          }
        ></SelectedOrgList>
      </div>
    );
  }
}

export default OrgsSelect;
