import React from 'react';
import http from 'Util20/api';
import { message, Select } from 'antd';
import FormData from '../../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';

const { Option } = Select;

class AdvantageShortcoming extends React.Component {
  constructor(props) {
    super(props);
    const { type } = this.props;
    let resid = '462400643808';
    let formName = '员工自评查看';
    if (type === '年末') {
      formName = '员工年末自评查看';
    }
    this.state = {
      years: [],
      selectYear: '',
      advantageShortcomings: [],
      advantageShortcoming: {},
      resid,
      formName,
      dataProp: []
    };
  }

  async componentDidMount() {
    const { person } = this.props;
    const id = person.C3_305737857578;
    await this.getYearsTarget(id);
    await this.getAdvantageShortcoming(this.state.resid, id);
    await this.getFormData(this.state.advantageShortcoming);
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.person.C3_305737857578 !== this.props.person.C3_305737857578
    ) {
      await this.getYearsTarget(this.props.person.C3_305737857578);
      await this.getAdvantageShortcoming(
        this.state.resid,
        this.props.person.C3_305737857578
      );
      await this.getFormData(this.state.advantageShortcoming);
    }
  }

  getFormData = async record => {
    let res;
    try {
      res = await http().getFormData({
        resid: this.state.resid,
        formName: this.state.formName,
        dblinkname: 'ehr'
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
      const res = await http().getTable({
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

  getAdvantageShortcoming = async (resid, id) => {
    try {
      const res = await http().getTable({
        resid,
        dblinkname: 'ehr',
        cparm1: id,
        cparm2: this.state.selectYear
      });
      this.setState({
        advantageShortcomings: res.data,
        advantageShortcoming: res.data.find(
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
              advantageShortcoming: this.state.advantageShortcomings.find(
                item => item.C3_420150922019 === selectValue
              )
            },
            () => this.getFormData(this.state.advantageShortcoming)
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
          {this.renderSelect()}
        </div>
        <div className="advantage-shortcoming_content">
          <FormData
            info={{ dataMode: 'main', resid: this.state.resid }}
            operation="view"
            data={this.state.dataProp}
            record={this.state.advantageShortcoming}
            useAbsolute={true}
          />
        </div>
      </div>
    );
  }
}
export default AdvantageShortcoming;
