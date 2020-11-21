import React from 'react';
import { argumentContainer } from '../util';
import { withHttpGetFormData } from '../withHttp';
import { message, Tabs } from 'antd';
import PwForm from '../../ui/PwForm';
import { dealFormData } from 'Util20/controls';
import { getCmsWhere } from 'Util20/util';
import { getDataProp } from 'Util20/formData2ControlsData';
import withModalDrawer from '../withModalDrawer';
import { FormattedMessage as FM } from 'react-intl';
import { compose } from 'recompose';
import AdvSearch from 'lz-components-and-utils/lib/AdvSearch';
import 'lz-components-and-utils/lib/AdvSearch/style/index.css';
import { cloneDeep } from 'lodash';
const { TabPane } = Tabs;

class Search extends React.Component {
  state = {
    searchList: []
  };

  handleAdvConfirm = (cmswhere, searchList) => {
    this.setState({ searchList });
    const { onConfirm } = this.props;
    onConfirm && onConfirm(cmswhere, true);
  };

  handleAdvSearchChange = (where, searchList) => {
    this.setState({ searchList });
    const { onConfirm } = this.props;
    onConfirm && onConfirm(where, true, false);
  }

  render() {
    const { searchList } = this.state;
    const { searchComponent, onConfirm, ...otherProps } = this.props;

    let tabsArr, component;
    if (Array.isArray(searchComponent)) {
      tabsArr = [...searchComponent].sort((a, b) => a.order - b.order);
      component = 'both';
    } else {
      tabsArr = [
        {
          title: '自定义搜索',
          name: 'PwForm'
        },
        {
          title: '高级搜索',
          name: 'AdvSearch'
        }
      ];
      component = searchComponent;
    }

    if (component === 'both') {
      return (
        <Tabs defaultActiveKey="0">
          {tabsArr.map((tabItem, index) => {
            let C;
            if (tabItem.name === 'PwForm') {
              C = PwForm;
            } else if (tabItem.name === 'AdvSearch') {
              C = AdvSearch;
            }

            if (!C) {
              return null;
            }

            const { fields, onConfirm, ...otherProps } = this.props;
            let props;

            if (tabItem.name === 'AdvSearch') {
              props = {
                fields,
                onConfirm: this.handleAdvConfirm,
                initialSearchList: searchList,
                confirmText: '搜索',
                enConfirmText: 'Search',
                onChange: this.handleAdvSearchChange
              };
            } else if (tabItem.name === 'PwForm') {
              props = otherProps;
            }
            return (
              <TabPane tab={tabItem.title} key={index}>
                <C {...props} />
              </TabPane>
            );
          })}
        </Tabs>
      );
    } else if (component === 'PwForm') {
      return <PwForm {...otherProps} />;
    } else if (component === 'AdvSearch') {
      return (
        <AdvSearch
          {...otherProps}
          onConfirm={this.handleAdvConfirm}
          initialSearchList={searchList}
          onChange={this.handleAdvSearchChange}
        />
      );
    } else {
      return <div>searchComponent 配置有误</div>;
    }
  }
}

// 显示高级搜索的高阶组件
const withAdvSearch = (options = {}) => {
  const { type = 'drawer' } = options;
  return function (WrappedComponent) {
    class withAdvSearch extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          type
        };
      }

      getData = async (
        resid,
        formName,
        getCmsWhere,
        validationFields = [],
        baseURL,
        dblinkname,
        data
      ) => {
        if (!this._data) {
          if (Array.isArray(data)) {
            this._data = cloneDeep(data);
            this._getCmsWhere = getCmsWhere;
          } else {
            // 第一次打开高级搜索，还没有获取窗体数据
            let formData;
            try {
              // 使用 withHttpGetFormData 高阶组件传入的 httpGetFormData 方法获取窗体数据
              formData = await this.props.httpGetFormData(
                resid,
                formName,
                baseURL,
                dblinkname
              );
            } catch (err) {
              return message.error(err.message);
            }
            // 获取 PwFrom 所接收的 data prop
            this._data = getDataProp(formData, {}, true, false, validationFields);
            this._data = cloneDeep(this._data);
            this._getCmsWhere = getCmsWhere;
          }
        }
        // 移除验证规则
        this._data.forEach(item => {
          delete item.rules;
          if (item.props) {
            delete item.props.disabled;
          }
        })
      };

      /**
       * 显示高级搜索
       * @param {string | array} searchComponent 使用高级搜索的组件：'PwForm' 表示使用 PwForm 组件；'AdvSearch' 表示使用 AdvSearch 组件；'both' 包含使用 PwForm 和 AdvSearch 组件
       * @param {string} type 容器类型：'modal' 模态窗 | 'drawer' 抽屉
       * @param {number} resid 资源 id
       * @param {string} formName 窗体名称，如 'default'
       * @param {array} validationFields 高级查询中需要有验证的字段，如：['name', 'age']
       * @param {function} getCmsWhere 获取 cmswhere 的回调函数
       * @param {object} containerProps 容器接收的 props（Modal 或 Drawer）
       * @param {object} formProps PwForm 接收的 props
       * @param {array} fields 高级搜索所需的字段列表
       * @param {string} baseURL 基地址
       * @param {string} dblinkname 数据库链接名称
       * @param {array} recordFormData 记录表单数据
       */
      handleOpenAdvSearch = async (
        searchComponent = 'both',
        type = 'drawer',
        resid,
        formName,
        validationFields,
        getCmsWhere,
        containerProps = {},
        formProps = {},
        fields = [],
        baseURL,
        dblinkname,
        recordFormData,
      ) => {
        let component;
        if (Array.isArray(searchComponent)) {
          component = 'both';
        } else {
          component = searchComponent;
        }
        switch (component) {
          case 'PwForm': {
            await this.getData(
              resid,
              formName,
              getCmsWhere,
              validationFields,
              baseURL,
              dblinkname,
              recordFormData
            );
            break;
          }
          case 'AdvSearch': {
            break;
          }
          case 'both': {
            await this.getData(
              resid,
              formName,
              getCmsWhere,
              validationFields,
              baseURL,
              dblinkname,
              recordFormData
            );
            break;
          }
          default: {
          }
        }
        const newContainerProps = {
          title: <FM id="common.advSearch" defaultMessage="高级搜索" />,
          placement: 'right',
          visible: true,
          onClose: this.handleClose,
          onCancel: this.handleClose,
          width: 500,
          footer: null,
          ...containerProps
        };

        // 打开容器
        this.props.openModalOrDrawer(type, newContainerProps, Search, {
          searchComponent,
          // PwForm
          saveText: '搜索',
          enSaveText: 'Search',
          hasEdit: false,
          hasCancel: false,
          onSave: this.handleGetPwFormCmsWhere,
          data: this._data,
          ...formProps,

          // AdvSearch
          fields,
          onConfirm: this.handleGetAdvSearchWhere
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

      handleGetPwFormCmsWhere = form => {
        form.validateFields((err, values) => {
          if (err) {
            return message.error('表单数据有误');
          }
          const formData = dealFormData(values);
          const cmsWhere = getCmsWhere(formData);
          this._getCmsWhere(cmsWhere);
        });
      };

      handleGetAdvSearchWhere = (where, isAdvSearch, isRefreshTable) => {
        this._getCmsWhere(where, isAdvSearch, isRefreshTable);
      };

      render() {
        const name = WrappedComponent.displayName || WrappedComponent.name;
        const otherProps = {};
        if (name === this.props.refTargetComponentName) {
          otherProps.ref = this.props.wrappedComponentRef;
        }

        return (
          <WrappedComponent
            openAdvSearch={this.handleOpenAdvSearch}
            {...this.props}
            {...otherProps}
          />
        );
      }
    }

    const enhancedAdvSearch = compose(
      withHttpGetFormData,
      withModalDrawer()
    )(withAdvSearch);
    return argumentContainer(
      enhancedAdvSearch,
      WrappedComponent,
      'withAdvSearch'
    );
  };
};

export default withAdvSearch;
