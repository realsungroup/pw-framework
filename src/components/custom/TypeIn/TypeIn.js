import React from 'react';
import PropTypes from 'prop-types';
import './TypeIn.less';
import { FormData } from '../../common/loadableCommon';
import http, { makeCancelable } from 'Util20/api';
import { message } from 'antd';
import dealControlArr from 'Util20/controls';
import { getDataProp } from 'Util20/formData2ControlsData';

/**
 * 录入功能
 */
export default class TypeIn extends React.Component {
  static propTypes = {
    /**
     * 资源 id
     */
    resid: PropTypes.number,

    /**
     * 窗体名称
     */
    formName: PropTypes.string
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataProp: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { resid, formName } = this.props;
    let res;
    this.p1 = makeCancelable(http().getFormData({ resid, formname: formName }));
    try {
      res = await this.p1.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const formData = dealControlArr(res.data.columns);

    const dataProp = getDataProp(formData, {}, false, true);

    this.setState({ dataProp });
  };

  handleAfterConfirm = () => {
    message.success('录入成功');
  };

  render() {
    const { resid } = this.props;
    const { dataProp } = this.state;
    return (
      <div className="type-in">
        <FormData
          info={{ dataMode: 'main', resid }}
          data={dataProp}
          formProps={{ displayMode: 'classify', hasCancel: false }}
          onConfirm={this.handleAfterConfirm}
        />
      </div>
    );
  }
}
