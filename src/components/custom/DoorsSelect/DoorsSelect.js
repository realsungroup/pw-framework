import React from 'react';
import './DoorsSelect.less';
import RegionSelect from './RegionSelect';

class DoorsSelect extends React.Component {
  render() {
    const { regionIndexCodes } = this.props;
    return (
      <div className="doors-select">
        <h2>门禁点列表</h2>

        <RegionSelect regionIndexCodes={regionIndexCodes}></RegionSelect>
      </div>
    );
  }
}

export default DoorsSelect;
