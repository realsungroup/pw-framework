import React from 'react';
import PropTypes from 'prop-types';
import FunctionsHeader from '../components/FunctionsHeader';
import './Functions.less';

// 从 “导出中心” 导入所有的组件
import * as components from '../../export-center';

/**
 * 模块功能组件：根据配置信息来调用具体的组件
 */
export default class Functions extends React.Component {
  static propTypes = {
    /**
     * 组件的配置
     */
    config: PropTypes.shape({
      title: PropTypes.string.isRequired, // 标题
      name: PropTypes.string.isRequired, // 所用组件名称
      props: PropTypes.object.isRequired, // 组件接收的 props
      hasBackBtn: PropTypes.bool // 是否有返回上一页的按钮
    }).isRequired
    // 如：
    // {
    //   title: '人员信息',
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
    this.state = {};
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
    props = props || {};
    return <C {...props} />;
  };

  render() {
    const { name, props, title, hasBackBtn = true } = this.props.config;
    return (
      <div className="functions">
        <FunctionsHeader hasBackBtn={hasBackBtn} title={title} />
        {/* <div className="functions__header">
          {hasBackBtn && (
            <i className="back-btn iconfont icon-back" onClick={this.back} />
          )}
          <span className="functions__header-title">{title}</span>
        </div> */}
        {this.renderComponent(name, props)}
      </div>
    );
  }
}
