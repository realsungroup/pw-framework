import React from 'react';
import { message, Checkbox, Table, Spin } from 'antd';
import './SelectDoors.less';
import { queryDoors } from '../../../../hikApi';

class SelectDoors extends React.Component {
  state = {
    loading: false,
    isSubRegion: false
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.selectedRegionIndexCode !== prevProps.selectedRegionIndexCode
    ) {
      this.props.selectedRegionIndexCode && this.getDoors();
    }
  };

  getDoors = async () => {
    const { selectedRegionIndexCode } = this.props;
    if (!selectedRegionIndexCode) {
      return;
    }
    this.setState({ loading: true });
    const { isSubRegion } = this.state;
    let res;
    try {
      res = await queryDoors({
        regionIndexCodes: [selectedRegionIndexCode],
        isSubRegion,
        pageNo: 1,
        pageSize: 1000
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({ loading: false });

    const { onFetchNewDoors } = this.props;
    onFetchNewDoors && onFetchNewDoors(res.data.list);
  };

  columns = [
    {
      title: '门禁点',
      dataIndex: 'name',
      key: 'name'
    }
  ];

  handleIsSubRegionChange = e => {
    this.setState({ isSubRegion: e.target.checked }, this.getDoors);
  };

  render() {
    const { isSubRegion, loading } = this.state;
    const { doors, selectedRowKeys, onDoorSelect } = this.props;
    return (
      <div className="select-doors">
        <Spin spinning={loading}>
          <div className="select-doors__header">
            <div>
              待选择门禁点({selectedRowKeys.length}/{doors.length})
            </div>
            <div>
              <Checkbox
                checked={isSubRegion}
                onChange={this.handleIsSubRegionChange}
              >
                包含下级
              </Checkbox>
            </div>
          </div>
          <Table
            columns={this.columns}
            size="small"
            rowSelection={{
              columnWidth: 32,
              selectedRowKeys,
              onChange: onDoorSelect
            }}
            dataSource={doors}
            pagination={false}
            rowKey="indexCode"
          ></Table>
        </Spin>
      </div>
    );
  }
}

export default SelectDoors;
