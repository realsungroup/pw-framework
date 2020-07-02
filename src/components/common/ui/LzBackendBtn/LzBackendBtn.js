import React from 'react';
import { Popconfirm, message, Button } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import { withHttpGetFormData } from '../../hoc/withHttp';
import { propTypes, defaultProps } from './propTypes';
import { getDataProp } from 'Util20/formData2ControlsData';

const btnSizeMap = {
  large: 'large',
  middle: 'default',
  small: 'small'
};

const style = {
  margin: '0 4px'
};

/**
 * 后端按钮
 */
class LzBackendBtn extends React.PureComponent {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  state = { loading: false, getFormDataLoading: false };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  getDefaultRecord = btnInfo => {
    const record = {};
    if (btnInfo.ColName1) {
      record[btnInfo.ColName1] = btnInfo.ColVal1;
    }
    if (btnInfo.ColName2) {
      record[btnInfo.ColName2] = btnInfo.ColVal2;
    }
    if (btnInfo.ColName3) {
      record[btnInfo.ColName3] = btnInfo.ColVal3;
    }
    if (btnInfo.ColName4) {
      record[btnInfo.ColName4] = btnInfo.ColVal4;
    }
    return record;
  };

  _formData = null;
  _defaultRecord = null;
  onConfirm = async () => {
    const {
      resid,
      records,
      onConfirm,
      btnInfo,
      backendBtnType,
      recordFormDisplayMode,
      baseURL
    } = this.props;
    const { Code, OkMsgCn, FailMsgCn, Type } = btnInfo;
    const httpParams = {};
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }

    // 点击后端按钮，请求后台
    if (Type === 1 || Type === 5) {
      let res,
        recids = '';
      if (!records.length) {
        return message.error('请勾选记录');
      }
      records.forEach((record, index) => {
        records.length - 1 === index
          ? (recids += record.REC_ID)
          : (recids += record.REC_ID + ',');
      });
      this.setState({ loading: true });
      this.p1 = makeCancelable(
        http(httpParams).dealButton({
          resid,
          recids,
          strCommand: Code
        })
      );
      try {
        res = await this.p1.promise;
      } catch (err) {
        return message.error(FailMsgCn);
      }
      message.success(OkMsgCn);
      onConfirm && onConfirm(backendBtnType, Type, records);

      // 跳转地址的按钮
    } else if (Type === 4 || Type === 3) {
      const { Url } = this.props.btnInfo;
      // window.open(Url, '_blank');
      onConfirm &&
        onConfirm(
          backendBtnType,
          Type,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          Url
        );

      // 打开指定的 formName 的表单进行 编辑（6）/ 查看（7）/ 添加（8）
    } else if (Type === 6 || Type === 7 || Type === 8) {
      let formData = this._formData,
        defaultRecord = this._defaultRecord;

      // 窗体数据或默认记录值不存在
      if (!formData || !defaultRecord) {
        this.setState({ getFormDataLoading: true });
        try {
          formData = await this.props.httpGetFormData(
            resid,
            btnInfo.FormName || 'default',
            baseURL
          );
        } catch (err) {
          this.setState({ getFormDataLoading: false });
          return message.error(err.message);
        }
        defaultRecord = this.getDefaultRecord(btnInfo);

        // 缓存 formData 和 defaultRecord
        this._formData = formData;
        this._defaultRecord = defaultRecord;
        this._controlData = getDataProp(
          this._formData,
          records.length === 1 ? records[0] : {},
          false,
          recordFormDisplayMode === 'classify'
        );
        this.setState({ getFormDataLoading: false });
      }
      this.setState({ loading: true });
      onConfirm &&
        onConfirm(
          backendBtnType,
          Type,
          records,
          this._controlData,
          defaultRecord,
          formData
        );
    }
    this.setState({ loading: false });
  };

  render() {
    const { btnInfo, size, popConfirmProps } = this.props;
    const { getFormDataLoading } = this.state;
    const { Url, Type } = btnInfo;
    // if (Type !== 4 && Url) {
    //   return null;
    // }
    // 有 Popconfirm 组件
    if (btnInfo.isUsePopconfirm) {
      return (
        <Popconfirm
          key={btnInfo.Name1}
          placement="top"
          title={btnInfo.ConfirmMsgCn}
          onConfirm={this.onConfirm}
          okText="确定"
          cancelText="取消"
          {...popConfirmProps}
        >
          <Button
            style={style}
            loading={this.state.loading}
            size={btnSizeMap[size]}
          >
            {btnInfo.Name1}
          </Button>
        </Popconfirm>
      );

      // 无 Popconfirm 组件
    } else {
      return (
        <Button style={style} size={btnSizeMap[size]} onClick={this.onConfirm} loading={getFormDataLoading}>
          {btnInfo.Name1}
        </Button>
      );
    }
  }
}

export default withHttpGetFormData(LzBackendBtn);
