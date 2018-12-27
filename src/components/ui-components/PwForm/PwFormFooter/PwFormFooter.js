import React from 'react';
import { Button } from 'antd';
import './PwFormFooter.less';
const Fragment = React.Fragment;

const PwFormFooter = React.memo(
  ({ hasEdit, hasSave, hasCancel, onEdit, onSave, onCancel, mode, form }) => {
    return (
      <div className="pw-form__footer">
        {(function() {
          if (mode === 'edit') {
            return (
              <Fragment>
                {hasCancel && (
                  <Button onClick={() => onCancel && onCancel(form)}>
                    取消
                  </Button>
                )}

                {hasSave && (
                  <Button
                    type="primary"
                    onClick={() => {
                      onSave && onSave(form);
                    }}
                  >
                    保存
                  </Button>
                )}
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                {hasEdit && (
                  <Button type="primary" onClick={() => onEdit && onEdit()}>
                    编辑
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
