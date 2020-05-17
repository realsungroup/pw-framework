import React from 'react';
import { argumentContainer } from '../util';
import FormData from '../../data/FormData';
import withModalDrawer from '../withModalDrawer';

// 显示记录表单的高阶组件
export function withRecordForm(options = {}) {
  const { type = 'modal' } = options;

  return function(WrappedComponent) {
    class withRecordForm extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          type,
          visible: false
        };
      }

      /**
       * 打开记录表单
       * @param {object} params 参数
       *
       * @param {string} params.type 记录表单所在的容器类型：'modal' 模态窗 | 'drawer' 抽屉；默认值为：'modal'
       * @param {string} params.title 容器的 title；默认值为：''
       * @param {object} params.formProps PwForm 表单组件接收的 props
       * @param {object} params.data 表单接收的 data prop（所有控件数据）
       * @param {string} params.operation 对表单的操作：'add' 添加 | 'modify' 修改 | 'view' 查看；默认值为：'add'
       * @param {object} params.record 记录；默认值为：{}
       * @param {object} params.info 添加、修改 所需要的信息
       * @param {array} params.beforeSaveFields 能够通过计算公式获取保存之前的记录的内容字段数组
       * @param {object} params.AdvDicTableProps 高级字典表格所接收的 props
       * @param {object} params.recordFormContainerProps 记录表单容器（Modal/Drawer）所接收的 props
       * @param {array} params.subTableArr 表单中子表
       * @param {object} params.subTableArrProps 表单中子表接收的 props
       * @param {number | string} params.recordFormFormWidth 表单中左侧表单的宽度
       * @param {number | string} params.recordFormTabsWidth 表单中右侧子表的宽度
       * @param {string} params.storeWay 添加、修改的数据所使用的存储方式
       * @param {function} params.onSuccess 保存成功后的回调函数：(operation, formData, record, form) => {}；operation 表示什么操作；formData 表示保存的表单数据；record 表示记录；form 自动收集数据的 form 对象
       * @param {function} params.onCancel 取消后的回调函数
       * @param {string} params.dblinkname 数据库链接名称
       * @param {string} params.baseURL 基地址
       * @param {string} params.formDataProps FormData 组件接受的 props
       */
      handleOpenRecordForm = ({
        type = 'modal',
        title = '',
        formProps = {},
        data = [],
        operation = 'add',
        record = {},
        info = {
          dataMode: 'main',
          resid: 666,
          subresid: 777,
          hostrecid: 'C3_888'
        },
        beforeSaveFields = [],
        AdvDicTableProps = {},
        recordFormContainerProps = {},
        subTableArr = [],
        subTableArrProps = [],
        recordFormFormWidth,
        recordFormTabsWidth,
        storeWay = 'be',
        onSuccess = () => {},
        onCancel = () => {},
        dblinkname,
        useAbsolute = false,
        baseURL = '',
        formDataProps = {}
      }) => {
        const FormDataProps = {
          data,
          operation,
          record,
          formProps,
          info,
          onSuccess,
          onCancel,
          AdvDicTableProps,
          beforeSaveFields,
          width: {
            formWidth: recordFormFormWidth,
            tabsWidth: recordFormTabsWidth
          },
          subTableArr,
          subTableArrProps,
          storeWay,
          dblinkname,
          useAbsolute,
          baseURL,
          ...formDataProps
        };
        const containerProps = {
          title,
          visible: true,
          destroyOnClose: true,
          width: formProps && formProps.width ? formProps.width + 50 : 800
        };

        if (type === 'modal') {
          containerProps.footer = null;
          containerProps.onCancel = onCancel;
        } else {
          containerProps.placement = 'right';
          containerProps.onClose = onCancel;
        }

        this.props.openModalOrDrawer(
          type,
          { ...containerProps, ...recordFormContainerProps },
          FormData,
          FormDataProps
        );
      };

      /**
       * 关闭记录表单
       */
      handleCloseRecordForm = () => {
        this.props.closeModalOrDrawer();
      };

      render() {
        const name = WrappedComponent.displayName || WrappedComponent.name;
        const otherProps = {};
        if (name === this.props.refTargetComponentName) {
          otherProps.ref = this.props.wrappedComponentRef;
        }
        return (
          <WrappedComponent
            {...this.props}
            {...otherProps}
            openRecordForm={this.handleOpenRecordForm}
            closeRecordForm={this.handleCloseRecordForm}
          />
        );
      }
    }

    const enhancedWithRecordForm = withModalDrawer()(withRecordForm);

    return argumentContainer(
      enhancedWithRecordForm,
      WrappedComponent,
      'withRecordForm'
    );
  };
}
