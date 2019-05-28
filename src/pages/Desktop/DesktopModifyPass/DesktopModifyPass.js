import React from 'react';
import http, { makeCancelable } from 'Util20/api';
import './DesktopModifyPass.less';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { Modal, Form, Input, Icon, Button, message } from 'antd';
import PropTypes from 'prop-types';
import { logout, changePassword } from 'Util/auth';

const FormItem = Form.Item;

class DesktopModifyPass extends React.PureComponent {
  static propTypes = {
    /**
     * 是否显示
     * 默认：-
     */
    visible: PropTypes.bool.isRequired,

    /**
     * 关闭时的回调
     * 默认：-
     */
    onClose: PropTypes.func,

    /**
     * 修改密码成功的回调
     * 默认：-
     */
    onSuccess: PropTypes.func
  };

  static defaultProps = {};

  state = {
    confirmDirty: false
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      if (values.newPass1 !== values.newPass2) {
        return message.error('两次密码输入不一致');
      }
      try {
        await http().changePassword({
          oldPass: values.oldPass,
          newPass1: values.newPass1
        });
      } catch (err) {
        console.error(err.message);
        return message.error(err.message);
      }
      message.success('修改密码成功');
      const { onSuccess } = this.props;
      onSuccess && onSuccess();
    });
  };

  render() {
    const { visible, intl, onClose } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={visible}
        width={400}
        title={<FM id="RightBtns.ChangePassword" defaultMessage="修改密码" />}
        footer={null}
        destroyOnClose
        onCancel={onClose}
        className="desktop-modify-pass"
      >
        <Form
          className="desktop-modify-pass__form"
          onSubmit={this.handleSubmit}
        >
          <FormItem className="desktop-modify-pass__form-item">
            {getFieldDecorator('oldPass', {
              rules: [
                {
                  required: true,
                  message: (
                    <FM
                      id="RightBtns.OriginalPasswordTip"
                      defaultMessage="请输入原密码"
                    />
                  )
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder={intl.messages['RightBtns.OriginalPassword']}
              />
            )}
          </FormItem>
          <FormItem className="desktop-modify-pass__form">
            {getFieldDecorator('newPass1', {
              rules: [
                {
                  required: true,
                  message: (
                    <FM
                      id="RightBtns.NewPasswordTip"
                      defaultMessage="请输入新密码"
                    />
                  )
                },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder={intl.messages['RightBtns.NewPassword']}
              />
            )}
          </FormItem>
          <FormItem className="desktop-modify-pass__form">
            {getFieldDecorator('newPass2', {
              rules: [
                {
                  required: true,
                  message: (
                    <FM
                      id="RightBtns.NewPasswordAgainTip"
                      defaultMessage="请再次输入新密码"
                    />
                  )
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                onChange={this.newpassChange2}
                placeholder={intl.messages['RightBtns.NewPassword']}
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>

          <FormItem>
            <Button type="primary" block onClick={this.handleSubmit}>
              <FM id="RightBtns.Submit" defaultMessage="提交" />
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default injectIntl(Form.create()(DesktopModifyPass));
