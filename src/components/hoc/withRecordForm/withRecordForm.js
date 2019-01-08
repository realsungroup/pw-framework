import React from 'react';
import { argumentContainer } from '../util';
import { withHttpGetFormData } from '../withHttp';
import { message, Drawer, Modal } from 'antd';
import PwForm from '../../ui-components/PwForm';
import withFormDataProp from '../withFormDataProp';
import { dealFormData } from '../../../util/controls';
import { getCmsWhere } from '../../../util/util';
import FormData from '../../data-components/FormData';

const Fragment = React.Fragment;

// 显示记录表单的高阶组件
const withRecordForm = (options = {}) => {
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
       * @param {object} params Modal/FormData/Drawer 组件所接收的对象
       *
       * @param {string} params.type 记录表单所在的容器类型：'modal' 模态窗 | 'drawer' 抽屉；默认值为：'modal'
       * @param {string} params.title 容器的 title；默认值为：''
       * @param {object} params.formProps PwForm 表单组件接收的 props
       * @param {object} params.formData 窗体数据
       * @param {string} params.operation 对表单的操作：'add' 添加 | 'modify' 修改 | 'view' 查看；默认值为：'add'
       * @param {object} params.record 记录；默认值为：{}
       * @param {object} params.info 添加、修改 所需要的信息
       * @param {object} params.AdvDicTableProps 高级字典表格所接收的 props
       * @param {object} params.recordFormContainerProps 记录表单容器（Modal/Drawer）所接收的 props
       * @param {function} params.onConfirm 确认后的回调函数
       * @param {function} params.onCancel 取消后的回调函数
       */
      handleOpenRecordForm = ({
        type = 'modal',
        title = '',
        formProps = {},
        formData = {
          subTableArr: [],
          allControlArr: [],
          canOpControlArr: [],
          containerControlArr: []
        },
        operation = 'add',
        record = {},
        info = {
          dataMode: 'main',
          resid: 666,
          subresid: 777,
          hostrecid: 'C3_888'
        },
        AdvDicTableProps = {},
        recordFormContainerProps = {},
        onConfirm = () => {},
        onCancel = () => {}
      }) => {
        this.setState({
          type,
          title,
          visible: true,
          formProps,
          formData,
          operation,
          record,
          info,
          recordFormContainerProps,
          AdvDicTableProps,
          onConfirm,
          onCancel
        });
      };

      handleCloseRecordForm = () => {
        this.setState({ visible: false });
      };

      handleCancel = () => {
        this.setState({ visible: false });
      };

      renderRecordForm = () => {
        const {
          visible,
          type,
          title,
          formProps,
          formData,
          operation,
          record,
          info,
          recordFormContainerProps,
          AdvDicTableProps,
          onConfirm,
          onCancel
        } = this.state;
        if (type === 'modal') {
          return (
            <Modal
              title={title}
              visible={visible}
              footer={null}
              onCancel={onCancel}
              destroyOnClose
              width={formProps && formProps.width ? formProps.width + 50 : 800}
              {...recordFormContainerProps}
            >
              <FormData
                formData={formData}
                operation={operation}
                record={record}
                formProps={formProps}
                info={info}
                onConfirm={onConfirm}
                onCancel={onCancel}
                AdvDicTableProps={AdvDicTableProps}
              />
            </Modal>
          );
        } else {
          return (
            <Drawer
              title={title}
              placement="right"
              onClose={onCancel}
              visible={visible}
              destroyOnClose
              width={formProps && formProps.width ? formProps.width + 50 : 800}
              {...recordFormContainerProps}
            >
              <FormData
                formData={formData}
                operation={operation}
                record={record}
                formProps={formProps}
                info={info}
                onConfirm={onConfirm}
                onCancel={onCancel}
                AdvDicTableProps={AdvDicTableProps}
              />
            </Drawer>
          );
        }
      };

      render() {
        return (
          <Fragment>
            <WrappedComponent
              {...this.props}
              openRecordForm={this.handleOpenRecordForm}
              closeRecordForm={this.handleCloseRecordForm}
            />
            {this.renderRecordForm()}
          </Fragment>
        );
      }
    }

    return argumentContainer(
      withRecordForm,
      WrappedComponent,
      'withRecordForm'
    );
  };
};

export default withRecordForm;
