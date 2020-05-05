import React from 'react';
import {
  Popconfirm,
  message,
  Skeleton,
  Checkbox,
  Card,
  Avatar,
  Spin,
  Modal,
  Button,
} from 'antd';
import { getTableData, getMainTableData } from '../../../util/api';
import http from 'Util20/api';
import { Header } from '../loadableCustom';
import TableData from 'Common/data/TableData';
import moment from 'moment';

import './ButtJointDoctor.less';

const resid = 639670405070; //医生列表Id
const accessId = 641582795393; //授权表Id
const { Meta } = Card;

// 授权过期时间，单位：小时
const PAST_DUE = 24;

/**
 * 对接医生或医院
 */
class ButtJointDoctor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorList: [],
      memberList: [],
      loading: true,
      isSelect: false,
      modalVisible: false,
      selectDoctor: null,
      selectLoading: false,
      doctorMembers: [], // 医生所对应的会员
    };
  }

  componentDidMount = () => {
    this.getTableData();
  };

  //获取数据
  getTableData = async () => {
    let res;
    try {
      res = await Promise.all([
        getMainTableData(resid, {
          getcolumninfo: 1,
        }),
        http().getTable({
          resid: 639844485796,
        }),
      ]);
    } catch (err) {
      return message.error(err.message);
    }

    const doctorList = res[0].data;
    const memberList = res[1].data;

    this.setState({ doctorList, memberList });
  };

  onChange = async (e) => {
    console.log(`checked = ${e.target.checked}`);
    if (e.target.checked) {
    }
  };

  handleConfirm = async (memberRecord) => {
    this.setState({ selectLoading: true });
    const { selectDoctor } = this.state;
    let res;
    const { doctorNo, doctorAccount, doctorName } = selectDoctor;
    const { userNo: userID, userNum: userNo, userName } = memberRecord;
    try {
      res = await http().addRecords({
        resid: accessId,
        data: [
          {
            doctorNo,
            doctorAccount,
            doctorName,
            isAccess: 'Y',
            userID,
            userNo,
            userName,
          },
        ],
      });
    } catch (error) {
      message.error(error.message);
      this.setState({ selectLoading: false });
      return;
    }
    this.setState({ selectLoading: false, modalVisible: false });
  };

  doctorCancel = () => {};

  handleSelect = async (selectDoctor) => {
    this.setState({ selectLoading: true });
    const { doctorNo } = selectDoctor;
    let res;
    try {
      res = await http().getTable({
        resid: accessId,
        cmswhere: `doctorNo = ${doctorNo}`,
      });
    } catch (err) {
      this.setState({ selectLoading: false });
      message.error(err.message);
      return;
    }

    this.setState({
      modalVisible: true,
      selectDoctor,
      selectLoading: false,
      doctorMembers: res.data,
    });
  };

  renderCardTopRight = (subrecord, index) => {
    if (subrecord.loading) {
      return <Spin className='doctor-list__spin' />;
    }
    // if (subrecord.isSelect) {
    //   return (
    //     <span style={{ cursor: 'pointer', color: '#0086ff' }}>已选择</span>
    //   );
    // }
    return (
      <span
        onClick={() => this.handleSelect(subrecord)}
        style={{ cursor: 'pointer', color: '#0086ff' }}
      >
        选择
      </span>
    );
  };

  customRowBtns = [
    (record, size) => {
      return (
        <Popconfirm
          title='您确定选择该会员吗?'
          onConfirm={() => {
            this.handleConfirm(record);
          }}
          onCancel={this.doctorCancel}
          okText='是'
          cancelText='否'
        >
          <Button
            key='选择'
            size={size}
            onClick={() => this.handleClick(record)}
          >
            选择
          </Button>
        </Popconfirm>
      );
    },
  ];

  handleClick = (record) => {
    console.log({ record });
  };

  recordsFilter = (records) => {
    const { doctorMembers } = this.state;

    // records 为会员表的记录
    records = records
      .map((record) => {
        record.key = record.REC_ID;
        const userID = record.userNo;
        // doctorMembers 为授权表的记录
        const flag = !!doctorMembers.find((doctorMember) => {
          if (userID !== doctorMember.userID) {
            return false;
          }
          const time = moment(doctorMember.time);
          const pastDueTime = time.add(PAST_DUE, 'h');
          // 当前时间大于过期时间
          if (moment().isAfter(pastDueTime)) {
            return false;
          }
          return true;
        });
        if (flag) {
          return record;
        }
        return;
      })
      .filter(Boolean);

    return records;
  };

  render() {
    const { loading, doctorList, modalVisible, selectLoading } = this.state;

    return (
      <div className='doctor-list'>
        <Header />
        <h1 style={{ margin: '10px' }}>医生列表:</h1>
        <div className='doctor-list__content'>
          {doctorList.map((subrecord, index) => (
            <Card
              key={`${subrecord.doctorName}-${index}`}
              title={'姓名：' + `${subrecord.doctorName}`}
              extra={this.renderCardTopRight(subrecord, index)}
              className='butt-joint-doctor__card'
            >
              <Avatar
                className='doctor-list__avatar'
                src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
              />

              <div className='doctor-list__information'>
                <p>科室：{subrecord.division}</p>
                <p>所属医院：{subrecord.hospital}</p>
                <p>职称：{subrecord.jobTitle}</p>
              </div>
            </Card>
          ))}
        </div>
        <Modal
          visible={modalVisible}
          title={<h2>选择会员</h2>}
          onCancel={() => this.setState({ modalVisible: false })}
          destroyOnClose
          width={800}
          footer={null}
        >
          <Spin spinning={selectLoading}>
            <TableData
              resid={639844485796}
              subtractH={170}
              actionBarFixed={true}
              height={400}
              size='small'
              actionBarWidth={180}
              hasAdd={false}
              hasDelete={false}
              hasRowDelete={false}
              hasRowView={false}
              hasBeBtns={false}
              hasRowModify={false}
              hasModify={false}
              customRowBtns={this.customRowBtns}
              recordsFilter={this.recordsFilter}
            />
          </Spin>
        </Modal>
      </div>
    );
  }
}
export default ButtJointDoctor;
