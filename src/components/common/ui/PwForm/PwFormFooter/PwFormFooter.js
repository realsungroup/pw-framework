import React from 'react';
import { Button, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import './PwFormFooter.less';

const Fragment = React.Fragment;

const PwFormFooter = React.memo(
  ({
    hasEdit,
    hasSave,
    hasCancel,
    onEdit,
    onSave,
    onCancel,
    mode,
    form,
    saveText,
    saveOpenText,
    cancelText,
    editText,
    saveNeedConfirm,
    saveReopen,
    onReopenSave,
    saveConfirmTip,
    confirmLoading,
  }) => {
    return (
      <div className="pw-form__footer">
        {(function() {
          if (mode === 'edit') {
            return (
              <Fragment>
                {hasSave &&
                  (saveNeedConfirm ? (
                    <Popconfirm
                      title={saveConfirmTip}
                      onConfirm={() => {
                        onSave && onSave(form);
                      }}
                    >
                      <Button type="primary">{saveText}</Button>
                    </Popconfirm>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        onSave && onSave(form);
                      }}
                      loading={confirmLoading}
                    >
                      {saveText}
                    </Button>
                  ))}
                {saveReopen && (
                  <Button
                    type="primary"
                    onClick={() => onReopenSave && onReopenSave(form)}
                  >
                    {saveOpenText}
                  </Button>
                )}
                {hasCancel && (
                  <Button onClick={() => onCancel && onCancel(form)}>
                    {cancelText}
                  </Button>
                )}
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                {hasEdit && (
                  <Button type="primary" onClick={() => onEdit && onEdit()}>
                    {editText}
                  </Button>
                )}
              </Fragment>
            );
          }
        })()}
      </div>
    );
  }
);

PwFormFooter.propTypes = {
  /**
   * 保存确认时的提示文案
   * 默认：'您确定要提交吗？'
   */
  saveConfirmTip: PropTypes.string,

  /**
   * 确认按钮是否处于 loading 状态（不可点击）
   * 默认：false
   */
  confirmLoading: PropTypes.bool,
};

PwFormFooter.defaultProps = {
  saveConfirmTip: '您确定要提交吗？',
  confirmLoading: false,
};

export default PwFormFooter;
