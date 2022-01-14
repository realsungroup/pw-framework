import React from 'react';
import PropTypes from 'prop-types';
import FunctionsHeader from '../components/FunctionsHeader';
import './Functions.less';
import withTitle from 'Common/hoc/withTitle';
import { getItem } from 'Util20/util';

// 从 “导出中心” 导入所有的组件
import * as components from '../../export-center';

const { Fragment } = React;

/**
 * 模块功能组件：根据配置信息来调用具体的组件
 */
class Functions extends React.Component {
  static propTypes = {
    /**
     * 组件的配置
     */
    config: PropTypes.shape({
      title: PropTypes.string.isRequired, // 标题
      name: PropTypes.string.isRequired, // 所用组件名称
      props: PropTypes.object, // 组件接收的 props
      hasBackBtn: PropTypes.bool // 是否有返回上一页的按钮
    }).isRequired
    // 如：
    // {
    //   title: '人员信息', // 标题
    //   enTitle: 'Staff Info', // 英文标题
    //   name: 'TableData', // 使用组件的名称
    //   hasBackBtn: false, // 没有返回上一页的按钮
    //   props: { // TableData 组件接收的 props
    //     resid: 666
    //   }
    // }
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    let userInfo;
    try {
      userInfo = JSON.parse(getItem('userInfo'));
    } catch (err) {}

    // 'DESKTOP' or 'WORKBENCH'
    let desktopStyle;
    try {
      desktopStyle = userInfo.UserInfo.EMP_MAINPAGE;
      if (['DESKTOP', 'WORKBENCH'].indexOf(desktopStyle) === -1) {
        // 默认 'WORKBENCH'
        desktopStyle = 'DESKTOP';
      }
    } catch (err) {}
    this.state = {
      desktopStyle:'DESKTOP'
    };
  }

  componentDidMount() {
    const { config, modifyDocumentTitle } = this.props;
    const language = getItem('language') || '中文';
    if (language === '中文') {
      modifyDocumentTitle(config.title);
    } else {
      modifyDocumentTitle(config.enTitle);
    }
  }

  back = () => {
    this.props.history.goBack();
  };

  // 渲染组件
  renderComponent = (name, props) => {
    if (!name) {
      return '该功能模块没有进行配置，请在 public/functions.config.js 文件中进行配置';
    }
    const C = components[name];
    if (!C) {
      return `没有名为 ${name} 的单元组件`;
    }
    const { history, location, match } = this.props;
    props = { ...(props || {}), history, location, match };
    return <C {...props} />;
  };

  renderFunctionBody = () => {
    const { desktopStyle } = this.state;

    const {
      name,
      props,
      hasBackBtn = true,
      hasHeader = true,
      title
    } = this.props.config;

    // desktop
    if (desktopStyle === 'DESKTOP') {
      return (
        <div className="functions__body">
          {this.renderComponent(name, props)}
        </div>
      );
    }

    // workbench
    return (
      <div className="functions__body">
        {/* <FunctionsHeader hasBackBtn={hasBackBtn} title={title} /> */}
        <div className="functions__body">
          {this.renderComponent(name, props)}
        </div>
      </div>
    );
  };

  render() {
    return <div className="functions">{this.renderFunctionBody()}</div>;
  }
}

export default withTitle()(Functions);
