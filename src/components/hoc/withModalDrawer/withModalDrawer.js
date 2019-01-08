import React from 'react';
import { argumentContainer } from '../util';
import { Modal, Drawer } from 'antd';

const Fragment = React.Fragment;

// 带有 Modal/Drawer 形式的容器高阶组件
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

      handleOpenModalOrDrawer = (
        type,
        containerProps,
        ChildComponent,
        childProps
      ) => {
        this.setState({ type, containerProps, ChildComponent, childProps });
      };

      handleCloseModalOrDrawer = () => {
        this.setState({
          containerProps: { ...this.state.containerProps, visible: false }
        });
      };

      renderContainer = () => {
        const { type, containerProps, ChildComponent, childProps } = this.state;
        const isRender = ChildComponent;
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
            <Drawer {...containerProps}>
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
