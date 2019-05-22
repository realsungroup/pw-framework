import React from 'react';
import { argumentContainer } from '../util';
import withModalDrawer from '../withModalDrawer';
import ImportExcel from './ImportExcel';

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
      baseURL,
      resid,
      mode,
      type = 'drawer',
      containerProps
    ) => {
      const importContainerProps = {
        title: '导入数据',
        width: 500,
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
      this.props.openModalOrDrawer(type, importContainerProps, ImportExcel, {
        resid,
        baseURL,
        mode
      });
    };

    handleClose = () => {
      this.props.closeModalOrDrawer();
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
          {...otherProps}
          openImportView={this.handleOpenImportView}
        />
      );
    }
  }

  const enhancedImport = withModalDrawer()(withImport);

  return argumentContainer(enhancedImport, WrappedComponent, 'withImport');
};

export default withImport;
