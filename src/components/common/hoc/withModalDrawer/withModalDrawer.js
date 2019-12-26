import React from 'react';
import { argumentContainer } from '../util';
import { Modal, Drawer } from 'antd';

const Fragment = React.Fragment;

// 可选 Modal/Drawer 形式的容器高阶组件
const withModalDrawer = (options = {}) => {
  const { type = 'modal' } = options;
  return function(WrappedComponent) {
    class withModalDrawer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          type,
          containerProps: {},
          ChildComponent: null,
          childProps: {}
        };
      }

      /**
       * 打开 Modal or Drawer：由 type 参数决定
       * @param {string} type 类型：'modal' 模态窗 | 'drawer' 抽屉
       * @param {object} containerProps 容器（Modal | Drawer）接收的 props
       * @param {class | function} ChildComponent 放于容器中的子组件
       * @param {object} childProps 子组件接收的 props
       */
      handleOpenModalOrDrawer = (
        type,
        containerProps,
        ChildComponent,
        childProps
      ) => {
        this.setState({
          type,
          containerProps: { ...containerProps, visible: true },
          ChildComponent,
          childProps
        });
      };

      /**
       * 关闭 Modal or Drawer
       */
      handleCloseModalOrDrawer = () => {
        this.setState({
          containerProps: { ...this.state.containerProps, visible: false }
        });
      };

      renderContainer = () => {
        const { type, containerProps, ChildComponent, childProps } = this.state;
        const isRender = !!ChildComponent;

        if (!isRender) {
          return null;
        }
        if (type === 'modal') {
          return (
            <Modal {...containerProps}>
              <ChildComponent {...childProps} />
            </Modal>
          );
        } else {
          return (
            <Drawer
              {...containerProps}
              bodyStyle={{ height: containerProps.height - 55 || '100%' }}
            >
              <ChildComponent {...childProps} />
            </Drawer>
          );
        }
      };

      render() {
        return (
          <Fragment>
            <WrappedComponent
              {...this.props}
              openModalOrDrawer={this.handleOpenModalOrDrawer}
              closeModalOrDrawer={this.handleCloseModalOrDrawer}
            />
            {this.renderContainer()}
          </Fragment>
        );
      }
    }

    return argumentContainer(
      withModalDrawer,
      WrappedComponent,
      'withModalDrawer'
    );
  };
};

export default withModalDrawer;
