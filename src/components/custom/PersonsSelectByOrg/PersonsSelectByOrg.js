import React from 'react';
import SelectedPersons from './SelectedPersons';
import SelectPersons from './SelectPersons';
import { Button } from 'antd';
import { remove, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import OrgSelect from '../OrgSelect';
import './PersonsSelectByOrg.less';

/**
 * 通过组织选择人员组件
 */
class PersonsSelectByOrg extends React.Component {
  static propTypes = {
    /**
     * 根组织列表的 indexCodes 数组
     * 默认：-
     */
    orgIndexCodes: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * 选择的人员改变时的回调
     * 默认：-
     */
    onSelectedPersonsChange: PropTypes.func,
    /**
     * 已选择的人员
     */
    selectedPersons: PropTypes.array,
    /**
     * 是否在右侧显示已选择的人员
     */
    isShowSelectedPersons: PropTypes.bool
  };

  static defaultProps = {
    isShowSelectedPersons: false,
    selectedPersons: []
  };

  state = {
    // 左侧：组织状态
    selectedOrgIndexCode: '',

    // 中间：选择人员
    persons: [],
    selectedRowKeys: [],
    selectedRows: [],

    // 右侧：列表状态
    rightAllPersons: [
      ...(this.props.isShowSelectedPersons ? this.props.selectedPersons : [])
    ],
    rightSelectedRowKeys: []
  };

  handleOrgSelect = orgIndexCode => {
    this.setState({ selectedOrgIndexCode: orgIndexCode });
  };

  handleToRight = () => {
    const { selectedRowKeys, persons, rightAllPersons } = this.state;
    const newPersons = [...persons];
    const removedPersons = remove(newPersons, person => {
      return !!selectedRowKeys.find(key => key === person.personId);
    });
    const newRightAllPersons = [...rightAllPersons, ...removedPersons];
    this.setState({
      rightAllPersons: newRightAllPersons,
      persons: newPersons,
      selectedRowKeys: [],
      selectedRows: []
    });
    const { onSelectedPersonsChange } = this.props;
    onSelectedPersonsChange && onSelectedPersonsChange(newRightAllPersons);
  };

  handleToLeft = () => {
    const { persons, rightSelectedRowKeys, rightAllPersons } = this.state;

    const newRightAllPersons = [...rightAllPersons];
    const removedRightPersons = remove(newRightAllPersons, person => {
      return !!rightSelectedRowKeys.find(key => key === person.personId);
    });

    this.setState({
      rightAllPersons: newRightAllPersons,
      rightSelectedRowKeys: [],
      persons: [...persons, ...removedRightPersons]
    });

    const { onSelectedPersonsChange } = this.props;
    onSelectedPersonsChange && onSelectedPersonsChange(newRightAllPersons);
  };

  handleFetchNewPersons = persons => {
    const { selectedPersons } = this.props;
    const { rightAllPersons } = this.state;
    const needExcludePersons = [...rightAllPersons, ...selectedPersons];

    const newPersons = [...persons];
    remove(newPersons, person => {
      return !!needExcludePersons.find(
        item => item.personId === person.personId
      );
    });

    this.setState({ persons: newPersons });
  };

  render() {
    const { orgIndexCodes } = this.props;
    const {
      selectedOrgIndexCode,
      rightAllPersons,
      persons,
      selectedRowKeys,
      rightSelectedRowKeys
    } = this.state;
    return (
      <div className="persons-select-by-org">
        {/* <h2>门禁点列表</h2> */}
        <div className="persons-select-by-org__doors">
          <OrgSelect
            orgIndexCodes={orgIndexCodes}
            onOrgSelect={this.handleOrgSelect}
          ></OrgSelect>
          <SelectPersons
            // 选择的组织 indexCode
            selectedOrgIndexCode={selectedOrgIndexCode}
            // 查询到的 persons
            onFetchNewPersons={this.handleFetchNewPersons}
            persons={persons}
            // 选择的 persons
            selectedRowKeys={selectedRowKeys}
            onPersonSelect={(selectedRowKeys, selectedRows) => {
              let newSelectedRows = uniqBy(
                [...this.state.selectedRows, ...selectedRows],
                'personId'
              );
              if (selectedRowKeys.length < newSelectedRows.length) {
                newSelectedRows = remove(newSelectedRows, row => {
                  return !!selectedRowKeys.find(key => key === row.personId);
                });
              }
              this.setState({ selectedRowKeys, selectedRows: newSelectedRows });
            }}
            selectedPersons={[
              ...rightAllPersons,
              ...this.props.selectedPersons
            ]}
          ></SelectPersons>

          <div className="persons-select-by-org__buttons">
            <Button
              className="persons-select-by-org__button"
              disabled={!selectedRowKeys.length}
              onClick={this.handleToRight}
            >
              {'>'}
            </Button>
            <Button
              className="persons-select-by-org__button"
              disabled={!rightSelectedRowKeys.length}
              onClick={this.handleToLeft}
            >
              {'<'}
            </Button>
          </div>

          <SelectedPersons
            // 所有的 persons
            persons={rightAllPersons}
            // 选择的 doors
            selectedRowKeys={rightSelectedRowKeys}
            onPersonSelect={selectedRowKeys =>
              this.setState({ rightSelectedRowKeys: selectedRowKeys })
            }
          ></SelectedPersons>
        </div>
      </div>
    );
  }
}

export default PersonsSelectByOrg;
