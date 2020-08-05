import React from 'react';
import { Row, Col, Select, message, Spin } from 'antd';
import http from 'Util20/api';
import FormData from '../../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';

const { Option } = Select;
const resid = '620409727880';
class ViewComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      selectYear: '',
      comments: [],
      comment: {},
      dataProp: [],
      spinning: false
    };
  }
  async componentDidMount() {
    const { person } = this.props;
    const id = person.C3_305737857578;
    this.setState({ spinning: true });
    await this.getYearsTarget(id);
    await this.getFormData(this.state.comment);
    this.setState({ spinning: false });
  }
  async componentDidUpdate(prevProps) {
    if (
      prevProps.person.C3_305737857578 !== this.props.person.C3_305737857578
    ) {
      this.setState({ spinning: true });
      await this.getYearsTarget(this.props.person.C3_305737857578);
      await this.getFormData(this.state.comment);
      this.setState({ spinning: false });
    }
    if (prevProps.selectYear.key !== this.props.selectYear.key) {
      this.setState(
        {
          comment: this.state.comments.find(
            item => item.C3_420150922019 === this.props.selectYear.label
          )
        },
        () => {
          const dataProp = getDataProp(
            this.formData,
            this.state.comment,
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
        resid,
        formName: '财年评语查看',
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
        resid,
        cparm1: id,
        dblinkname: 'ehr'
      });
      if (res.data.length) {
        this.setState({
          years: res.data,
          selectYear: res.data[0].C3_420150922019,
          comments: res.data,
          comment: res.data[0]
        });
      } else {
        this.setState({
          years: [],
          selectYear: '',
          comments: [],
          comment: {}
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
              info={{ dataMode: 'main', resid: resid }}
              operation="view"
              data={this.state.dataProp}
              record={this.state.comment}
              useAbsolute={true}
            />
          </Spin>
        </div>
      </div>
    );
  }
}
export default ViewComments;
