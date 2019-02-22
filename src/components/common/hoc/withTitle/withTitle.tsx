import React from 'react';
import { argumentContainer } from '../util';

// 修改 document.title 的高阶组件
const withTitle = (title: string) => {
  const tempTitle: string = title;
  return function(WrappedComponent) {
    class withTitle extends React.Component {
      componentDidMount = () => {
        if (tempTitle) {
          document.title = tempTitle;
        }
      };

      handleModifyDocumentTitle = (title: string) => {
        document.title = title;
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            modifyDocumentTitle={this.handleModifyDocumentTitle}
          />
        );
      }
    }
    return argumentContainer(withTitle, WrappedComponent, 'withTitle');
  };
};

export default withTitle;
