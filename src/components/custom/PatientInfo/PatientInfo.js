import React from 'react';
import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import './PatientInfo.less';
import { Button, message ,Modal} from 'antd';
import { RecordInput } from '../loadableCustom';
import { LzModal, LzMenuForms } from '../loadableCustom';
import http, { makeCancelable } from 'Util20/api';

const customBtnStyle = {
  margin: '0 4px'
};

/**
 * 患者信息
 */
class PatientInfo extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      record: {},
      navListResidField: '',
      cdLen: {},
      ucLen: {},
      dataVisible:false
    };
  }

  componentDidMount = async () => {
    const { resid } = this.props.tableDataProps;
    this.p1 = makeCancelable(
      http().getTable({
        resid,
        // cmswhere: `C3_617809531670 = 'UC'`
      })
    );
    this.p2 = makeCancelable(
      http().getTable({
        resid,
        // cmswhere: `C3_617809531670 = 'CD'`
      })
    );
    const pArr = [this.p1.promise, this.p2.promise];

    let res;
    try {
      res = await Promise.all(pArr);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const ucLen = res[0].total;
    const cdLen = res[1].total;
    this.setState({ ucLen, cdLen });
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  handleInputCaseClick = record => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      // navListResidField: 'C3_620929565473'
    });
  };

  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key="输入病例"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          常见数据录入
        </Button>
      );
    }
  ];

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  renderActionBarExtra = () => {
    // const { cdLen, ucLen } = this.state;
    // return (
    //   <div>
    //     <span style={{ margin: '0 4px' }}>CD：{cdLen}</span>
    //     <span style={{ margin: '0 4px' }}>UC：{ucLen}</span>
    //   </div>
    // );
  };

  render() {
    const { tableDataProps } = this.props;
    const {
      dataVisible,
      modalVisible,
      record,
      navListResidField,
      ucLen,
      cdLen
    } = this.state;
    return (
      <div className="patient-info">
          <TableData
            {...tableDataProps}
            customRowBtns={this.customRowBtns}
            actionBarExtra={this.renderActionBarExtra}
          />
        )
        {modalVisible && (
          <LzModal defaultScaleStatus="max" onClose={this.handleModalClose}>
           <RecordInput {...record} />
          </LzModal>
        )}
      </div>
    );
  }
}

export default PatientInfo;
