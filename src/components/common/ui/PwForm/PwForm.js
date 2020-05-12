import React from 'react';
import { Form, Collapse } from 'antd';
import LzRowCols from '../LzRowCols';
import PwFormFooter from './PwFormFooter/index';
import Control from '../Control';
import { propTypes, defaultProps } from './propTypes';
import { injectIntl } from 'react-intl';
import './PwForm.less';
import { getIntlVal } from 'Util20/util';

const Fragment = React.Fragment;
const Panel = Collapse.Panel;
const FormItem = Form.Item;

const getActiveKey = data => {
  const activeKey = [];
  data.forEach(item => activeKey.push(item.type));
  return activeKey;
};

const getOrderedData = (data, fieldsOrder) => {
  if (!fieldsOrder) {
    return data;
  }
  const newData = [...data];
  let ret = [];
  fieldsOrder.forEach(filedName => {
    const index = newData.findIndex(item => item.id === filedName);
    if (index !== -1) {
      ret.push({ ...newData[index] });
      newData.splice(index, 1);
    }
  });

  if (newData.length) {
    ret = ret.concat(newData);
  }

  return ret;
};

/**
 * PwForm
 */
class PwForm extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  static getDerivedStateFromProps(props, state) {
    if ('data' in props) {
      const state = {
        data: getOrderedData(props.data, props.fieldsOrder)
      };
      if (props.displayMode === 'classify') {
        state.activeKey = getActiveKey(props.data);
      }
      return state;
    }
    return null;
  }

  state = {
    data: []
  };

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
    const { colCount, displayMode } = this.props;
    const { data } = this.state;
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
      beforeSaveFields,
      dblinkname
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
            mode={mode}
            resid={resid}
            record={record}
            operation={operation}
            hasBeforeSave={hasBeforeSave}
            beforeSaveFields={hasBeforeSave}
            dblinkname={dblinkname}
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
      className,
      enSaveText,
      enCancelText,
      enEditText,
      saveNeedConfirm
    } = this.props;
    const { intl } = this.props;
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
          saveText={getIntlVal(intl.locale, enSaveText, saveText)}
          cancelText={getIntlVal(intl.locale, enCancelText, cancelText)}
          editText={getIntlVal(intl.locale, enEditText, editText)}
          saveNeedConfirm={saveNeedConfirm}
        />
      </div>
    );
  }
}

export default injectIntl(Form.create()(PwForm));
