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
    saveNeedConfirm
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
                      title={`确定要${saveText}吗`}
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
