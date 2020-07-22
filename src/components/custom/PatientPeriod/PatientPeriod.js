import React from 'react';
import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import PwForm from 'Common/ui/PwForm';
import './PatientPeriod.less';
import { Button, message, Modal, Form } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import { withHttpGetFormData } from 'Common/hoc/withHttp';
import { compose } from 'recompose';
import { getDataProp, setDataInitialValue } from 'Util20/formData2ControlsData';

const customBtnStyle = {
  margin: '0 4px'
};

/**
 * 患者信息
 */
class PatientPeriod extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      record: {},
      navListResidField: '',
      cdLen: {},
      ucLen: {},
      addPatientVisible: false,
      data: [] // PwForm 接收的 data props
    };
  }

  componentDidMount = async () => {
    const { resid } = this.props.tableDataProps;
    this.p1 = makeCancelable(
      http().getTable({
        resid,
        // cmswhere: `C3_617809531670 = 'UC'`,
        pageindex: 0,
        pagesize: 10
      })
    );
    this.p2 = makeCancelable(
      http().getTable({
        resid,
        // cmswhere: `C3_617809531670 = 'CD'`,
        pageindex: 0,
        pagesize: 10
      })
    );
    const pArr = [this.p1.promise, this.p2.promise];

    let res;
    try {
      res = await Promise.all(pArr);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const ucLen = res[0].total;
    const cdLen = res[1].total;
    this.setState({ ucLen, cdLen });
    this.getFormData();
  };

  getFormData = async () => {
    const { httpGetFormData,  } = this.props;
    const { resid, recordFormName = 'default', baseURL, dblinkname } = this.props.tableDataProps;
    let res;
    try {
      res = await httpGetFormData(resid, recordFormName, baseURL, dblinkname);
    } catch (err) {
      return message.error(err.message);
    }
    const data = getDataProp(res, {});
    this.setState({ data })
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  handleInputCaseClick = record => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: 'C3_620929565473'
    });
  };

  handleQSClick = record => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: 'C3_620929861096'
    });
  };

  handleHistoryClick = record => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: 'C3_620929845890'
    });
  };

  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key="输入病例"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          输入病例
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="问卷调差"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleQSClick(record)}
        >
          问卷调查
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="历史记录"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleHistoryClick(record)}
        >
          历史记录
        </Button>
      );
    }
  ];

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  renderActionBarExtra = () => {
    const { cdLen, ucLen } = this.state;
    return (
      <div>
        <Button
          onClick={() => {
            if (this.state.data && !this.state.data.length) {
              return message.info('正在请求数据，请稍等');
            }
            this.setState({
              addPatientVisible: true
            });
          }}
        >
          添加患者
        </Button>
      </div>
    );
  };

  handleSave = form => {
    console.log('handleSave');
    form.validateFields(async (err, values) => {
      if (err) {
        return message.error('表单数据有误');
      }
    });
  };

  render() {
    const { tableDataProps } = this.props;
    const {
      modalVisible,
      // record,
      navListResidField,
      ucLen,
      cdLen,
      addPatientVisible
    } = this.state;

    // const {
    //   formProps,
    //   operation,
    //   data,
    //   record,
    //   beforeSaveFields,
    //   info,
    //   subTableArr
    // } = this.props;

    let type = 'modal',
      title = '',
      formProps = {},
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
      onConfirm = () => {},
      onCancel = () => {};

    const mode = operation === 'view' ? 'view' : 'edit';
    let otherProps = {};
    // 当为查看时，不显示 编辑、保存和取消按钮
    if (mode === 'view') {
      otherProps.hasEdit = false;
      otherProps.hasSave = false;
      otherProps.hasCancel = false;
    }
    const { resid } = info;

    const hasSubTables =
      Array.isArray(subTableArr) && !!subTableArr.length && operation !== 'add';

    const { data } = this.state;
    return (
      <div className="patient-info">
        {typeof ucLen === 'number' && typeof cdLen === 'number' && (
          <TableData
            {...tableDataProps}
            customRowBtns={this.customRowBtns}
            actionBarExtra={this.renderActionBarExtra}
          />
        )}
        <Modal
          visible={addPatientVisible}
          destroyOnClose={true}
          title="添加患者"
          footer={null}
        >
          <PwForm
            data={data}
            mode="edit"
            onSave={this.handleSave}
            onCancel={() => this.setState({ addPatientVisible: false })}
            operation={operation}
            record={record}
            beforeSaveFields={beforeSaveFields}
            resid={resid}
            // className={classNames({
            //   'form-data__pwform--left': hasSubTables
            // })}
          />
        </Modal>
        {/* {modalVisible && (
          <LzModal defaultScaleStatus="max" onClose={this.handleModalClose}>
            <LzMenuForms
              mode="multiple"
              addModalFormProps={{
                displayMod: "classify",
                modalWidth: 1000,
              }}
              hasFieldsLabel
              navListResid={record[navListResidField]}
              resid={624640053934}
              userInfoFields={[
                { label: "姓名", innerFieldName: "C3_617809531835" },
                { label: "住院号", innerFieldName: "C3_617809584020" },
                { label: "性别", innerFieldName: "C3_617809531996" },
                { label: "出生年月", innerFieldName: "C3_617809532320" },
              ]}
              record={record}
              advSearchConfig={{
                containerName: "drawer",
              }}
              displayMod="classify"
            />
          </LzModal>
        )} */}
      </div>
    );
  }
}

const composedHoc = compose(withHttpGetFormData);

export default composedHoc(PatientPeriod);
