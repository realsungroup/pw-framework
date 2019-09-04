import React from 'react';
import { Row, Col, Select, message } from 'antd';
import http from 'Util20/api';
import FormData from '../../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';

const { Option } = Select;
const resid = '462400643808';
class ViewComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      selectYear: '',
      comments: [],
      comment: {},
      dataProp: []
    };
  }
  async componentDidMount() {
    const { person } = this.props;
    const id = person.C3_305737857578;
    await this.getYearsTarget(id);
    await this.getComments(resid, id);
    await this.getFormData(this.state.comment);
  }
  getFormData = async record => {
    let res;
    try {
      res = await http({ baseURL: 'http://10.108.2.66:9091/' }).getFormData({
        resid: resid,
        formName: '财年评语查看'
      });
      const formData = dealControlArr(res.data.columns);
      const dataProp = getDataProp(formData, record, true, false, false);
      this.setState({ dataProp });
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  };
  getYearsTarget = async id => {
    try {
      const res = await http({ baseURL: 'http://10.108.2.66:9091/' }).getTable({
        resid: '620409727880',
        cparm1: id,
        dblinkname: 'ehr'
      });
      if (res.data.length) {
        this.setState({
          years: res.data,
          selectYear: res.data[0].C3_420150922019
        });
      } else {
        this.setState({
          years: [],
          selectYear: ''
        });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  getComments = async (resid, id) => {
    try {
      const res = await http({ baseURL: 'http://10.108.2.66:9091/' }).getTable({
        resid,
        dblinkname: 'ehr',
        cparm1: id,
        cparm2: this.state.selectYear
      });
      this.setState({
        comments: res.data,
        comment: res.data.find(
          item => item.C3_420150922019 === this.state.selectYear
        )
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };
  renderSelect = () => {
    return (
      <Select
        style={{ width: 120 }}
        placeholder="选择财年"
        value={this.state.selectYear}
        onSelect={selectValue => {
          this.setState(
            {
              selectYear: selectValue,
              comment: this.state.comments.find(
                item => item.C3_420150922019 === selectValue
              )
            },
            () => this.getFormData(this.state.comment)
          );
        }}
      >
        {this.state.years.map(target => (
          <Option value={target.C3_420150922019}>
            {target.C3_420150922019}
          </Option>
        ))}
      </Select>
    );
  };
  render() {
    return (
      <div id="advantage-shortcoming">
        <div className="advantage-shortcoming_select-year">
          财年：
          {this.renderSelect()}
        </div>
        <div className="advantage-shortcoming_content">
          <FormData
            info={{ dataMode: 'main', resid: resid }}
            operation="view"
            data={this.state.dataProp}
            record={this.state.comment}
          />
        </div>
      </div>
    );
  }
}
export default ViewComments;
