import React from 'react';
import PropTypes from 'prop-types';
import './OrgChartTools.less';
import { ResizableBox } from 'react-resizable';
import { Radio } from 'antd';
import Draggable from 'react-draggable';
import IconWithTooltip from 'Common/ui/IconWithTooltip';
import classNames from 'classnames';

const RadioGroup = Radio.Group;

const prefix = 'org-chart-tools';

// 功能列表
const list = [
  {
    key: 'template',
    tip: '模板',
    iconClass: 'icon-about'
  }
];

const templates = [
  {
    value: 'luba',
    label: 'luba'
  },
  {
    value: 'derek',
    label: 'derek'
  },
  {
    value: 'olivia',
    label: 'olivia'
  },
  {
    value: 'diva',
    label: 'diva'
  },
  {
    value: 'mila',
    label: 'mila'
  },
  {
    value: 'polina',
    label: 'polina'
  },
  {
    value: 'mery',
    label: 'mery'
  },
  {
    value: 'rony',
    label: 'rony'
  },
  {
    value: 'belinda',
    label: 'belinda'
  },
  {
    value: 'ula',
    label: 'ula'
  },
  {
    value: 'ana',
    label: 'ana'
  }
];

/**
 * 组织图
 */
export default class OrgChartTools extends React.Component {
  static propTypes = {
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
      activeKey: 'template',
      selectedTemplate: 'luba' // 已选择的模板
    };
  }

  handleTemplateChange = e => {
    const value = e.target.value;
    this.setState({ selectedTemplate: value }, () => {
      this.props.templateChange && this.props.templateChange(value);
    });
  };

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  renderTemplateContent = () => {
    const { selectedTemplate } = this.state;

    return (
      <div key="template" className={`${prefix}__template`}>
        <RadioGroup
          onChange={this.handleTemplateChange}
          value={selectedTemplate}
        >
          {templates.map(template => (
            <div key={template.value}>
              <Radio value={template.value}>{template.label}</Radio>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  render() {
    const { className } = this.props;
    const { activeKey, boundRight, boundBottom } = this.state;

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
            <div className={`${prefix}__wrap`}>
              <div className={`${prefix}__header`}>工具栏</div>
              <div className={`${prefix}__body`}>
                <ul className={`${prefix}__list`}>
                  {list.map(item => {
                    const className = classNames(`${prefix}__list-item`, {
                      [`${prefix}__list-item--selected`]: activeKey === item.key
                    });
                    return (
                      <li key={item.key} className={className}>
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
                </div>
              </div>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    );
  }
}
