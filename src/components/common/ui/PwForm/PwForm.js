import React from 'react';
import { Form, Collapse } from 'antd';
import LzRowCols from '../LzRowCols';
import PwFormFooter from './PwFormFooter/index';
import Control from '../Control';
import { propTypes, defaultProps } from './propTypes';
import { injectIntl } from 'react-intl';
import './PwForm.less';
import { getIntlVal, getGBEMClassName } from 'Util20/util';
import classNames from 'classnames';

const Fragment = React.Fragment;
const Panel = Collapse.Panel;
const FormItem = Form.Item;

const prefix = 'pw-form';
const c = getGBEMClassName(prefix);

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

const classPrefix = 'pw-form';

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

  componentDidMount = () => {
    const { getForm, form } = this.props;
    getForm && getForm(form);
  };

  handleCollapseChange = activeKey => {
    this.setState({ activeKey });
  };

  renderFormItems = (data, colCount) => {
    const { layout } = this.props;

    if (layout === 'grid') {
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
    }

    // float
    return data.map(dateItem => this.renderFloatFormItem(dateItem));
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
    const { id, label, labelCol, wrapperCol, controlData } = dataItem;
    const { customStyle = {} } = controlData;
    const {
      form,
      mode,
      resid,
      operation,
      record,
      beforeSaveFields,
      dblinkname,
      baseURL,
      uploadConfig,
      mediaFieldBaseURL,
      recordFormHideFields
    } = this.props;
    const { getFieldDecorator } = form;
    const options = {
      initialValue: dataItem.initialValue
    };

    if (mode === 'edit') {
      options.rules = dataItem.rules;
    }

    const hasBeforeSave =
      !!beforeSaveFields && beforeSaveFields.indexOf(dataItem.id) !== -1;

    return (
      <FormItem
        key={id}
        label={label}
        labelCol={{ span: labelCol || 8 }}
        wrapperCol={{ span: wrapperCol || 16 }}
        className={classNames({
          [`${c('form-item--hide')}`]: Array.isArray(recordFormHideFields) && recordFormHideFields.includes(id)
        })}
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
            baseURL={baseURL}
            customStyle={customStyle}
            uploadConfig={uploadConfig}
            mediaFieldBaseURL={mediaFieldBaseURL}
          />
        )}
      </FormItem>
    );
  };

  getStyle = (dataItem, label) => {
    const { data } = this.props;
    const { labelControllArr } = data;

    if (!labelControllArr) {
      return {};
    }

    const labelItem = labelControllArr.find(item => item.FrmText === label);

    if (!labelItem) {
      return {};
    }

    const labelItemStyle = labelItem.customStyle;
    const controlItemStyle = dataItem.controlData.customStyle;

    return {
      wrapperStyle: {
        width: labelItemStyle.width + controlItemStyle.width,
        height: Math.max(labelItemStyle.height, controlItemStyle.height)
      },
      labelStyle: {
        width: labelItemStyle.width,
        height: labelItemStyle.height
      },
      controlStyle: {
        width: controlItemStyle.width,
        height: controlItemStyle.height
      }
    };
  };

  renderFloatFormItem = dataItem => {
    const { id, label } = dataItem;
    const {
      form,
      mode,
      resid,
      operation,
      record,
      beforeSaveFields,
      dblinkname,
      labelControllArr,
      baseURL,
      uploadConfig,
      mediaFieldBaseURL
    } = this.props;
    const { getFieldDecorator } = form;
    const options = {
      initialValue: dataItem.initialValue
    };

    if (mode === 'edit') {
      options.rules = dataItem.rules;
    }

    const hasBeforeSave =
      !!beforeSaveFields && beforeSaveFields.indexOf(dataItem.id) !== -1;

    const {
      wrapperStyle = {},
      labelStyle = {},
      controlStyle = {}
    } = this.getStyle(dataItem, label);

    return (
      <div
        className={classNames(
          `${classPrefix}__form-item--float`,
          `${classPrefix}__form-item--remove-antd-style`
        )}
        key={id}
        style={wrapperStyle}
      >
        <FormItem key={id}>
          <div className={`${classPrefix}__form-item-label`} style={labelStyle}>
            {label}:
          </div>
          <div style={controlStyle}>
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
                baseURL={baseURL}
                uploadConfig={uploadConfig}
                mediaFieldBaseURL={mediaFieldBaseURL}
              />
            )}
          </div>
        </FormItem>
      </div>
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
      saveNeedConfirm,
      data,
      layout,
      saveReopen,
      onReopenSave,
      saveOpenText,
      enSaveOpenText,
      saveConfirmTip,
      confirmLoading,
      extraButtons
    } = this.props;
    const { intl } = this.props;

    let _width = width,
      _height = height;
    if (layout === 'float') {
      let { containerControlArr } = data;
      const containerWidth =
        containerControlArr &&
        containerControlArr.length &&
        containerControlArr[0].FrmWidth;
      const containerHeight =
        containerControlArr &&
        containerControlArr.length &&
        containerControlArr[0].FrmHeight;

      _width = containerWidth;
      _height = containerHeight;
    }

    const formBodyStyle = {};
    if (height) {
      formBodyStyle.height = height - 40;
    }

    return (
      <div
        className={`pw-form ${className}`}
        style={{ width: _width, height: _height }}
      >
        {/* body */}
        <Form className="pw-form__body" style={formBodyStyle}>
          {this.renderForm()}
        </Form>
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
          saveOpenText={getIntlVal(intl.locale, enSaveOpenText, saveOpenText)}
          cancelText={getIntlVal(intl.locale, enCancelText, cancelText)}
          editText={getIntlVal(intl.locale, enEditText, editText)}
          saveNeedConfirm={saveNeedConfirm}
          saveReopen={saveReopen}
          onReopenSave={onReopenSave}
          saveConfirmTip={saveConfirmTip}
          confirmLoading={confirmLoading}
          extraButtons={extraButtons}
        />
      </div>
    );
  }
}

export default injectIntl(Form.create()(PwForm));
