import React from 'react';
import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import './PatientInfo.less';

/**
 * 患者信息
 */
class PatientInfo extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  render() {
    return (
      <div className="my-patient-cd">
        <TableData resid={586639160406} />
      </div>
    );
  }
}

export default PatientInfo;
