import React from 'react';
import PropTypes from 'prop-types';
import './OrgChartTools.less';
import { ResizableBox } from 'react-resizable';
import { Radio, Input } from 'antd';
import Draggable from 'react-draggable';
import IconWithTooltip from 'Common/ui/IconWithTooltip';
import classNames from 'classnames';
import { FNLIST, TEMPLATES, ORIENTATIONS } from './constants';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { getIntlVal } from 'Util20/util';

const RadioGroup = Radio.Group;
const prefix = 'org-chart-tools';

/**
 * 组织图
 */
class OrgChartTools extends React.Component {
  static propTypes = {
    /**
     * 状态：'max' 最大化状态 | 'min' 最小化状态
     * 默认：'max'
     */
    status: PropTypes.oneOf(['max', 'min']),

    /**
     * 选择的模板
     * 默认：'luba'
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
     * 默认：'top'
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
    status: 'max',
    selectedTemplate: 'luba',
    selectedOrientation: 'top'
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

  renderLevelContent = () => {
    const { activeKey } = this.state;
    const { level, onLevelChange, onLevelConfirm } = this.props;

    return (
      <div
        className={classNames(`${prefix}__level`, {
          [`${prefix}__content--hide`]: activeKey !== 'level'
        })}
      >
        <div>层级数</div>
        <Input.Search
          enterButton={'确定'}
          value={level}
          onChange={onLevelChange}
          onSearch={onLevelConfirm}
        />
      </div>
    );
  };

  handleFnClick = activeKey => {
    this.setState({ activeKey });
  };

  handleMin = () => {
    this.props.onMin && this.props.onMin();
  };

  handleMax = () => {
    this.props.onMax && this.props.onMax();
  };

  render() {
    const { status, selectedTemplate } = this.props;
    const { activeKey } = this.state;

    const width = status === 'max' ? 250 : 30;
    const height = status === 'max' ? 300 : 30;

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
        {status === 'max' ? (
          <div className={`${prefix}__resize-wrap`}>
            <ResizableBox
              width={width}
              height={height}
              minConstraints={[width, height]}
              maxConstraints={[width, height]}
              className={prefix}
              disabled
            >
              <div
                className={`${prefix}__wrap ${prefix}__wrap--${selectedTemplate}`}
              >
                <div className={`${prefix}__header`}>
                  <FM id="OrgChartData.setting" defaultMessage="设置" />
                  <i
                    className="iconfont icon-org-chart-min-btn"
                    onClick={this.handleMin}
                  />
                </div>
                <div className={`${prefix}__body`}>
                  <ul className={`${prefix}__list`}>
                    {FNLIST.map(item => {
                      const className = classNames(`${prefix}__list-item`, {
                        [`${prefix}__list-item--selected`]:
                          activeKey === item.key
                      });
                      const { locale } = this.props.intl;
                      return (
                        <li
                          key={item.key}
                          className={className}
                          onClick={() => this.handleFnClick(item.key)}
                        >
                          <IconWithTooltip
                            tip={getIntlVal(locale, item.enTip, item.tip)}
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
                    {this.renderLevelContent()}
                  </div>
                </div>
              </div>
            </ResizableBox>
          </div>
        ) : (
          <div
            style={{ width, height }}
            className={classNames('org-chart-tools__config', {
              'org-chart-tools__config--color-black':
                selectedTemplate !== 'luba'
            })}
            onClick={this.handleMax}
          >
            <i className="iconfont icon-org-chart-config" />
          </div>
        )}
      </Draggable>
    );
  }
}

export default injectIntl(OrgChartTools);
