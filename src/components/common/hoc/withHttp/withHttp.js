import React from 'react';
import http, { makeCancelable } from 'Util20/api';
import { argumentContainer } from '../util';
import { extractAndDealBackendBtns } from 'Util20/beBtns';
import dealControlArr, { dealFormData } from 'Util20/controls';
import { isDateString } from 'Util20/util';
import moment from 'moment';

// 添加记录
export const withHttpAddRecords = WrappedComponent => {
  class withHttpAddRecords extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };

    /**
     * 添加记录
     * @param {number} id 资源 id
     * @param {array} data 需要添加的记录数组
     * @param {boolean} isEditOrAdd _state 是否由 'added' 改为 'editoradd'，默认值：false
     * @return {promise} 返回 promise
     */
    handleHttpAddRecords = (id, data, isEditOrAdd = false) => {
      this.p1 = makeCancelable(
        http().addRecords({
          resid: id,
          data,
          isEditOrAdd
        })
      );
      return this.p1.promise;
    };

    render() {
      return (
        <WrappedComponent
          httpAddRecords={this.handleHttpAddRecords}
          {...this.props}
        />
      );
    }
  }
  return argumentContainer(
    withHttpAddRecords,
    WrappedComponent,
    'withHttpAddRecords'
  );
};

// 修改记录
export const withHttpModifyRecords = WrappedComponent => {
  class withHttpModifyRecords extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };

    handleHttpModifyRecords = (id, data, isEditOrAdd = false) => {
      this.p1 = makeCancelable(
        http().modifyRecords({
          resid: id,
          data,
          isEditOrAdd
        })
      );
      return this.p1.promise;
    };
    render() {
      return (
        <WrappedComponent
          httpModifyRecords={this.handleHttpModifyRecords}
          {...this.props}
        />
      );
    }
  }
  return argumentContainer(
    withHttpModifyRecords,
    WrappedComponent,
    'withHttpModifyRecords'
  );
};

// 删除记录
export const withHttpRemoveRecords = WrappedComponent => {
  class withHttpRemoveRecords extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };
    handleHttpRemoveRecords = async (id, data, isEditOrAdd = false) => {
      this.p1 = makeCancelable(
        http().removeRecords({
          resid: id,
          data,
          isEditOrAdd
        })
      );
      return this.p1.promise;
    };
    render() {
      const name = WrappedComponent.displayName || WrappedComponent.name;
      const otherProps = {};
      if (name === this.props.refTargetComponentName) {
        otherProps.ref = this.props.wrappedComponentRef;
      }
      return (
        <WrappedComponent
          httpRemoveRecords={this.handleHttpRemoveRecords}
          {...this.props}
          {...otherProps}
        />
      );
    }
  }
  return argumentContainer(
    withHttpRemoveRecords,
    WrappedComponent,
    'withHttpRemoveRecords'
  );
};

// 获取主表数据
export const withHttpGetTableData = WrappedComponent => {
  class withHttpGetTableData extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };
    handleHttpGetTableData = (
      resid,
      key,
      cmswhere,
      cmscolumns,
      pageIndex,
      pageSize,
      sortOrder,
      sortField,
      getcolumninfo
    ) => {
      const params = {
        resid,
        key,
        cmswhere,
        cmscolumns,
        pageindex: pageIndex,
        pagesize: pageSize,
        sortOrder,
        sortField,
        getcolumninfo // 需要这个参数为 1，才能获取到字段信息
      };
      this.p1 = makeCancelable(http().getTable(params));
      return this.p1.promise;
    };
    render() {
      const name = WrappedComponent.displayName || WrappedComponent.name;
      const otherProps = {};
      if (name === this.props.refTargetComponentName) {
        otherProps.ref = this.props.wrappedComponentRef;
      }
      return (
        <WrappedComponent
          httpGetTableData={this.handleHttpGetTableData}
          {...this.props}
          {...otherProps}
        />
      );
    }
  }
  return argumentContainer(
    withHttpGetTableData,
    WrappedComponent,
    'withHttpGetTableData'
  );
};

// 获取子表数据
export const withHttpGetSubTableData = WrappedComponent => {
  class withHttpGetSubTableData extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };
    handleHttpGetSubTableData = (
      resid,
      subresid,
      hostrecid,
      key,
      cmswhere,
      cmscolumns,
      pageIndex,
      pageSize,
      sortOrder,
      sortField,
      getcolumninfo
    ) => {
      const params = {
        resid,
        subresid,
        hostrecid,
        key,
        cmswhere,
        cmscolumns,
        pageindex: pageIndex,
        pagesize: pageSize,
        sortOrder,
        sortField,
        getcolumninfo // 需要这个参数为 1，才能获取到字段信息
      };
      this.p1 = makeCancelable(http().getSubTable(params));
      return this.p1.promise;
    };
    render() {
      const name = WrappedComponent.displayName || WrappedComponent.name;
      const otherProps = {};
      if (name === this.props.refTargetComponentName) {
        otherProps.ref = this.props.wrappedComponentRef;
      }
      return (
        <WrappedComponent
          httpGetSubTableData={this.handleHttpGetSubTableData}
          {...this.props}
          {...otherProps}
        />
      );
    }
  }
  return argumentContainer(
    withHttpGetSubTableData,
    WrappedComponent,
    'withHttpGetSubTableData'
  );
};

// 获取后端按钮数据
export const withHttpGetBeBtns = WrappedComponent => {
  class withHttpGetBeBtns extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };
    handleHttpGetBeBtns = async (resid, baseURL) => {
      const httpParams = {};
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }

      this.p1 = makeCancelable(http(httpParams).getBeBtns({ resid }));
      let res;
      try {
        res = await this.p1.promise;
      } catch (err) {
        return console.error(err.message);
      }
      const {
        beBtnsMultiple,
        beBtnsSingle,
        beBtnsOther
      } = extractAndDealBackendBtns(res.data);
      return { beBtnsMultiple, beBtnsSingle, beBtnsOther };
    };
    render() {
      const name = WrappedComponent.displayName || WrappedComponent.name;
      const otherProps = {};
      if (name === this.props.refTargetComponentName) {
        otherProps.ref = this.props.wrappedComponentRef;
      }
      return (
        <WrappedComponent
          httpGetBeBtns={this.handleHttpGetBeBtns}
          {...this.props}
          {...otherProps}
        />
      );
    }
  }
  return argumentContainer(
    withHttpGetBeBtns,
    WrappedComponent,
    'withHttpGetBeBtns'
  );
};

// 获取窗体数据
export const withHttpGetFormData = WrappedComponent => {
  class withHttpGetFormData extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };

    /**
     * 获取窗体数据，且处理窗体数据
     * @param {number} resid 资源 id
     * @param {string} formName 窗体名称
     * @return {promise} 返回 promise，await promise 后的值为 formData
     */
    handleHttpGetFormData = async (resid, formName, baseURL) => {
      const httpParams = {};
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }

      this.p1 = makeCancelable(
        http(httpParams).getFormData({
          resid,
          formname: formName
        })
      );
      let res;
      try {
        res = await this.p1.promise;
      } catch (err) {
        return console.error(err);
      }
      const formData = dealControlArr(res.data.columns);
      return formData;
    };
    render() {
      const name = WrappedComponent.displayName || WrappedComponent.name;
      const otherProps = {};
      if (name === this.props.refTargetComponentName) {
        otherProps.ref = this.props.wrappedComponentRef;
      }
      return (
        <WrappedComponent
          httpGetFormData={this.handleHttpGetFormData}
          {...this.props}
          {...otherProps}
        />
      );
    }
  }
  return argumentContainer(
    withHttpGetFormData,
    WrappedComponent,
    'withHttpGetFormData'
  );
};

// 保存前获取表单数据（通过计算公式），且将获取到的数据填写到表单中
export const withHttpBeforeSave = (options = {}) => {
  const { resid } = options;

  return function(WrappedComponent) {
    class withHttpBeforeSave extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          resid
        };
      }

      componentWillUnmount = () => {
        this.p1 && this.p1.cancel();
      };

      /**
       * 保存前获取表单数据（通过计算公式）
       * @param {number} resid 资源 id
       * @param {object} form form 对象
       * @param {string} operation 操作
       */
      handleHttpBeforeSave = async (resid, record, form, operation) => {
        const formData = dealFormData(form.getFieldsValue());
        console.log({ resid });

        formData.REC_ID = record.REC_ID || 0;
        const data = [formData];
        if (operation === 'add') {
          this.p1 = makeCancelable(
            http().beforeSaveAdd({
              resid: resid || this.state.resid,
              data
            })
          );
        } else if (operation === 'modify') {
          this.p1 = makeCancelable(
            http().beforeSaveModify({
              resid: resid || this.state.resid,
              data
            })
          );
        } else {
          console.log({ operation });
          throw new Error('`operation` 值应为 `add` 或 `modify`');
        }

        let res;
        try {
          res = await this.p1.promise;
        } catch (err) {
          return console.error({ err });
        }

        const fields = Object.keys(form.getFieldsValue());
        const newFormData = {};

        fields.forEach(fieldName => {
          const value = res.data[fieldName];
          if (isDateString(value)) {
            newFormData[fieldName] = moment(value);
          } else {
            newFormData[fieldName] = value;
          }
        });

        form.setFieldsValue(newFormData);
      };
      render() {
        return (
          <WrappedComponent
            httpBeforeSave={this.handleHttpBeforeSave}
            {...this.props}
          />
        );
      }
    }
    return argumentContainer(
      withHttpBeforeSave,
      WrappedComponent,
      'withHttpBeforeSave'
    );
  };
};
