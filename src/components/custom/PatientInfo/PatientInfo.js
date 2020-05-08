import React from 'react';
import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import './PatientInfo.less';
import { Button, message, Modal, Select, Input, Form } from 'antd';
import { RecordInput, DoctorList, OtherData } from '../loadableCustom';
import { LzModal, LzMenuForms } from '../loadableCustom';
import http, { makeCancelable } from 'Util20/api';
import { Header } from '../loadableCustom';
import DivisionTable from '../PersonalInformation/DivisionTable';

const customBtnStyle = {
  margin: '0 4px',
};
const { Option } = Select;
const topResid = 639829676005;
const userResid = 639844485796;
/**
 * 会员信息
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
      otherVisible: false,
      appLinks: [],
      selectKey: '',
    };

  }

  componentDidMount = async () => {
    // const { resid } = this.props.tableDataProps;
    // this.p1 = makeCancelable(
    //   http().getTable({
    //     resid,
    //     // cmswhere: `C3_617809531670 = 'UC'`
    //   })
    // );
    // this.p2 = makeCancelable(
    //   http().getTable({
    //     resid,
    //     // cmswhere: `C3_617809531670 = 'CD'`
    //   })
    // );
    // const pArr = [this.p1.promise, this.p2.promise];

    // let res;
    // try {
    //   res = await Promise.all(pArr);
    // } catch (err) {
    //   console.error(err);
    //   return message.error(err.message);
    // }
    // const ucLen = res[0].total;
    // const cdLen = res[1].total;
    // this.setState({ ucLen, cdLen });
    // this.getAppLinks();
  };
  //获取检测指标下的所有节点
  getAppLinks = async () => {
    let app;
    try {
      app = await http().getAppLinks({
        getresourcedata: 1,
        getrecordcount: 1,
        parentresids: 641318283132,
      });
    } catch (err) {
      return message.error(err.message);
    }
    this.setState({
      appLinks: app.data[0].AppLinks,
    });
    this.handleAppLinks();
  };

  handleAppLinks = () => {
    let { appLinks } = this.state.appLinks;
    console.log('app', appLinks);
    let parent = [];
    // appLinks.map(item =>{
    //   if ( item.RES_PID = topResid  ){
    //     parent.push(item.RES_NAME)
    //   }
    // })
    console.log('parentNode', parent);
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  //常用信息录入
  handleInputCaseClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      // navListResidField: 'C3_620929565473'
    });
  };
  //其他信息录入
  handleOtherCaseClick = (record) => {
    this.setState({
      otherVisible: true,
      record: { ...record },
      // navListResidField: 'C3_620929565473'
    });
  };
  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key='常见数据录入'
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          常见数据录入
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key='其他数据录入'
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleOtherCaseClick(record)}
        >
          其他数据录入
        </Button>
      );
    },
  ];

  handleModalClose = () => {
    this.setState({ modalVisible: false , selectKey: '' });
  };

  handleOtherModalClose = () => {
    this.setState({ otherVisible: false });
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

  handleCellClick = (value) => {
    this.setState({ otherVisible: false }, () => {
      // 100 ms 后再打开 modal，用户体验好一点
      setTimeout(() => {
        this.setState({ modalVisible: true, selectKey: value.substring(0, 2) });
      }, 100);
    });
  };


  render() {
    const { modalVisible, record, otherVisible,selectKey } = this.state;
    return (
      <div className='patient-info'>
        <Header />
        <TableData
          resid={639844485796}
          subtractH={170}
          actionBarFixed={true}
          height={500}
          size='small'
          actionBarWidth={490}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasBeBtns={true}
          addText='添加基本信息'
          enAddText='Add basic information'
          rowModifyText='修改个人信息'
          enRowModifyText='Modify personal information'
          defaultColumnWidth={180}
          customRowBtns={this.customRowBtns}
          actionBarExtra={this.renderActionBarExtra}
        />
        )
        {modalVisible && (
          <LzModal defaultScaleStatus='max' onClose={this.handleModalClose}>
            <RecordInput {...record}  selectKey={selectKey} />
          </LzModal>
        )}
        {otherVisible && (
          <LzModal
            defaultScaleStatus='max'
            onClose={this.handleOtherModalClose}
          >
            <DivisionTable onCellClick={this.handleCellClick} />
          </LzModal>
        )}
      </div>
    );
  }
}

export default PatientInfo;
