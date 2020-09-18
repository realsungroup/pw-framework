import React from 'react';
import PwForm from '../../ui/PwForm';
import AbsoluteForm from '../../ui/PwForm/AbsoluteForm';

import { message, Tabs, Spin, Icon } from 'antd';
import { dealFormData } from 'Util20/controls';
import { getResid } from 'Util20/util';
import { TableData } from '../../loadableCommon';
import classNames from 'classnames';
import './FormData.less';
import { propTypes, defaultProps } from './propTypes';
import http, { makeCancelable } from 'Util20/api';
import debounce from 'lodash/debounce';
import { isDateString } from 'Util20/util';
import moment from 'moment';

const TabPane = Tabs.TabPane;

const getSystemDefaultRecord = (dataArr, returnRecord) => {
  let ret = {};
  if (Array.isArray(dataArr) && typeof returnRecord === 'object') {
    dataArr.forEach(dataItem => {
      if (dataItem) {
        const { controlData, id } = dataItem;
        if (controlData && controlData.ColValDefault) {
          ret[id] = returnRecord[id];
        }
      }
    });
  }
  return ret;
};

const getConstantRecord = dataArr => {
  let ret = {};
  if (Array.isArray(dataArr)) {
    dataArr.forEach(dataItem => {
      if (dataItem) {
        const { controlData, id } = dataItem;
        if (controlData && controlData.ColValConstant) {
          ret[id] = controlData.ColValConstant;
        }
      }
    });
  }
  return ret;
};

/**
 * 是否有设置了系统默认属性的字段
 * @param {array} dataArr 控件数据
 */
const isHasSystemDefaultField = dataArr => {
  return dataArr.some(dataItem => {
    if (dataItem) {
      const { controlData } = dataItem;
      return !!controlData.ColValDefault;
    }
  });
};

/**
 * 显示记录的表单，且具有增改查功能
 */
class FormData extends React.Component {
  static displayName = 'FormData';
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    const { subTableArr } = props;
    const hasSubTables = Array.isArray(subTableArr) && !!subTableArr.length;
    this.state = {
      loading: false,
      defaultActiveKey: '-1',
      hasSubTables, // 是否有子表
      confirmLoading: false,
      loading: false,
      windowEnlarge: false
    };
  }

  componentDidMount = () => {
    const { subTableArr } = this.props;
    if (subTableArr && !!subTableArr.length) {
      // 等待抽屉动画完成，再去请求子表数据（否则抽屉动画会卡顿）
      setTimeout(() => {
        this.setState({ defaultActiveKey: '0' });
      }, 500);
    }
    this.getFormData();
  };

  getCFFormData = async () => {
    const {
      baseURL,
      info: { resid }
    } = this.props;
    const httpParams = {};
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    const res = await http(httpParams).beforeSaveAdd({
      resid,
      data: JSON.stringify([
        {
          _id: 1,
          _state: 'added'
        }
      ]),
      rp: { EnableFormulaVerify: 'false', EnableBitianCheck: false }
    });
    return res;
  };

  getFormData = () => {
    const { operation, beforeSaveConfig } = this.props;

    if (
      operation === 'add' &&
      beforeSaveConfig &&
      beforeSaveConfig.operation === 'add'
    ) {
      this.handleBeforeSaveAdd();
    }
  };

  handleBeforeSaveAdd = async () => {
    const { data } = this.props;
    const hasSystemDefault = isHasSystemDefaultField(data);
    let calcedFormData = {};
    // 系统默认值
    if (hasSystemDefault) {
      this.setState({ loading: true });
      let res;
      try {
        res = await this.getCFFormData();
      } catch (err) {
        this.setState({ loading: false });
        return message.error(err.message);
      }

      this.setState({ loading: false });

      if (res && res.data) {
        calcedFormData = getSystemDefaultRecord(data, res.data);
      }
    }
    // 常量
    calcedFormData = { ...calcedFormData, ...getConstantRecord(data) };

    // 设置表单值
    this.setFieldsValue(calcedFormData);
  };

  setFieldsValue = calcedFormData => {
    const form = this.form;
    const fields = Object.keys(form.getFieldsValue());
    const newFormData = {};
    fields.forEach(fieldName => {
      const value = calcedFormData[fieldName];
      if (isDateString(value)) {
        newFormData[fieldName] = moment(value);
      } else {
        newFormData[fieldName] = value;
      }
    });
    form.setFieldsValue(newFormData);
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  handleSave = form => {
    const {
      operation,
      info,
      record,
      storeWay,
      subTableArr,
      dblinkname,
      baseURL
    } = this.props;
    const { hasSubTables } = this.state;
    const { dataMode, resid, subresid, hostrecid } = info;
    const id = getResid(dataMode, resid, subresid);
    let httpParams = {};
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    form.validateFields(async (err, values) => {
      if (err) {
        return message.error('表单数据有误');
      }
      this.setState({ confirmLoading: true });
      let res;
      const formData = dealFormData(values);
      formData.REC_ID = record.REC_ID;

      // 后端存储，则发送请求
      if (storeWay === 'be') {
        // 添加且有子表
        if (operation === 'add' && hasSubTables) {
          const arr = subTableArr
            .map((subTable, index) => ({
              resid: subTable.subResid,
              dataSource: this[`tableDataRef${index}`].getDataSource()
            }))
            .filter(item => !!item.dataSource.length);

          let data;
          const state = operation === 'add' ? 'added' : 'modified';
          const dataObj = {
            resid,
            maindata: { ...formData, _id: 1, _state: state },
            _id: 1
          };

          let i = 0;
          arr.forEach(item => {
            item.dataSource.forEach(record => {
              if (!dataObj.subdata) {
                dataObj.subdata = [];
              }
              dataObj.subdata.push({
                resid: item.resid,
                maindata: { ...record, _state: state, _id: ++i }
              });
            });
          });

          if (dataObj.subdata) {
            dataObj.subdata.reverse();
          }

          data = [dataObj];

          this.p1 = makeCancelable(
            http(httpParams).saveRecordAndSubTables({ data, dblinkname })
          );
          try {
            res = await this.p1.promise;
          } catch (err) {
            message.error(err.message);
            this.setState({ confirmLoading: false });
            return console.error(err);
          }

          // 添加但无子表
        } else if (operation === 'add' && !hasSubTables) {
          const params = {
            resid: id,
            data: [formData],
            dblinkname
          };
          if (dataMode === 'sub') {
            params.hostresid = resid;
            params.hostrecid = hostrecid;
          }
          this.p1 = makeCancelable(http(httpParams).addRecords(params));
          try {
            res = await this.p1.promise;
          } catch (err) {
            this.setState({ confirmLoading: false });
            return message.error(err.message);
          }

          // 修改
        } else {
          const params = {
            resid: id,
            data: [formData],
            dblinkname
          };
          if (dataMode === 'sub') {
            params.hostresid = resid;
            params.hostrecid = hostrecid;
          }
          this.p1 = makeCancelable(http(httpParams).modifyRecords(params));
          try {
            res = await this.p1.promise;
          } catch (err) {
            console.error(err);
            this.setState({ confirmLoading: false });
            return message.error(err.message);
          }
        }

        // 前端存储，且有子表，则连子表数据一起发送到后端
      } else if (storeWay === 'fe' && hasSubTables) {
        const arr = subTableArr
          .map((subTable, index) => ({
            resid: subTable.subResid,
            dataSource: this[`tableDataRef${index}`].getDataSource()
          }))
          .filter(item => !!item.dataSource.length);

        let data;
        const state = operation === 'add' ? 'added' : 'modified';
        const dataObj = {
          resid,
          maindata: { ...formData, _id: 1, _state: state },
          _id: 1
        };

        let i = 0;
        arr.forEach(item => {
          item.dataSource.forEach(record => {
            if (!dataObj.subdata) {
              dataObj.subdata = [];
            }
            dataObj.subdata.push({
              resid: item.resid,
              maindata: { ...record, _state: state, _id: ++i }
            });
          });
        });

        if (dataObj.subdata) {
          dataObj.subdata.reverse();
        }

        data = [dataObj];

        this.p1 = makeCancelable(
          http(httpParams).saveRecordAndSubTables({ data, dblinkname })
        );
        try {
          res = await this.p1.promise;
        } catch (err) {
          this.setState({ confirmLoading: false });
          message.error(err.message);
          return console.error(err);
        }
      }
      let savedRecord = res && res.data[0]; //保存成功后的数据
      this.props.onSuccess &&
        this.props.onSuccess(
          operation,
          formData,
          savedRecord ? savedRecord : record,
          form
        );
      this.setState({ confirmLoading: false });
    });
  };

  handleSingleChange = debounce(async (filed, form) => {
    const { record, baseURL, resid, dblinkname } = this.props;
    let httpParams = {};
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    console.log(form.getFieldValue(filed));
    this.p2 = makeCancelable(
      http(httpParams).modifyRecords({
        resid,
        data: [{ REC_ID: record.REC_ID, [filed]: form.getFieldValue(filed) }],
        dblinkname
      })
    );
    try {
      const res = await this.p2.promise;
      console.log(res);
      record[filed] = form.getFieldValue(filed);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }, 800);

  handleReopenSave = form => {
    const {
      operation,
      info,
      record,
      storeWay,
      subTableArr,
      dblinkname,
      baseURL
    } = this.props;
    const { hasSubTables } = this.state;
    const { dataMode, resid, subresid, hostrecid } = info;
    const id = getResid(dataMode, resid, subresid);
    let httpParams = {};
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    form.validateFields(async (err, values) => {
      if (err) {
        return message.error('表单数据有误');
      }
      let res;
      const formData = dealFormData(values);
      formData.REC_ID = record.REC_ID;

      // 后端存储，则发送请求
      if (storeWay === 'be') {
        // 添加且有子表
        if (operation === 'add' && hasSubTables) {
          const arr = subTableArr
            .map((subTable, index) => ({
              resid: subTable.subResid,
              dataSource: this[`tableDataRef${index}`].getDataSource()
            }))
            .filter(item => !!item.dataSource.length);

          let data;
          const state = operation === 'add' ? 'added' : 'modified';
          const dataObj = {
            resid,
            maindata: { ...formData, _id: 1, _state: state },
            _id: 1
          };

          let i = 0;
          arr.forEach(item => {
            item.dataSource.forEach(record => {
              if (!dataObj.subdata) {
                dataObj.subdata = [];
              }
              dataObj.subdata.push({
                resid: item.resid,
                maindata: { ...record, _state: state, _id: ++i }
              });
            });
          });

          if (dataObj.subdata) {
            dataObj.subdata.reverse();
          }

          data = [dataObj];

          this.p1 = makeCancelable(
            http(httpParams).saveRecordAndSubTables({ data, dblinkname })
          );
          try {
            res = await this.p1.promise;
            console.log({ res });
          } catch (err) {
            message.error(err.message);
            return console.error(err);
          }

          // 添加但无子表
        } else if (operation === 'add' && !hasSubTables) {
          const params = {
            resid: id,
            data: [formData],
            dblinkname
          };
          if (dataMode === 'sub') {
            params.hostresid = resid;
            params.hostrecid = hostrecid;
          }
          this.p1 = makeCancelable(http(httpParams).addRecords(params));
          try {
            res = await this.p1.promise;
          } catch (err) {
            console.error(err);
            return message.error(err.message);
          }

          // 修改
        } else {
          const params = {
            resid: id,
            data: [formData],
            dblinkname
          };
          if (dataMode === 'sub') {
            params.hostresid = resid;
            params.hostrecid = hostrecid;
          }
          this.p1 = makeCancelable(http(httpParams).modifyRecords(params));
          try {
            res = await this.p1.promise;
          } catch (err) {
            console.error(err);
            return message.error(err.message);
          }
        }

        // 前端存储，且有子表，则连子表数据一起发送到后端
      } else if (storeWay === 'fe' && hasSubTables) {
        const arr = subTableArr
          .map((subTable, index) => ({
            resid: subTable.subResid,
            dataSource: this[`tableDataRef${index}`].getDataSource()
          }))
          .filter(item => !!item.dataSource.length);

        let data;
        const state = operation === 'add' ? 'added' : 'modified';
        const dataObj = {
          resid,
          maindata: { ...formData, _id: 1, _state: state },
          _id: 1
        };

        let i = 0;
        arr.forEach(item => {
          item.dataSource.forEach(record => {
            if (!dataObj.subdata) {
              dataObj.subdata = [];
            }
            dataObj.subdata.push({
              resid: item.resid,
              maindata: { ...record, _state: state, _id: ++i }
            });
          });
        });

        if (dataObj.subdata) {
          dataObj.subdata.reverse();
        }

        data = [dataObj];

        this.p1 = makeCancelable(
          http(httpParams).saveRecordAndSubTables({ data, dblinkname })
        );
        try {
          res = await this.p1.promise;
        } catch (err) {
          message.error(err.message);
          return console.error(err);
        }
      }
      let savedRecord = res && res.data[0]; //保存成功后的数据
      this.props.onReopenSaveSuccess &&
        this.props.onReopenSaveSuccess(
          operation,
          formData,
          savedRecord ? savedRecord : record,
          form
        );
    });
  };

  renderSubTables = () => {
    const { defaultActiveKey } = this.state;
    const { subTalbeLayout, subTableArr, data, width } = this.props;

    if (subTalbeLayout === 'tab') {
      return (
        <Tabs
          defaultActiveKey={defaultActiveKey}
          className={classNames('form-data__tabs', {
            'form-data__tabs--full': !data.length
          })}
          style={{ width: width.tabsWidth }}
        >
          {subTableArr.map((subTable, index) =>
            this.renderTabPane(subTable, index)
          )}
        </Tabs>
      );
    } else {
      return subTableArr.map((subTable, index) =>
        this.renderTabPane(subTable, index, false)
      );
    }
  };
  renderSubTablesAbsolute = (containerHeight, containerWidth) => {
    const { defaultActiveKey } = this.state;
    const { subTableArr, data } = this.props;

    return (
      <Tabs
        defaultActiveKey={defaultActiveKey}
        className={classNames('form-data__tabs', {
          'form-data__tabs--full': !data.length
        })}
        style={{
          width: subTableArr[0].FrmWidth,
          position: 'absolute',
          top: subTableArr[0].FrmTop - 45,
          left: subTableArr[0].FrmLeft
        }}
      >
        {subTableArr.map((subTable, index) =>
          this.renderTabPaneAbsolute(subTable, index, subTableArr)
        )}
      </Tabs>
    );
  };
  renderTabPaneAbsolute = (subTable, index, subTableArr) => {
    const { subTableArrProps, record, info, operation, baseURL } = this.props;
    const { resid } = info;

    const subTableProps = subTableArrProps.find(
      item => item.subResid === subTable.subResid
    );

    const { tableProps = {} } = subTableProps || {};

    const tab =
      (subTableProps && subTableProps.subTableName) || subTable.subResid;

    const props = {
      hasZoomInOut: false
    };

    const storeWay = operation === 'add' ? 'fe' : 'be';
    return (
      <TabPane tab={tab} key={index}>
        <div style={{ height: subTable.FrmHeight }}>
          <TableData
            wrappedComponentRef={element =>
              (this[`tableDataRef${index}`] = element)
            }
            refTargetComponentName="TableData"
            dataMode="sub"
            resid={resid}
            subresid={subTable.subResid}
            hostrecid={record.REC_ID}
            size="small"
            {...props}
            {...tableProps}
            storeWay={storeWay}
            height={subTableArr[0].FrmHeight}
            baseURL={baseURL}
          />
        </div>
      </TabPane>
    );
  };

  renderTabPane = (subTable, index, hasTabPane = true) => {
    const { subTableArrProps, record, info, operation } = this.props;
    const { resid } = info;

    const subTableProps = subTableArrProps.find(
      item => item.subResid === subTable.subResid
    );

    const { tableProps = {} } = subTableProps || {};

    const tab =
      (subTableProps && subTableProps.subTableName) || subTable.subResid;

    const props = {
      hasZoomInOut: false
    };

    const storeWay = operation === 'add' ? 'fe' : 'be';

    if (hasTabPane) {
      return (
        <TabPane tab={tab} key={index}>
          <TableData
            wrappedComponentRef={element =>
              (this[`tableDataRef${index}`] = element)
            }
            refTargetComponentName="TableData"
            dataMode="sub"
            resid={resid}
            subresid={subTable.subResid}
            hostrecid={record.REC_ID}
            size="small"
            {...props}
            {...tableProps}
            storeWay={storeWay}
          />
        </TabPane>
      );
    }

    return (
      <TableData
        key={index}
        wrappedComponentRef={element =>
          (this[`tableDataRef${index}`] = element)
        }
        refTargetComponentName="TableData"
        dataMode="sub"
        resid={resid}
        subresid={subTable.subResid}
        hostrecid={record.REC_ID}
        size="small"
        {...props}
        {...tableProps}
        storeWay={storeWay}
      />
    );
  };

  getForm = form => {
    this.form = form;
  };

  render() {
    const {
      formProps,
      operation,
      data,
      record,
      beforeSaveFields,
      info,
      width,
      dblinkname,
      useAbsolute,
      subTalbeLayout,
      style,
      layout,
      saveMode,
      baseURL,
      uploadConfig,
      mediaFieldBaseURL,
      labelRequiredList,
      recordFormHideFields
    } = this.props;
    const { hasSubTables, confirmLoading, loading } = this.state;
    const mode = operation === 'view' ? 'view' : 'edit';
    let otherProps = {};
    // 当为查看时，不显示 编辑、保存和取消按钮
    if (mode === 'view') {
      otherProps.hasEdit = false;
      otherProps.hasSave = false;
      otherProps.hasCancel = false;
    }
    const { resid } = info;
    let { containerControlArr } = data;
    const containerHeight =
      containerControlArr &&
      containerControlArr.length &&
      containerControlArr[0].FrmHeight;
    const containerWidth =
      containerControlArr &&
      containerControlArr.length &&
      containerControlArr[0].FrmWidth;

    const _useAbsolute = useAbsolute || layout === 'absolute';

    if (_useAbsolute) {
      return (
        <Spin spinning={loading}>
          <div className={this.state.windowEnlarge ? 'enlarged-size' : 'normal-size'}>
            {this.state.windowEnlarge ? <Icon type="fullscreen-exit" onClick={() => { this.setState({ windowEnlarge: false }); if (this.props.isExpand) { this.props.isExpand(false); }; }} /> : <Icon type="fullscreen" onClick={() => { this.setState({ windowEnlarge: true }); if (this.props.isExpand) { this.props.isExpand(true); }; }} />}
            <AbsoluteForm
              getForm={this.getForm}
              data={data}
              record={record}
              {...formProps}
              mode={mode}
              {...otherProps}
              onSave={this.handleSave}
              onCancel={this.props.onCancel}
              operation={operation}
              beforeSaveFields={beforeSaveFields}
              resid={resid}
              dblinkname={dblinkname}
              saveMode={saveMode}
              onSingleChange={this.handleSingleChange}
              uploadConfig={uploadConfig}
              mediaFieldBaseURL={mediaFieldBaseURL}
              baseURL={baseURL}
              labelRequiredList={labelRequiredList}
              recordFormHideFields={recordFormHideFields}
            />
            {hasSubTables &&
              this.renderSubTablesAbsolute(containerHeight, containerWidth)}
          </div>
        </Spin>
      );
    }

    return (
      <Spin spinning={loading}>
        <div className="form-data" style={style}>
          {!!data.length && (
            <div
              style={{
                width:
                  hasSubTables && subTalbeLayout === 'tab'
                    ? width.formWidth
                    : '100%'
              }}
              className={classNames({
                'form-data__form-wrap': subTalbeLayout === 'tab'
              })}
            >
              <PwForm
                getForm={this.getForm}
                data={data}
                {...formProps}
                mode={mode}
                {...otherProps}
                onSave={this.handleSave}
                onReopenSave={this.handleReopenSave}
                onCancel={this.props.onCancel}
                operation={operation}
                record={record}
                beforeSaveFields={beforeSaveFields}
                resid={resid}
                dblinkname={dblinkname}
                layout={
                  formProps && formProps.layout ? formProps.layout : layout
                }
                baseURL={baseURL}
                uploadConfig={uploadConfig}
                mediaFieldBaseURL={mediaFieldBaseURL}
                confirmLoading={confirmLoading}
                recordFormHideFields={recordFormHideFields}
              />
            </div>
          )}
          <div style={{ width: '100%' }}>
            {hasSubTables && this.renderSubTables()}
          </div>
        </div>
      </Spin>
    );
  }
}

export default FormData;
