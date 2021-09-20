import React from 'react';
import './DoorsSelect.less';
import RegionSelect from './RegionSelect';
import SelectDoors from './SelectDoors';
import SelectedDoors from './SelectedDoors';
import { Button } from 'antd';
import { remove } from 'lodash';
import PropTypes from 'prop-types';

/**
 * 门禁点选择组件
 */
class DoorsSelect extends React.Component {
  static propTypes = {
    /**
     * 根区域列表的 indexCodes 数组
     * 默认：-
     */
    regionIndexCodes: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * 选择的门禁点改变时的回调
     * 默认：-
     */
    onSelectedDoorsChange: PropTypes.func,

    /**
     * 已经选择的 doors
     */
    selectedDoors: PropTypes.array
  };

  static defaultProps = {
    selectedDoors: []
  };

  state = {
    // 左侧：区域状态
    selectedRegionIndexCode: '',

    // 中间：选择门禁点的状态
    doors: [],
    selectedRowKeys: [],

    // 右侧：列表状态
    rightAllDoors: [],
    rightSelectedRowKeys: []
  };

  handleRegionSelect = regionIndexCode => {
    this.setState({ selectedRegionIndexCode: regionIndexCode });
  };

  handleToRight = () => {
    const { selectedRowKeys, doors, rightAllDoors } = this.state;

    const newDoors = [...doors];
    const removedDoors = remove(newDoors, door => {
      return !!selectedRowKeys.find(indexCode => indexCode === door.indexCode);
    });

    const newRightAllDoors = [...rightAllDoors, ...removedDoors];

    this.setState({
      rightAllDoors: newRightAllDoors,
      doors: newDoors,
      selectedRowKeys: []
    });

    const { onSelectedDoorsChange } = this.props;
    onSelectedDoorsChange && onSelectedDoorsChange(newRightAllDoors);
  };

  handleToLeft = () => {
    const { doors, rightSelectedRowKeys, rightAllDoors } = this.state;

    const newRightAllDoors = [...rightAllDoors];
    const removedRightDoors = remove(newRightAllDoors, door => {
      return !!rightSelectedRowKeys.find(
        indexCode => indexCode === door.indexCode
      );
    });

    this.setState({
      rightAllDoors: newRightAllDoors,
      rightSelectedRowKeys: [],
      doors: [...doors, ...removedRightDoors]
    });

    const { onSelectedDoorsChange } = this.props;
    onSelectedDoorsChange && onSelectedDoorsChange(newRightAllDoors);
  };

  handleFetchNewDoors = doors => {
    const { selectedDoors } = this.props;
    const { rightAllDoors } = this.state;

    const newDoors = [...doors];
    remove(newDoors, door => {
      return !![...rightAllDoors, ...selectedDoors].find(
        item => item.indexCode === door.indexCode
      );
    });
    this.setState({ doors: newDoors });
  };

  render() {
    const { regionIndexCodes } = this.props;
    const {
      selectedRegionIndexCode,
      rightAllDoors,
      doors,
      selectedRowKeys,
      rightSelectedRowKeys
    } = this.state;
    return (
      <div className="doors-select">
        {/* <h2>门禁点列表</h2> */}
        <div className="doors-select__doors">
          <RegionSelect
            regionIndexCodes={regionIndexCodes}
            onRegionSelect={this.handleRegionSelect}
          ></RegionSelect>

          <SelectDoors
            // 选择的区域 indexCode
            selectedRegionIndexCode={selectedRegionIndexCode}
            // 查询到的 doors
            onFetchNewDoors={this.handleFetchNewDoors}
            doors={doors}
            // 选择的 door
            selectedRowKeys={selectedRowKeys}
            onDoorSelect={(selectedRowKeys, b) => {
              this.setState({ selectedRowKeys });
            }}
          ></SelectDoors>

          <div className="doors-select__buttons">
            <Button
              className="doors-select__button"
              disabled={!selectedRowKeys.length}
              onClick={this.handleToRight}
            >
              {'>'}
            </Button>
            <Button
              className="doors-select__button"
              disabled={!rightSelectedRowKeys.length}
              onClick={this.handleToLeft}
            >
              {'<'}
            </Button>
          </div>

          <SelectedDoors
            // 所有的 doors
            doors={rightAllDoors}
            // 选择的 doors
            selectedRowKeys={rightSelectedRowKeys}
            onDoorSelect={selectedRowKeys =>
              this.setState({ rightSelectedRowKeys: selectedRowKeys })
            }
          ></SelectedDoors>
        </div>
      </div>
    );
  }
}

export default DoorsSelect;
