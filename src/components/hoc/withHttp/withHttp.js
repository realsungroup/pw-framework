import React from 'react';
import PropTypes from 'prop-types';
import http, { makeCancelable } from '../../../util/api';
import { argumentContainer } from '../util';
import { extractAndDealBackendBtns } from '../../../util/beBtns';
import dealControlArr from '../../../util/controls';

// 添加记录
export const withHttpAddRecords = WrappedComponent => {
  class withHttpAddRecords extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };

    handleAdd = (id, data, isEditOrAdd = false) => {
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
      return <WrappedComponent onAdd={this.handleAdd} {...this.props} />;
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
    handleModify = (id, data, isEditOrAdd = false) => {
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
      return <WrappedComponent onModify={this.handleModify} {...this.props} />;
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
    handleRemove = async (id, data, isEditOrAdd = false) => {
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
      return <WrappedComponent onDelete={this.handleRemove} {...this.props} />;
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
    handleGetTableData = (
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
      return (
        <WrappedComponent
          onGetTableData={this.handleGetTableData}
          {...this.props}
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
    handleGetSubTableData = (
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
      return (
        <WrappedComponent
          onGetSubTableData={this.handleGetSubTableData}
          {...this.props}
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
    handleGetBeBtns = async resid => {
      this.p1 = makeCancelable(http().getBeBtns({ resid }));
      let res;
      try {
        res = await this.p1.promise;
      } catch (err) {
        throw new Error(err);
      }
      const {
        beBtnsMultiple,
        beBtnsSingle,
        beBtnsOther
      } = extractAndDealBackendBtns(res.data);
      return { beBtnsMultiple, beBtnsSingle, beBtnsOther };
    };
    render() {
      return (
        <WrappedComponent onGetBeBtns={this.handleGetBeBtns} {...this.props} />
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

    handleGetFormData = async (resid, formName) => {
      this.p1 = makeCancelable(
        http().getFormData({
          resid,
          formname: formName
        })
      );
      let res;
      try {
        res = await this.p1.promise;
      } catch (err) {
        throw new Error(err);
      }
      const modalFormData = dealControlArr(res.data.columns);
      return modalFormData;
    };
    render() {
      return (
        <WrappedComponent
          onGetFormData={this.handleGetFormData}
          {...this.props}
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
