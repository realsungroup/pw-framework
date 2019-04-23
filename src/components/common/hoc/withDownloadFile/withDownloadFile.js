import React from 'react';
import { argumentContainer } from '../util';
import { message } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import { downloadFile } from 'Util20/util';

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
     */
    handleDownloadFile = async (
      requestBaseURL,
      downloadBaseURL,
      fileName,
      resid,
      cmsWhere,
      fileType = 'xls'
    ) => {
      this.setState({ loading: true });

      this.p1 = makeCancelable(
        http({ baseURL: requestBaseURL }).exportTableData({
          resid,
          cmswhere: cmsWhere,
          filetype: fileType
        })
      );
      let res;
      try {
        res = await this.p1.promise;
      } catch (err) {
        return message.error(err.message);
      }
      console.log({ requestBaseURL, downloadBaseURL });
      downloadFile(downloadBaseURL + res.data, fileName + '.xls');
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
