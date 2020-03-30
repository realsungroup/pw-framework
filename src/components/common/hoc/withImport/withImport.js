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
     * @param {string} dblinkname 数据库链接名称
     * @param {string} baseURL 基地址
     * @param {number} resid 资源 id
     * @param {string} mode 导入模式
     * @param {string} type 类型
     * @param {string} saveState 保存数据的模式
     * @param {object} containerProps 容器接收的 props
     * @param {function} onFinishImport 导入完成后的回调
     */
    handleOpenImportView = async (
      dblinkname,
      baseURL,
      resid,
      mode,
      type = 'drawer',
      saveState,
      containerProps,
      onFinishImport
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
        mode,
        saveState,
        dblinkname,
        onFinishImport
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
