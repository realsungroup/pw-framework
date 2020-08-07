import React from 'react';
import http from 'Util20/api';
import { message, Select, Spin } from 'antd';
import FormData from '../../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';

const { Option } = Select;

class AdvantageShortcoming extends React.Component {
  constructor(props) {
    super(props);
    const { type } = this.props;
    let resid = '620409727880';
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
      dataProp: [],
      spinning: false
    };
  }

  async componentDidMount() {
    const { person } = this.props;
    const id = person.C3_305737857578;
    this.setState({
      spinning: true
    });
    await this.getYearsTarget(id);
    await this.getFormData(this.state.advantageShortcoming);
    this.setState({
      spinning: false
    });
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.person.C3_305737857578 !== this.props.person.C3_305737857578
    ) {
      this.setState({
        spinning: true
      });
      await this.getYearsTarget(this.props.person.C3_305737857578);
      await this.getFormData(this.state.advantageShortcoming);
      this.setState({
        spinning: false
      });
    }
    if (prevProps.selectYear.key !== this.props.selectYear.key) {
      this.setState(
        {
          advantageShortcoming: this.state.advantageShortcomings.find(
            item => item.C3_420150922019 === this.props.selectYear.label
          )
        },
        () => {
          const dataProp = getDataProp(
            this.formData,
            this.state.advantageShortcoming,
            true,
            false,
            false
          );
          this.setState({ dataProp });
        }
      );
    }
  }

  formData = {};
  getFormData = async record => {
    let res;
    try {
      res = await http().getFormData({
        resid: this.state.resid,
        formName: this.state.formName,
        dblinkname: 'ehr'
      });
      this.formData = dealControlArr(res.data.columns);
      const dataProp = getDataProp(this.formData, record, true, false, false);
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
          selectYear: res.data[0].C3_420150922019,
          advantageShortcomings: res.data,
          advantageShortcoming: res.data[0]
        });
      } else {
        this.setState({
          years: [],
          selectYear: '',
          advantageShortcomings: [],
          advantageShortcoming: {}
        });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  render() {
    const { spinning } = this.state;
    return (
      <div id="advantage-shortcoming">
        <div className="advantage-shortcoming_content">
          <Spin spinning={spinning}>
            <FormData
              info={{ dataMode: 'main', resid: this.state.resid }}
              operation="view"
              data={this.state.dataProp}
              record={this.state.advantageShortcoming}
              useAbsolute={true}
            />
          </Spin>
        </div>
      </div>
    );
  }
}
export default AdvantageShortcoming;
