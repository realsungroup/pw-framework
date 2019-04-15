import React from 'react';
import { argumentContainer } from '../util';
import { ResizableBox } from 'react-resizable';

// 放大（放大到父元素大小）缩小（缩小到原来大小）高阶组件
const withZoomInOut = (options = {}) => {
  // const { resizeableBoxProps = { width: 600, height: 600 } } = options;
  return function(WrappedComponent) {
    class withZoomInOut extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }

      componentDidMount = () => {
        this._width = this.divRef.clientWidth + 'px';
        this._height = this.divRef.clientHeight + 'px';
      };

      setDivRef = element => {
        this.divRef = element;
      };

      // 放大
      handleZoomIn = () => {
        const parentNode = this.divRef.parentNode;
        this.divRef.style.width = parentNode.clientWidth + 'px';
        this.divRef.style.height = parentNode.clientHeight + 'px';
      };

      // 缩小
      handleZoomOut = () => {
        this.divRef.style.width = this._width;
        this.divRef.style.height = this._height;
      };

      render() {
        const { width = '100%', height = '100%' } = this.props;
        const name = WrappedComponent.displayName || WrappedComponent.name;
        const otherProps = {};
        if (name === this.props.refTargetComponentName) {
          otherProps.ref = this.props.wrappedComponentRef;
        }
        return (
          <div
            className="with-zoom-in-out"
            ref={this.setDivRef}
            style={{ width, height }}
          >
            <WrappedComponent
              {...this.props}
              {...otherProps}
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
