import React from 'react';
import './DoctorList.less';
import { Popconfirm, message, Skeleton, Checkbox, Card, Avatar } from 'antd';
import { getTableData, getMainTableData } from '../../../util/api';

const resid = 639670405070;//医生列表Id
const { Meta } = Card;
const accessId = 641582795393; //授权表Id

/**
 * 医生列表
 */

class DoctorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorList: [],
      loading: true,
      isSelect: false
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

  doctorConfirm = (index) => {
    let { doctorList } = this.state;
    let res;
    doctorList[index].isSelect = true
    this.setState({
      doctorList
    })
    // doctorinfo = {
    //   // doctorNo:doctorList[index]
    // }
    // try {
    //   res =  await http().addRecord({
    //   accessId,
    //   data
    //  })
    // } catch (error) {}
  }


  doctorCancel = () => {

  }


  render() {
    const { loading, doctorList } = this.state;
    return (
      <div className="container">
        <h1 style={{ margin: '10px' }}>医生列表:</h1>
        <div className="doctorList">
          {this.state.doctorList.map((subrecord, index) => (
            <Card
              title={'姓名：' + `${subrecord.doctorName}`}
              extra={
                <Popconfirm
                  title="您确定选择该医生吗?"
                  onConfirm={() => {
                    this.doctorConfirm(index)
                  }
                  }
                  onCancel={this.doctorCancel}
                  okText="是"
                  cancelText="否"

                >
                  {subrecord.isSelect ? (<span style={{ cursor: "pointer", color: "#0086ff" }} >已选择</span>) : (<span style={{ cursor: "pointer", color: "#0086ff" }} >选择</span>)}
                </Popconfirm>
              }
            >
              <Avatar
                className="doctorList__avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />

              <div className="doctorList__information">
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
