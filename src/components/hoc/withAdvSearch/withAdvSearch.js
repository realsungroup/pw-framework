import React from 'react';
import { argumentContainer } from '../util';
import { withHttpGetFormData } from '../withHttp';
import { message, Drawer } from 'antd';
import PwForm from '../../ui-components/PwForm';
import { dealFormData } from '../../../util/controls';
import { getCmsWhere } from '../../../util/util';
import { getDataProp } from '../../../util/formData2ControlsData';
import withModalDrawer from '../withModalDrawer';
const Fragment = React.Fragment;

// 显示高级搜索的高阶组件
const withAdvSearch = (options = {}) => {
  const { type = 'drawer' } = options;
  return function(WrappedComponent) {
    class withAdvSearch extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          type,
          formData: undefined,
          drawerVisible: false,
          drawerProps: {}, // 抽屉接受的 props
          data: null,
          advSearchFormProps: {},
          advSearchValidationFields: [],
          visible: false
        };
      }

      /**
       * 显示高级搜索
       * @param {string} type 容器类型：'modal' 模态窗 | 'drawer' 抽屉
       * @param {number} resid 资源 id
       * @param {string} formName 窗体名称，如 'default'
       * @param {array} advSearchValidationFields 高级查询中需要有验证的字段，如：['name', 'age']
       * @param {function} getCmsWhere 获取 cmswhere 的回调函数
       * @param {object} containerProps 容器接收的 props（Modal 或 Drawer）
       * @param {object} formProps PwForm 接收的 props
       */
      handleOpenAdvSearch = async (
        type = 'drawer',
        resid,
        formName,
        advSearchValidationFields,
        getCmsWhere,
        containerProps = {},
        formProps = {}
      ) => {
        let formData, newState;
        // 第一次打开高级搜索，还没有获取窗体数据
        if (!this.state.data) {
          try {
            // 使用 withHttpGetFormData 高阶组件传入的 httpGetFormData 方法获取窗体数据
            formData = await this.props.httpGetFormData(resid, formName);
          } catch (err) {
            return message.error(err.message);
          }

          // 获取 PwFrom 所接收的 data prop
          const data = getDataProp(formData, {}, true, false, []);
          newState = {
            type,
            data,
            advSearchValidationFields,
            containerProps,
            formProps,
            visible: true
          };

          this._getCmsWhere = getCmsWhere;

          // 已经获取到了窗体数据
        } else {
          newState = { visible: true };
        }
        this.setState(newState, () => {
          const { type, containerProps, formProps, data, visible } = this.state;

          const modalProps = {};

          // 打开容器
          this.props.openModalOrDrawer(
            type,
            {
              title: '高级搜索',
              placement: 'right',
              visible,
              onClose: this.handleClose,
              onCancel: this.handleClose,
              width: 500,
              footer: null,
              ...containerProps
            },
            PwForm,
            {
              saveText: '搜索',
              hasEdit: false,
              hasCancel: false,
              onSave: this.handleGetCmsWhere,
              data: data,
              ...formProps
            }
          );
        });
      };

      handleClose = () => {
        this.props.closeModalOrDrawer();
      };

      /**
       * 设置高级搜索接收的 props
       * @param {object} drawerProps 抽屉组件接收的 props
       * @param {object} formProps PwForm 组件接收的 props
       */
      handleSetAdvProps = (drawerProps, formProps) => {
        this.setState({ drawerProps, formProps });
      };

      handleGetCmsWhere = form => {
        form.validateFields((err, values) => {
          if (err) {
            return message.error('表单数据有误');
          }
          const formData = dealFormData(values);
          const cmsWhere = getCmsWhere(formData);
          this._getCmsWhere(cmsWhere);
        });
      };

      render() {
        return (
          <Fragment>
            <WrappedComponent
              openAdvSearch={this.handleOpenAdvSearch}
              {...this.props}
            />
            {/* <Drawer
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
            </Drawer> */}
          </Fragment>
        );
      }
    }

    const enhancedAdvSearch = withHttpGetFormData(
      withModalDrawer()(withAdvSearch)
    );
    return argumentContainer(
      enhancedAdvSearch,
      WrappedComponent,
      'withAdvSearch'
    );
  };
};

export default withAdvSearch;
