import React from 'react';
import { Button, Popconfirm } from 'antd';
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
    cancelText,
    editText,
    saveNeedConfirm,
    saveReopen,
    onReopenSave
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
                      title={`确定要提交吗`}
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
                    >
                      {saveText}
                    </Button>
                  ))}
                {saveReopen && (
                  <Button
                    type="primary"
                    onClick={() => onReopenSave && onReopenSave(form)}
                  >
                    保存并打开
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

export default PwFormFooter;
