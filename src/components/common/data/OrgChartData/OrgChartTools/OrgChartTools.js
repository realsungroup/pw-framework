import React from 'react';
import PropTypes from 'prop-types';
import './OrgChartTools.less';
import { ResizableBox } from 'react-resizable';
import { Radio } from 'antd';
import Draggable from 'react-draggable';
import IconWithTooltip from 'Common/ui/IconWithTooltip';
import classNames from 'classnames';
import { FNLIST, TEMPLATES, ORIENTATIONS } from './constants';
const RadioGroup = Radio.Group;
const prefix = 'org-chart-tools';
const Fragment = React.Fragment;

/**
 * 组织图
 */
export default class OrgChartTools extends React.Component {
  static propTypes = {
    /**
     * 选择的模板
     */
    selectedTemplate: PropTypes.oneOf([
      'luba',
      'derek',
      'olivia',
      'diva',
      'mila',
      'polina',
      'mery',
      'rony',
      'belinda',
      'ula',
      'ana'
    ]),

    /**
     * 选择的方向
     */
    selectedOrientation: PropTypes.oneOf([
      'top',
      'bottom',
      'right',
      'left',
      'top_left',
      'bottom_left',
      'right_top',
      'left_top'
    ]),

    /**
     * 模板改变的回调函数
     */
    templateChange: PropTypes.func
  };

  static defaultProps = {
    dataItem: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      activeKey: 'template' // 已选中的功能
    };
  }

  handleTemplateChange = e => {
    const value = e.target.value;
    this.props.templateChange && this.props.templateChange(value);
  };

  handleOrientationChange = e => {
    const value = e.target.value;
    this.props.orientationChange && this.props.orientationChange(value);
  };

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  renderTemplateContent = () => {
    const { activeKey } = this.state;
    const { selectedTemplate } = this.props;

    return (
      <div
        className={classNames(`${prefix}__template`, {
          [`${prefix}__content--hide`]: activeKey !== 'template'
        })}
      >
        <RadioGroup
          onChange={this.handleTemplateChange}
          value={selectedTemplate}
        >
          {TEMPLATES.map(template => (
            <div key={template.value}>
              <Radio value={template.value}>{template.label}</Radio>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  renderOrientationContent = () => {
    const { activeKey } = this.state;
    const { selectedOrientation } = this.props;

    return (
      <div
        className={classNames(`${prefix}__orientation`, {
          [`${prefix}__content--hide`]: activeKey !== 'orientation'
        })}
      >
        <RadioGroup
          onChange={this.handleOrientationChange}
          value={selectedOrientation}
        >
          {ORIENTATIONS.map(orientation => (
            <div key={orientation.value}>
              <Radio value={orientation.value}>{orientation.label}</Radio>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  handleFnClick = activeKey => {
    this.setState({ activeKey });
  };

  render() {
    const { template } = this.props;
    const { activeKey } = this.state;

    return (
      <Draggable
        axis="both"
        handle=".org-chart-tools__header"
        defaultPosition={{ x: 10, y: 10 }}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        bounds="parent"
      >
        <div className={`${prefix}__resize-wrap`}>
          <ResizableBox
            width={250}
            height={300}
            minConstraints={[250, 250]}
            maxConstraints={[250, 500]}
            className={prefix}
          >
            <div className={`${prefix}__wrap ${prefix}__wrap--${template}`}>
              <div className={`${prefix}__header`}>工具栏</div>
              <div className={`${prefix}__body`}>
                <ul className={`${prefix}__list`}>
                  {FNLIST.map(item => {
                    const className = classNames(`${prefix}__list-item`, {
                      [`${prefix}__list-item--selected`]: activeKey === item.key
                    });
                    return (
                      <li
                        key={item.key}
                        className={className}
                        onClick={() => this.handleFnClick(item.key)}
                      >
                        <IconWithTooltip
                          tip={item.tip}
                          iconClass={item.iconClass}
                          placement="right"
                          style={{ fontSize: 18 }}
                        />
                      </li>
                    );
                  })}
                </ul>
                <div className={`${prefix}__content`}>
                  {this.renderTemplateContent()}
                  {this.renderOrientationContent()}
                </div>
              </div>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    );
  }
}
