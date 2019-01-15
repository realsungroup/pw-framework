import React from 'react';
import { argumentContainer } from '../util';
import { ResizableBox } from 'react-resizable';

// 可缩放的高阶组件
const withResizeableBox = (options = {}) => {
  // const { resizeableBoxProps = { width: 600, height: 600 } } = options;
  return function(WrappedComponent) {
    class withResizeableBox extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      render() {
        return (
          <ResizableBox
            width={width}
            height={height}
            onResizeStop={this.handleResizeStop}
          >
            {this.renderPwTable()}
          </ResizableBox>
          <div
            className="with-zoom-in-out"
            ref={this.setDivRef}
            style={{ width, height }}
          >
            <WrappedComponent
              {...restProps}
              zoomIn={this.handleZoomIn}
              zoomOut={this.handleZoomOut}
            />
          </div>
        );
      }
    }
    return argumentContainer(withZoomInOut, WrappedComponent, 'withZoomInOut');
  };
};

export default withZoomInOut;
