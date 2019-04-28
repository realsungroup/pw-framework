import React from 'react';
import { message, Steps, Button } from 'antd';
import classNames from 'classnames';
import FirstStep from './FirstStep';
import './SelectPersonnel.less';
import { propTypes, defaultProps } from './propTypes';

const Fragment = React.Fragment;
const { Step } = Steps;

/**
 * 显示记录的表单，且具有增改查功能
 */
class SelectPersonnel extends React.Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }
  _personList = [];
  handleSelect = personList => {
    this._personList = personList;
    this.props.onSelectPerson && this.props.onSelectPerson(personList);
  };

  renderContent = () => {
    const { current } = this.state;
    const {
      stepList,
      listConfig,
      subResid,
      searchConfig,
      personFields,
      radioGroupConfig,
      personPrimaryKeyField
    } = this.props;
    return (
      <Fragment>
        <div
          className={classNames('select-personnel__step', {
            'select-personnel__step--show': current === 0,
            'select-personnel__step--hide': current !== 0
          })}
        >
          <FirstStep
            onSelect={this.handleSelect}
            listConfig={listConfig}
            subResid={subResid}
            searchConfig={searchConfig}
            personFields={personFields}
            radioGroupConfig={radioGroupConfig}
            personPrimaryKeyField={personPrimaryKeyField}
          />
        </div>
        {stepList.map((step, index) => (
          <div
            className={classNames('select-personnel__step', {
              'select-personnel__step--show': current === index + 1,
              'select-personnel__step--hide': current !== index + 1
            })}
            key={step.stepTitle}
          >
            {step.renderContent(current)}
          </div>
        ))}
      </Fragment>
    );
  };

  toNextStep = () => {
    const { current, personList } = this.state;
    // 第一步
    if (current === 0) {
      if (!this._personList.length) {
        return message.error('请先选择人员');
      }
      this.setState({ current: current + 1 });

      // 第二步以及之后
    } else {
      const { stepList } = this.props;
      if (
        !stepList[current - 1].canToNext ||
        stepList[current - 1].canToNext()
      ) {
        this.setState({ current: ++this.state.current });
      }
    }
  };

  toPreStep = () => {
    this.setState({ current: --this.state.current });
  };

  complete = async () => {
    this.props.onComplete && this.props.onComplete();
  };

  render() {
    const { current } = this.state;
    const { stepList, completeText } = this.props;
    const lastIndex = stepList.length;
    return (
      <div className="select-personnel">
        {/* 头部 */}
        <Steps current={current}>
          <Step title="选择人员" />
          {stepList.map(step => (
            <Step key={step.stepTitle} title={step.stepTitle} />
          ))}
        </Steps>
        {/* 内容 */}
        <div className="select-personnel__content">{this.renderContent()}</div>
        {/* 下方的按钮（下一步、上一步、完成） */}
        <div className="select-personnel__btns">
          <Button
            type="primary"
            onClick={this.complete}
            disabled={current !== lastIndex}
          >
            {completeText}
          </Button>
          <Button
            type="primary"
            onClick={this.toPreStep}
            disabled={current === 0}
          >
            上一步
          </Button>
          <Button
            type="primary"
            onClick={this.toNextStep}
            disabled={current === lastIndex}
          >
            下一步
          </Button>
        </div>
      </div>
    );
  }
}

export default SelectPersonnel;
