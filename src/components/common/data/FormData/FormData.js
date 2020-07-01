import React from 'react';
import PwForm from '../../ui/PwForm';
import AbsoluteForm from '../../ui/PwForm/AbsoluteForm';

import { message, Tabs } from 'antd';
import { dealFormData } from 'Util20/controls';
import { getResid } from 'Util20/util';
import { TableData } from '../../loadableCommon';
import classNames from 'classnames';
import './FormData.less';
import { propTypes, defaultProps } from './propTypes';
import http, { makeCancelable } from 'Util20/api';
import debounce from 'lodash/debounce';

const TabPane = Tabs.TabPane;

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
      hasSubTables // 是否有子表
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
          console.log({ res });
        } catch (err) {
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
          top: subTableArr[0].FrmTop,
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
      uploadConfig
    } = this.props;
    const { hasSubTables } = this.state;
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
        <>
          <AbsoluteForm
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
          />
          {hasSubTables &&
            this.renderSubTablesAbsolute(containerHeight, containerWidth)}
        </>
      );
    }

    return (
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
              layout={formProps && formProps.layout ? formProps.layout : layout}
              baseURL={baseURL}
              uploadConfig={uploadConfig}
            />
          </div>
        )}
        <div style={{ width: '100%' }}>
          {hasSubTables && this.renderSubTables()}
        </div>
      </div>
    );
  }
}

export default FormData;
