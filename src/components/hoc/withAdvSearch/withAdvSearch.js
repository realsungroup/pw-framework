import React from 'react';
import PropTypes from 'prop-types';
import http, { makeCancelable } from '../../../util/api';
import dealControlArr from '../../../util/controls';
import { argumentContainer } from '../util';
import { withHttpGetFormData } from '../withHttp';
import { message, Drawer } from 'antd';
import PwForm from '../../ui-components/PwForm';
import withFormDataProp from '../withFormDataProp';
import { dealFormData } from '../../../util/controls';
import { getCmsWhere } from '../../../util/util';

const Fragment = React.Fragment;

// 带有抽屉形式的高级搜索高阶组件
const withAdvSearch = WrappedComponent => {
  class withAdvSearch extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        formData: undefined,
        drawerVisible: false,
        drawerProps: {} // 抽屉接受的 props
      };
    }

    /**
     * 显示高级搜索
     * @param {number} resid 资源 id
     * @param {string} formName 窗体名称，如 'default'
     * @param {object} advSearchFormProps 高级查询中 PwForm 所接收的 props
     * @param {function} getCmsWhere 获取 cmswhere 的回调函数
     */
    handleShowAdvSearch = async (
      resid,
      formName,
      advSearchFormProps,
      getCmsWhere
    ) => {
      let formData, newState;
      // 第一次打开高级搜索，还没有获取窗体数据
      if (!this.state.formData) {
        try {
          // 使用 withHttpGetFormData 高阶组件传入的 httpGetFormData 方法获取窗体数据
          formData = await this.props.httpGetFormData(resid, formName);
        } catch (err) {
          return message.error(err.message);
        }
        newState = { formData, drawerVisible: true };

        // 获取 PwFrom 所接收的 data prop
        // 使用了 withFormDataProp 高阶组件传入的 getDataProp 方法
        this.props.getDataProp('edit', {}, formData, advSearchFormProps);
        this._getCmsWhere = getCmsWhere;

        // 已经获取到了窗体数据
      } else {
        newState = { drawerVisible: true };
        this.setState({ drawerVisible: true });
      }
      this.setState(newState);
    };

    handleClose = () => {
      this.setState({ drawerVisible: false });
    };

    handleSetAdvProps = (drawerProps, formProps) => {
      this.setState({ drawerProps, formProps });
    };

    handleGetCmsWhere = form => {
      form.validateFields(async (err, values) => {
        if (err) {
          return message.error('表单数据有误');
        }
        const formData = dealFormData(values);
        const cmsWhere = getCmsWhere(formData);

        console.log({ whereWhere: cmsWhere });

        this._getCmsWhere(cmsWhere);
      });
    };

    render() {
      const { drawerVisible, drawerProps, formProps } = this.state;
      const { data } = this.props;

      return (
        <Fragment>
          <WrappedComponent
            showAdvSearch={this.handleShowAdvSearch}
            setProps={this.handleSetAdvProps}
            {...this.props}
          />
          <Drawer
            title="高级搜索"
            placement="right"
            onClose={this.handleClose}
            visible={drawerVisible}
            width={500}
            {...drawerProps}
          >
            <PwForm
              saveText="搜索"
              hasEdit={false}
              hasCancel={false}
              onSave={this.handleGetCmsWhere}
              data={data}
              {...formProps}
            />
          </Drawer>
        </Fragment>
      );
    }
  }

  const enhancedAdvSearch = withFormDataProp(
    withHttpGetFormData(withAdvSearch)
  );
  return argumentContainer(
    enhancedAdvSearch,
    WrappedComponent,
    'withAdvSearch'
  );
};

export default withAdvSearch;
