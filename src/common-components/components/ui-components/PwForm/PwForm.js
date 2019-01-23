import React from 'react';
import './PwForm.less';
import { Form, Collapse } from 'antd';
import LzRowCols from '../LzRowCols';
import isEqual from 'lodash.isequal';
import PwFormFooter from './PwFormFooter/index';
import Control from '../../ui-components/Control';
import { propTypes, defaultProps } from './propTypes';
const Fragment = React.Fragment;
const Panel = Collapse.Panel;
const FormItem = Form.Item;

/**
 * PwForm
 */
class PwForm extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data, this.props.data)) {
    }
  }

  handleCollapseChange = activeKey => {
    this.setState({ activeKey });
  };

  renderFormItems = (data, colCount) => {
    return (
      <Fragment>
        {colCount === 1 ? (
          data.map(dateItem => this.renderFormItem(dateItem))
        ) : (
          <LzRowCols renderData={data} keyName="id" colCount={colCount}>
            {dateItem => this.renderFormItem(dateItem)}
          </LzRowCols>
        )}
      </Fragment>
    );
  };

  renderForm = () => {
    const { data, colCount, displayMode } = this.props;
    // 默认显示模式
    if (displayMode === 'default') {
      return this.renderFormItems(data, colCount);

      // 分类显示模式
    } else if (displayMode === 'classify') {
      const { activeKey } = this.state;
      return (
        <Collapse activeKey={activeKey} onChange={this.handleCollapseChange}>
          {data.map(typeItem => (
            <Panel key={typeItem.type} header={typeItem.type}>
              {this.renderFormItems(typeItem.data, colCount)}
            </Panel>
          ))}
        </Collapse>
      );
    }
  };

  renderFormItem = dataItem => {
    const { id, label, labelCol, wrapperCol } = dataItem;
    const {
      form,
      mode,
      resid,
      operation,
      record,
      beforeSaveFields
    } = this.props;
    const { getFieldDecorator } = form;
    const options = {
      initialValue: dataItem.initialValue,
      rules: dataItem.rules
    };

    const hasBeforeSave =
      !!beforeSaveFields && beforeSaveFields.indexOf(dataItem.id) !== -1;

    return (
      <FormItem
        key={id}
        label={label}
        labelCol={{ span: labelCol || 8 }}
        wrapperCol={{ span: wrapperCol || 16 }}
      >
        {getFieldDecorator(dataItem.id, options)(
          <Control
            dataItem={dataItem}
            form={form}
            displayMode={mode}
            resid={resid}
            record={record}
            operation={operation}
            hasBeforeSave={hasBeforeSave}
            beforeSaveFields={hasBeforeSave}
          />
        )}
      </FormItem>
    );
  };

  render() {
    const {
      mode,
      hasEdit,
      hasSave,
      hasCancel,
      onEdit,
      onSave,
      onCancel,
      width,
      height,
      saveText,
      cancelText,
      editText,
      className
    } = this.props;

    return (
      <div className={`pw-form ${className}`} style={{ width, height }}>
        {/* body */}
        <Form className="pw-form__body">{this.renderForm()}</Form>
        {/* footer */}
        <PwFormFooter
          hasEdit={hasEdit}
          hasSave={hasSave}
          hasCancel={hasCancel}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          mode={mode}
          form={this.props.form}
          saveText={saveText}
          cancelText={cancelText}
          editText={editText}
        />
      </div>
    );
  }
}

export default Form.create()(PwForm);
