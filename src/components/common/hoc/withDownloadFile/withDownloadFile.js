import React from 'react';
import { argumentContainer } from '../util';
import { message } from 'antd';
import http, { makeCancelable } from 'Util20/api';

// 带有下载文件功能的高阶组件
const withDownloadFile = WrappedComponent => {
  class withDownloadFile extends React.Component {
    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };

    /**
     * 下载文件
     * @param {string} requestBaseURL 请求文件下载的地址的基地址，如：http://localhost:3000
     * @param {string} downloadBaseURL 下载文件的基地址，如：http://localhost:3000
     * @param {string} fileName 文件名称，如：'人员信息表'
     * @param {string} resid 资源 id
     * @param {cmsWhere} where where 语句，如："name = 'xl' and age = '22'"
     * @param {string} fileType 文件类型，默认：'xls'
     * @param {string} dblinkname 数据库链接名称
     */
    handleDownloadFile = async (
      requestBaseURL,
      downloadBaseURL,
      fileName,
      resid,
      hostresid,
      hostrecid,
      cmsWhere,
      fileType = 'xls',
      dblinkname
    ) => {
      this.setState({ loading: true });
      console.log("withDownloadFile");
      console.log(hostresid);
      console.log(hostrecid);
      this.p1 = makeCancelable(
        http({ baseURL: requestBaseURL }).exportTableData({
          resid,
          hostresid,
          hostrecid,
          cmswhere: cmsWhere,
          filetype: fileType,
          dblinkname
        })
      );
      let res;
      try {
        res = await this.p1.promise;
      } catch (err) {
        return message.error(err.message);
      }

      let name = fileName;
      if (res.data) {
        const index = res.data.lastIndexOf('/');
        name = res.data.slice(index + 1);
      }

      window.open(downloadBaseURL + res.data);
      return;
    };

    render() {
      const name = WrappedComponent.displayName || WrappedComponent.name;
      const otherProps = {};
      if (name === this.props.refTargetComponentName) {
        otherProps.ref = this.props.wrappedComponentRef;
      }
      return (
        <WrappedComponent
          {...this.props}
          downloadFile={this.handleDownloadFile}
          {...otherProps}
        />
      );
    }
  }

  return argumentContainer(
    withDownloadFile,
    WrappedComponent,
    'withDownloadFile'
  );
};

export default withDownloadFile;
