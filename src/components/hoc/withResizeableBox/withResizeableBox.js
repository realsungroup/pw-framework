import React from 'react';
import { argumentContainer } from '../util';
import { ResizableBox } from 'react-resizable';

// resize 高阶组件
const withResizeableBox = (options = {}) => {
  const { resizeableBoxProps = { width: 600, height: 600 } } = options;
  return function(WrappedComponent) {
    class withResizeableBox extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          resizeableBoxProps,
          hasResizeBox: false
        };
      }

      handleSetResizeBoxSize = resizeableBoxProps => {
        this.setState({ resizeableBoxProps, hasResizeBox: true });
      };

      render() {
        const { resizeableBoxProps, hasResizeBox } = this.state;
        if (hasResizeBox) {
          return (
            <ResizableBox {...resizeableBoxProps}>
              <WrappedComponent
                {...this.props}
                setResizeBoxSize={this.handleSetResizeBoxSize}
              />
            </ResizableBox>
          );
        } else {
          return (
            <WrappedComponent
              {...this.props}
              setResizeBoxSize={this.handleSetResizeBoxSize}
            />
          );
        }
      }
    }
    return argumentContainer(
      withResizeableBox,
      WrappedComponent,
      'withResizeableBox'
    );
  };
};

export default withResizeableBox;
