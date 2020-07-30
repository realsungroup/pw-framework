import React from 'react';
import { LzModal, LzMenuForms } from '../loadableCustom';
import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import PwForm from 'Common/ui/PwForm';
import './PatientPeriod.less';
import { Button, message, Modal, Form } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import { withHttpGetFormData } from 'Common/hoc/withHttp';
import { compose } from 'recompose';
import { getDataProp, setDataInitialValue } from 'Util20/formData2ControlsData';

const patientPeriodID = 648300111771; //周期方案
const baseInfoID = 648300066963; //基本信息
const manID = 648300080566; //男方病历
const womanID = 648300096608; //女方病历
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
      data: [], // PwForm 接收的 data props
      data2: [], // PwForm 接收的 data props
      period: {} //选择的周期记录
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
    this.getFormData2();
  };

  getFormData = async () => {
    const { httpGetFormData } = this.props;
    const {
      resid,
      recordFormName = 'default2',
      baseURL,
      dblinkname
    } = this.props.tableDataProps;
    let res;
    try {
      res = await httpGetFormData(resid, recordFormName, baseURL, dblinkname);
    } catch (err) {
      return message.error(err.message);
    }
    const data = getDataProp(res, {});
    this.setState({ data });
  };
  getFormData2 = async () => {
    const { httpGetFormData } = this.props;
    const {
      resid,
      recordFormName = 'default',
      baseURL,
      dblinkname
    } = this.props.tableDataProps;
    let res;
    try {
      res = await httpGetFormData(resid, recordFormName, baseURL, dblinkname);
    } catch (err) {
      return message.error(err.message);
    }
    const data = getDataProp(res, {});
    this.setState({ data2: data });
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  handleInputCaseClick = record => {
    console.log({record})
    this.setState({
      modalVisible: true,
      record: record,
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
          key="添加周期"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleAddPeriod(record)}
        >
          添加周期
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="输入病历"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          输入病历
        </Button>
      );
    }
  ];
  handleAddPeriod = period => {
    this.setState({
      addPeriodVisible: true,
      period
    });
  };

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
  //保存周期
  handleSavePeriod = form => {
    const { period } = this.state;
    let res,
      data = [];
    console.log({ period });
    form.validateFields(async (err, values) => {
      if (err) {
        return message.error('表单数据有误');
      }
      data = [
        {
          resid: patientPeriodID,
          maindata: {
            ...values,
            CurrentPatientID: period.CurrentPatientID,
            Name_W: period.Name_W,
            Age_W: period.Age_W,
            Name_M: period.Name_M,
            Age_M: period.Age_M,
            _id: 1,
            _state: 'added'
          },
          subdata: [
            {
              resid: manID,
              maindata: {
                _id: 1,
                _state: 'added'
              }
            },
            {
              resid: womanID,
              maindata: {
                _id: 1,
                _state: 'added'
              }
            }
          ]
        }
      ];
      try {
        res = await http().saveRecordAndSubTables({
          data
        });
        message.success('添加成功！');
        this.setState({
          addPeriodVisible: false
        });
        console.log('this.tableDataRef', this.tableDataRef);
        this.tableDataRef.handleRefresh();
      } catch (error) {
        message.error(error.message);
      }
    });
  };

  //保存周期和患者
  handleSave = form => {
    let res,
      data = [];

    form.validateFields(async (err, values) => {
      if (err) {
        return message.error('表单数据有误');
      }
      data = [
        {
          resid: patientPeriodID,
          maindata: {
            ...values,
            _id: 1,
            _state: 'added'
          },
          subdata: [
            {
              resid: baseInfoID,
              maindata: {
                CurrentPatientID: values.CurrentPatientID,
                Name_W: values.Name_W,
                Age_W: values.Age_W,
                Name_M: values.Name_M,
                Age_M: values.Age_M,
                _id: 1,
                _state: 'added'
              }
            },
            {
              resid: manID,
              maindata: {
                _id: 1,
                _state: 'added'
              }
            },
            {
              resid: womanID,
              maindata: {
                _id: 1,
                _state: 'added'
              }
            }
          ]
        }
      ];
      try {
        res = await http().saveRecordAndSubTables({
          data
        });
        message.success('添加成功！');
        this.setState({
          addPatientVisible: false
        });
        this.tableDataRef.handleRefresh();
      } catch (error) {
        message.error(error.message);
      }
    });
  };

  render() {
    const { tableDataProps } = this.props;
    const {
      modalVisible,
      record,
      navListResidField,
      ucLen,
      cdLen,
      addPatientVisible,
      addPeriodVisible
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

    const { data, data2 } = this.state;
    return (
      <div className="patient-info">
        <TableData
          {...tableDataProps}
          customRowBtns={this.customRowBtns}
          actionBarExtra={this.renderActionBarExtra}
          refTargetComponentName="TableData"
          wrappedComponentRef={element => (this.tableDataRef = element)}
        />
        <Modal
          visible={addPatientVisible}
          destroyOnClose={true}
          onCancel={() => {
            this.setState({
              addPatientVisible: false
            });
          }}
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

        <Modal
          visible={addPeriodVisible}
          destroyOnClose={true}
          onCancel={() => {
            this.setState({
              addPeriodVisible: false
            });
          }}
          title="添加周期"
          footer={null}
        >
          <PwForm
            data={data2}
            mode="edit"
            onSave={this.handleSavePeriod}
            onCancel={() => this.setState({ addPeriodVisible: false })}
            operation={operation}
            record={record}
            beforeSaveFields={beforeSaveFields}
            resid={resid}
            // className={classNames({
            //   'form-data__pwform--left': hasSubTables
            // })}
          />
        </Modal>
        {modalVisible && (
          <LzModal defaultScaleStatus="max" onClose={this.handleModalClose}>
            <LzMenuForms
              mode="multiple"
              addModalFormProps={{
                displayMod: 'classify',
                modalWidth: 1000
              }}
              hasFieldsLabel
              navListResid={patientPeriodID}
              resid={patientPeriodID}
              userInfoFields={[
                { label: '病历号', innerFieldName: 'CurrentPatientID' },
                { label: '女方姓名', innerFieldName: 'Name_W' },
                { label: '男方姓名', innerFieldName: 'Name_M' },
                { label: '第几周期', innerFieldName: 'OPSTimes' }
              ]}
              record={record}
              advSearchConfig={{
                containerName: 'drawer'
              }}
              displayMod="classify"
            />
          </LzModal>
        )}
      </div>
    );
  }
}

const composedHoc = compose(withHttpGetFormData);

export default composedHoc(PatientPeriod);
