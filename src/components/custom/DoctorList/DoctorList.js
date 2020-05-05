import React from 'react';
import './DoctorList.less';
import {
  Popconfirm,
  message,
  Skeleton,
  Checkbox,
  Card,
  Avatar,
  Spin,
} from 'antd';
import { getTableData, getMainTableData } from '../../../util/api';
import http from 'Util20/api';
import { Header } from '../loadableCustom';

const resid = 639670405070; //医生列表Id
const accessId = 641582795393; //授权表Id
const { Meta } = Card;

/**
 * 医生列表
 */

class DoctorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorList: [],
      loading: true,
      isSelect: false,
    };
  }

  componentDidMount = async () => {
    this.getTableData();
  };
  //获取数据
  getTableData = async () => {
    let res;
    try {
      res = await getMainTableData(resid, {
        getcolumninfo: 1,
      });
      this.setState({ doctorList: res.data });
    } catch (err) {
      return message.error(err.message);
    }
    console.log('res', res.data);
  };

  onChange = async (e) => {
    console.log(`checked = ${e.target.checked}`);
    if (e.target.checked) {
    }
  };

  doctorConfirm = async (index) => {
    let { doctorList } = this.state;

    doctorList[index].loading = true;
    this.setState({
      doctorList,
    });

    let res;
    const { doctorNo, doctorAccount, doctorName } = doctorList[index];
    try {
      res = await http().addRecords({
        resid: accessId,
        data: [
          {
            doctorNo,
            doctorAccount,
            doctorName,
            isAccess: 'Y',
          },
        ],
      });
    } catch (error) {
      message.error(error.message);
      doctorList[index].loading = false;
      this.setState({
        doctorList,
      });
      return;
    }
    doctorList[index].loading = false;
    doctorList[index].isSelect = true;
    this.setState({
      doctorList,
    });
  };

  doctorCancel = () => {};

  renderCardTopRight = (subrecord, index) => {
    if (subrecord.loading) {
      return <Spin className='doctor-list__spin' />;
    }
    if (subrecord.isSelect) {
      return (
        <span style={{ cursor: 'pointer', color: '#0086ff' }}>已选择</span>
      );
    }
    return (
      <Popconfirm
        title='您确定选择该医生吗?'
        onConfirm={() => {
          this.doctorConfirm(index);
        }}
        onCancel={this.doctorCancel}
        okText='是'
        cancelText='否'
      >
        <span style={{ cursor: 'pointer', color: '#0086ff' }}>选择</span>
      </Popconfirm>
    );
  };

  render() {
    const { loading, doctorList } = this.state;
    return (
      <div className='doctor-list'>
        <Header />
        <h1 style={{ margin: '10px' }}>医生列表:</h1>
        <div className='doctor-list__content'>
          {this.state.doctorList.map((subrecord, index) => (
            <Card
              key={subrecord.doctorName + index}
              title={'姓名：' + `${subrecord.doctorName}`}
              extra={this.renderCardTopRight(subrecord, index)}
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
      </div>
    );
  }
}
export default DoctorList;
