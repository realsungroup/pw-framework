import React from 'react';
import { argumentContainer } from '../util';
import withModalDrawer from '../withModalDrawer';
import Import from './Import';

// 导入数据的高阶组件
const withImport = WrappedComponent => {
  class withImport extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this._isFirstLoad = true;
    }

    componentWillUnmount = () => {
      this.p1 && this.p1.cancel();
    };

    /**
     * 打开导入窗口界面
     * @param {number} resid 资源 id
     */
    handleOpenImportView = async (
      resid,
      type = 'drawer',
      containerProps = {
        title: '导入数据',
        width: 500
      }
    ) => {
      const importContainerProps = {
        ...containerProps
      };
      if (type === 'modal') {
        importContainerProps.onCancel = this.handleClose;
      } else if (type === 'drawer') {
        importContainerProps.onClose = this.handleClose;
      } else {
        throw new Error('`type` 应为 `modal` 或 `drawer`');
      }

      // 还未请求导入配置
      this.props.openModalOrDrawer(type, importContainerProps, Import, {
        resid
      });
    };

    handleClose = () => {
      this.props.closeModalOrDrawer();
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          openImportView={this.handleOpenImportView}
        />
      );
    }
  }

  const enhancedImport = withModalDrawer()(withImport);

  return argumentContainer(enhancedImport, WrappedComponent, 'withImport');
};

export default withImport;
