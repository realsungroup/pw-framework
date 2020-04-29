import React from 'react';
import { withRouter } from 'react-router-dom';
import { logout, changePassword } from '../../../../util/auth';
import { clearCache } from '../../../../util/api';
import { removeItem } from '../../../../util/localCache';
import HeaderBtn from '../HeaderBtn';
import {
  Button,
  Input,
  message,
  Form,
  Icon,
  Popconfirm,
  Popover,
  Radio,
  Modal,
  Checkbox
} from 'antd';
import './RightBtns.less';
import ColorPicker from '../../ColorPicker';
import classNames from 'classnames';
import {
  setThemeColor,
  setLanguage,
  processDailyReportService,
  getProcessStatus
} from 'Util/api';
import { version } from '../../../../../package.json';
import changelog from '../../../../changelog.md';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import ReminderList from './ReminderList';
import PersonCenter from '../../../PersonCenter';

const FormItem = Form.Item;

class RightBtns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      oldpass: '',
      newpass: '',
      newpass2: '',
      confirmDirty: false,
      pickerVisible: false,
      color: '', // 当前主题色
      languageVisible: false,
      language: localStorage.getItem('language'), // 语言
      isRotate: false,
      aboutModalVisible: false,
      checked: true,
      // 数据分析
      dataAnalyseTaskIds: [], // 数据分析任务 id 列表
      versionDescVisible: false,
      personCenterVisible: false
    };
  }

  componentDidMount = () => {};

  getDataAnalyseData = async () => {
    let res;
    try {
      res = await processDailyReportService();
    } catch (err) {
      return message.error(err.message);
    }
    // 没有任务
    if (!res.data.length) {
      return this.setState({
        dataAnalyseTaskIds: []
      });
    }
    const pArr = res.data.map(taskId => getProcessStatus(taskId));

    let pArrRes;
    try {
      pArrRes = await Promise.all(pArr);
    } catch (err) {
      return message.error(err.message);
    }

    // 有未完成的任务
    const unFinishedTaskIndex = pArrRes.findIndex(res => !res.data.IsCompleted);
    if (unFinishedTaskIndex !== -1) {
      this.triggerTaskBtnClick();

      const taskId = res.data[unFinishedTaskIndex];
      this.setState({
        dataAnalyseTaskIds: [...this.state.dataAnalyseTaskIds, taskId]
      });

      // 没有未完成的任务
    } else {
      this.setState({
        dataAnalyseTaskIds: []
      });
    }
  };

  triggerTaskBtnClick = () => {
    const btn = document.querySelector('.page-header-v2-btn-icon.icon-task');
    btn.dispatchEvent(new Event('click', { bubbles: true, cancelable: false }));
    document.body.dispatchEvent(
      new Event('click', { bubbles: true, cancelable: false })
    );
  };

  handleMessageBtnClick = () => {
    this.redirectTo('/reminder');
  };

  handleReportTableBtnClick = () => {
    this.redirectTo('/report-table');
  };

  clearCacheBtnClick = async () => {
    const { intl } = this.props;
    try {
      const response = await clearCache();
      removeItem('formsData');
      if (response === 'ok') {
        message.success(intl.messages['RightBtns.success']);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  handleSettingBtnClick = () => {
    this.redirectTo('/workbench-setting');
  };

  handleModifyPasswordBtnClick = () => {
    this.setState({
      visible: true
    });
  };

  handleAboutClick = () => {
    this.setState({ aboutModalVisible: true });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleLogoutBtnClick = () => {
    logout();
    this.props.history.push('/');
  };

  handleLockBtnClick = () => {
    this.props.onLockScreen();
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    if (
      this.props.form.getFieldValue('password2') !== undefined &&
      this.props.form.getFieldValue('password2') !== '' &&
      this.props.form.getFieldValue('password1') ===
        this.props.form.getFieldValue('password2')
    ) {
      try {
        const response = await changePassword(
          this.props.form.getFieldValue('password'),
          this.props.form.getFieldValue('password1')
        );
        const result = response.message;

        if (result === '密码修改成功!') {
          message.success('密码修改成功!');
          this.setState({
            oldpass: '',
            newpass: '',
            newpass2: '',
            visible: false
          });
        }
        if (result === '原密码不正确') {
          message.error('原密码不正确!');
          this.setState({
            visible: true
          });
        }

        const form = this.props.form;
        if (
          result === '修改密码失败，修改后的密码不能与原来密码相同。' &&
          form.getFieldValue('password1') != ''
        ) {
          message.error('修改后的密码不能与原来密码相同!');
          this.setState({
            visible: true
          });
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;

    if (value && value.length < 6) {
      callback('输入的长度不能小于6位数！');
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['password2'], { force: true });
    }
    if (
      value &&
      value !== form.getFieldValue('password1') &&
      value.length > 6
    ) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (
      value &&
      value !== form.getFieldValue('password1') &&
      value.length > 6
    ) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  };

  redirectTo = url => {
    if (this.props.match.url !== url) {
      this.props.history.push(url);
    }
  };

  vars = { '@primary-color': '' };
  handleChangeComplete = (val, color) => {
    const rbga = color.rgb;
    this.vars = {
      '@primary-color': `rgba(${rbga.r},${rbga.g},${rbga.b},${rbga.a})`
    };
    this.setState({ color: rbga });
  };

  renderSelectedColor = async () => {
    const { intl } = this.props;
    this.setState({ loading: true });
    setTimeout(() => {
      window.less
        .modifyVars(this.vars)
        .then(() => {
          this.setState({ loading: false, pickerVisible: false });
          message.success(intl.messages['RightBtns.success']);
        })
        .catch(err => {
          this.setState({ loading: false });
          console.error(err);
          return message.error(err.message);
        });
    }, 200);
    let res;
    try {
      res = await setThemeColor(this.vars['@primary-color']);
    } catch (err) {
      return message.error(err.message);
    }
    this.modUserInfoThemColor(this.vars['@primary-color']);
  };

  modUserInfoThemColor = color => {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        userInfo = JSON.parse(userInfo);
      } catch (err) {
        return;
      }
      userInfo.UserInfo.EMP_Color = color;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  handleRadioGroupChange = async e => {
    const { intl } = this.props;
    const value = e.target.value;
    let res;
    try {
      res = await setLanguage(value);
    } catch (err) {
      return message.error(err.message);
    }
    if (res.OpResult === 'Y') {
      this.modLanguage(value);
      this.setState({ language: value });
      message.success(intl.messages['RightBtns.success']);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  modLanguage = language => {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        userInfo = JSON.parse(userInfo);
      } catch (err) {
        return;
      }
      userInfo.UserInfo.EMP_LANGUAGE = language;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('language', language);
    }
  };

  handleSeparateBtnClick = () => {
    this.setState({
      isRotate: !this.state.isRotate
    });
  };

  handleVersionDescBtnClick = () => {
    this.setState({ versionDescVisible: !this.state.versionDescVisible });
  };

  render() {
    const {
      visible,
      color,
      language,
      aboutModalVisible,
      versionDescVisible,
      personCenterVisible
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    return (
      <div className="new-home__right-btns">
        <HeaderBtn
          className="right-btns__header-btn"
          iconClass="icon-mod-password"
          onClick={this.handleModifyPasswordBtnClick}
          tip={<FM id="RightBtns.ChangePassword" defaultMessage="修改密码" />}
        />

        <HeaderBtn
          className="right-btns__header-btn"
          iconClass="icon-clear-cache"
          onClick={this.clearCacheBtnClick}
          tip={<FM id="RightBtns.ClearCache" defaultMessage="清除缓存" />}
        />

        <Popover
          placement="bottomLeft"
          title={
            <div style={{ textAlign: 'right' }}>
              <FM id="RightBtns.SelectThemeColor" defaultMessage="选择主题色" />
            </div>
          }
          trigger="click"
          content={
            <React.Fragment>
              <ColorPicker
                color={color}
                onChangeComplete={this.handleChangeComplete}
              />
              <div className="color-picker-btns">
                <Button
                  size="small"
                  className="color-picker-btn"
                  onClick={this.renderSelectedColor}
                >
                  <FM id="RightBtns.OK" defaultMessage="确定" />
                </Button>
              </div>
            </React.Fragment>
          }
        >
          <HeaderBtn
            className="right-btns__header-btn"
            iconClass="icon-theme"
            onClick={() => this.setState({ pickerVisible: true })}
            tip={
              <FM id="RightBtns.ChangeThemeColor" defaultMessage="更换主题色" />
            }
          />
        </Popover>
        <HeaderBtn
          className="right-btns__header-btn"
          iconClass="icon-setting"
          onClick={() => this.setState({ personCenterVisible: true })}
          tip={<FM id="RightBtns.DisplayMode" defaultMessage="显示模式" />}
        />
        <Popover
          placement="bottomRight"
          title={
            <div style={{ textAlign: 'right' }}>
              <FM id="RightBtns.SelectLanguage" defaultMessage="选择语言" />
            </div>
          }
          trigger="click"
          content={
            <Radio.Group
              value={language}
              onChange={this.handleRadioGroupChange}
            >
              <Radio.Button value="中文">中文</Radio.Button>
              <Radio.Button value="English">English</Radio.Button>
            </Radio.Group>
          }
        >
          <HeaderBtn
            className="right-btns__header-btn"
            iconClass="icon-language"
            onClick={() => this.setState({ languageVisible: true })}
            tip={<FM id="RightBtns.ChangeLanguage" defaultMessage="更换语言" />}
          />
        </Popover>
        {/* <HeaderBtn
          className="right-btns__header-btn"
          iconClass="icon-about"
          onClick={this.handleAboutClick}
          tip={<FM id="RightBtns.About" defaultMessage="关于" />}
        /> */}
        <Popconfirm
          placement="bottomLeft"
          title={
            <FM
              id="RightBtns.sureLogoff"
              defaultMessage="您确定要退出登录吗？"
            />
          }
          onConfirm={this.handleLogoutBtnClick}
        >
          <HeaderBtn
            className="right-btns__header-btn"
            iconClass="icon-signout"
            tip={<FM id="RightBtns.Logoff" defaultMessage="退出登录" />}
          />
        </Popconfirm>

        <Modal
          visible={aboutModalVisible}
          width={'500px'}
          title={
            <div className="right-btns__about-modal">
              <i className="iconfont icon-logo" />
              <div>Power Works</div>
            </div>
          }
          closable={false}
          footer={''}
          destroyOnClose={true}
          onCancel={() =>
            this.setState({
              aboutModalVisible: false,
              versionDescVisible: false
            })
          }
        >
          <div className="right-btns__about-modal-content">
            <Checkbox
              style={{ marginLeft: 12 }}
              checked={this.state.checked}
              disabled={this.state.disabled}
              onChange={() => this.setState({ checked: true })}
            />
            <div
              className="right-btns__about-modal-version"
              style={{ marginLeft: 30 }}
            >
              <strong>Power Works</strong>
              <strong>
                <FM id="RightBtns.Version" defaultMessage="版本：" />
                {version}
              </strong>
            </div>
            <div className="right-btns__about-modal-btn">
              <Button size="small" onClick={this.handleVersionDescBtnClick}>
                <FM
                  id="RightBtns.VersionUpdate"
                  defaultMessage="版本更新说明"
                />
              </Button>
            </div>
          </div>
          {versionDescVisible && (
            <div className="right-btns__about-modal-version-desc">
              <div className="right-btns__about-modal-version-desc-content">
                <ReactMarkdown source={changelog} />
              </div>
            </div>
          )}
        </Modal>

        <Modal
          visible={visible}
          maskClosable={false}
          width={'400px'}
          title={<FM id="RightBtns.ChangePassword" defaultMessage="修改密码" />}
          footer={''}
          destroyOnClose={true}
          onCancel={this.handleCancel}
        >
          <Form className="input-pass1" onSubmit={this.handleSubmit}>
            <FormItem className="pass1">
              {getFieldDecorator('password', {
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
                  className="input-pass"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder={intl.messages['RightBtns.OriginalPassword']}
                />
              )}
            </FormItem>
            <FormItem className="pass">
              {getFieldDecorator('password1', {
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
                  className="input-pass"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder={intl.messages['RightBtns.NewPassword']}
                />
              )}
            </FormItem>
            <FormItem className="pass">
              {getFieldDecorator('password2', {
                rules: [
                  {
                    required: true,
                    message: (
                      <FM
                        id="RightBtns.NewPasswordAgainTip"
                        defaultMessage="请再次输入新密码"
                      />
                    )
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input
                  className="input-pass"
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
              <Button className="btn-submit" type="primary" htmlType="submit">
                <FM id="RightBtns.Submit" defaultMessage="提交" />
              </Button>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={personCenterVisible}
          onCancel={() => {
            this.setState({ personCenterVisible: false });
          }}
          footer={null}
        >
          <PersonCenter />
        </Modal>
      </div>
    );
  }
}
const RightBtn = Form.create()(RightBtns);
export default injectIntl(withRouter(RightBtn));
