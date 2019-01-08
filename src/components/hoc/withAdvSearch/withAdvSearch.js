import React from 'react';
import PropTypes from 'prop-types';
import http, { makeCancelable } from '../../../util/api';
import dealControlArr from '../../../util/controls';
import { argumentContainer } from '../util';
import { withHttpGetFormData } from '../withHttp';
import { message, Drawer } from 'antd';
import PwForm from '../../ui-components/PwForm';
const Fragment = React.Fragment;

// 带有抽屉形式的高级搜索高阶组件
const withAdvSearch = WrappedComponent => {
  class withAdvSearch extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        formData: undefined,
        drawerVisible: false
      };
    }

    handleAdvSearchClick = (resid, formName) => {
      if (!this.state.formData) {
        let formData;
        try {
          formData = this.props.onGetFormData(resid, formName);
        } catch (err) {
          return message.error(err.message);
        }
        this.setState({ formData, drawerVisible: true });
      } else {
        this.setState({ drawerVisible: true });
      }
    };

    handleClose = () => {
      this.setState({ drawerVisible: false });
    };

    render() {
      const { drawerVisible } = this.state;
      return (
        <Fragment>
          <WrappedComponent
            onAdvSearchClick={this.handleAdvSearchClick}
            {...this.props}
          />
          <Drawer
            title="高级搜索"
            placement="right"
            onClose={this.handleClose}
            visible={drawerVisible}
          >
            111
            {/* <PwForm /> */}
          </Drawer>
        </Fragment>
      );
    }
  }
  const enhancedAdvSearch = withHttpGetFormData(withAdvSearch);
  return argumentContainer(
    enhancedAdvSearch,
    WrappedComponent,
    'withAdvSearch'
  );
};

export default withAdvSearch;
