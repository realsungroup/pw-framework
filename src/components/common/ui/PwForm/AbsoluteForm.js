import React from 'react';
import { Form } from 'antd';
import Control from '../Control';
import PwFormFooter from './PwFormFooter/index';
import { getIntlVal } from 'Util20/util';
import { injectIntl } from 'react-intl';
import { propTypes, defaultProps } from './propTypes';
import classNames from 'classnames';

const FormItem = Form.Item;

class AbsoluteForm extends React.PureComponent {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  renderView = (containerHeight, containerWidth, labelControllArr, data) => {
    return (
      <>
        {/* label */}
        {!!labelControllArr &&
          labelControllArr.map(item => {
            const { customStyle } = item;
            return (
              <label
                style={{
                  fontWeight: item.FrmFontBold * 500,
                  position: 'absolute',
                  top: (customStyle.top / containerHeight) * 100 + '%',
                  left: (customStyle.left / containerWidth) * 100 + '%',
                  width: (customStyle.width / containerWidth) * 100 + '%',
                  height: (customStyle.height / containerHeight) * 100 + '%',
                  textAlign: customStyle.textAlign,
                  fontSize: customStyle.fontSize,
                  color: item.FrmForeColor,
                  fontFamily: item.FrmFontName,
                  overflow: 'visible'
                }}
              >
                {`${item.FrmText}`}
              </label>
            );
          })}
        {/* 数据 */}
        {!!data.length &&
          data.map(item => {
            const { customStyle } = item.controlData;
            console.log(item);
            return (
              <span
                style={{
                  position: 'absolute',
                  top: (customStyle.top / containerHeight) * 100 + '%',
                  left: (customStyle.left / containerWidth) * 100 + '%',
                  width: (customStyle.width / containerWidth) * 100 + '%',
                  height: (customStyle.height / containerHeight) * 100 + '%',
                  fontSize: customStyle.fontSize,
                  color: item.controlData.FrmForeColor,
                  overflow: 'auto'
                }}
              >
                {item.initialValue}
              </span>
            );
          })}
      </>
    );
  };

  renderAddOrModify = (
    containerHeight,
    containerWidth,
    labelControllArr,
    data
  ) => {
    return (
      <>
        {/* label */}
        {!!labelControllArr &&
          labelControllArr.map(item => {
            const { customStyle } = item;
            const controlData =
              item.FrmColNameForCtrl &&
              data.find(i => {
                return i.controlData.ColName === item.FrmColNameForCtrl;
              });
            return (
              <label
                class={classNames({
                  required:
                    controlData &&
                    (controlData.controlData.ColIsNoNull ||
                      controlData.controlData.FrmIsNoNull)
                })}
                style={{
                  fontWeight: item.FrmFontBold * 500,
                  position: 'absolute',
                  top: (customStyle.top / containerHeight) * 100 + '%',
                  left: (customStyle.left / containerWidth) * 100 + '%',
                  width: (customStyle.width / containerWidth) * 100 + '%',
                  height: (customStyle.height / containerHeight) * 100 + '%',
                  textAlign: customStyle.textAlign,
                  fontSize: customStyle.fontSize,
                  color: item.FrmForeColor,
                  fontFamily: item.FrmFontName,
                  overflow: 'visible'
                }}
              >
                {`${item.FrmText}`}
              </label>
            );
          })}
        {data.map(item => {
          const { customStyle } = item.controlData;
          return (
            <div
              style={{
                position: 'absolute',
                top:
                  ((customStyle.top / containerHeight) * 100).toFixed(2) + '%',
                left:
                  ((customStyle.left / containerWidth) * 100).toFixed(2) + '%',
                width:
                  ((customStyle.width / containerWidth) * 100).toFixed(2) + '%',
                height:
                  ((customStyle.height / containerHeight) * 100).toFixed(2) +
                  '%'
              }}
            >
              {this.renderFormItem(item)}
            </div>
          );
        })}
      </>
    );
  };
  renderFormItem = dataItem => {
    const { id } = dataItem;
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
      <FormItem key={id}>
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
      data,
      operation,
      hasEdit,
      hasSave,
      hasCancel,
      onEdit,
      onSave,
      onCancel,
      saveText,
      cancelText,
      editText,
      enSaveText,
      enCancelText,
      enEditText,
      saveNeedConfirm,
      intl
    } = this.props;
    let { containerControlArr, labelControllArr } = data;
    const containerHeight =
      containerControlArr &&
      containerControlArr.length &&
      containerControlArr[0].FrmHeight;
    const containerWidth =
      containerControlArr &&
      containerControlArr.length &&
      containerControlArr[0].FrmWidth;
    return (
      <div
        style={{
          height: containerHeight,
          width: containerWidth
        }}
        className="absolute-form"
      >
        {operation === 'view'
          ? this.renderView(
              containerHeight,
              containerWidth,
              labelControllArr,
              data
            )
          : this.renderAddOrModify(
              containerHeight,
              containerWidth,
              labelControllArr,
              data
            )}
        <div
          style={{
            position: 'absolute',
            top: containerHeight - 80,
            height: 60,
            width: '100%'
          }}
        >
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
      </div>
    );
  }
}

export default injectIntl(Form.create()(AbsoluteForm));
