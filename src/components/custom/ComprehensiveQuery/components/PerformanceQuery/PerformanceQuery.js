import React from 'react';
import './PerformanceQuery.less';
import TargetTarget from './TargetTarget';
import TargetHistory from './TargetHistory';
import TargetSelfAppraise from './TargetSelfAppraise';
import AdvantageShortcoming from './AdvantageShortcoming';
import ViewTarget from './ViewTarget';
import ViewComments from './ViewComments';
import http from 'Util20/api';
import { message, Select } from 'antd';

const { Option } = Select;
const activeClasssName = 'performance-query_nav_item__active';
const activeTargetItem = 'performance-query_item_nav_item__active';
class PerformanceQuery extends React.Component {
  state = {
    currentNav: 'target',
    targetSelectItem: 'target',
    middleOfYearSelectItem: 'targetSelfAppraise',
    endOfYearSelectItem: 'targetSelfAppraise',
    directlySelectItem: 'viewTarget',
    years: [],
    selectYear: { key: 0, label: '请选择财年' }
  };
  componentDidMount = async () => {
    const { person } = this.props;
    let id;
    if (person) {
      id = person.C3_305737857578;
    }
    this.getYearsTarget(id);
  };
  componentDidUpdate(prevProps) {
    if (
      prevProps.person.C3_305737857578 !== this.props.person.C3_305737857578
    ) {
      this.getYearsTarget(this.props.person.C3_305737857578);
    }
  }
  getYearsTarget = async id => {
    try {
      const res = await http().getTable({
        resid: '620409727880',
        cparm1: id,
        dblinkname: 'ehr'
      });
      if (res.data.length) {
        this.setState({
          years: res.data,
          selectYear: {
            key: res.data[0].C3_420297595131,
            label: res.data[0].C3_420150922019
          }
        });
      } else {
        this.setState({
          years: [],
          selectYear: { key: 0, label: '请选择财年' }
        });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  handleNavChange = key => {
    return () => {
      this.setState({
        currentNav: key
      });
    };
  };
  handleTargetNavChange = key => {
    return () => {
      this.setState({
        targetSelectItem: key
      });
    };
  };
  handleMiddleOfYearNavChange = key => {
    return () => {
      this.setState({
        middleOfYearSelectItem: key
      });
    };
  };
  handleEndOfYearNavChange = key => {
    return () => {
      this.setState({
        endOfYearSelectItem: key
      });
    };
  };
  handleDirectlyNavChange = key => {
    return () => {
      this.setState({
        directlySelectItem: key
      });
    };
  };

  renderSelect = () => {
    return (
      <Select
        style={{ width: 120, marginBottom: 16 }}
        placeholder="选择财年"
        value={this.state.selectYear}
        onSelect={selectValue => {
          this.setState({ selectYear: selectValue });
        }}
        labelInValue
      >
        {this.state.years.map(target => (
          <Option value={target.C3_420297595131}>
            {target.C3_420150922019}
          </Option>
        ))}
      </Select>
    );
  };
  render() {
    const {
      currentNav,
      targetSelectItem,
      middleOfYearSelectItem,
      endOfYearSelectItem,
      directlySelectItem,
      selectYear
    } = this.state;
    const { person } = this.props;
    return (
      <div className="performance-query">
        <nav className="performance-query_nav">
          <span
            className={`performance-query_nav_item ${currentNav === 'target' &&
              activeClasssName}`}
            onClick={this.handleNavChange('target')}
          >
            目标
          </span>
          <span
            className={`performance-query_nav_item ${currentNav ===
              'middleOfYear' && activeClasssName}`}
            onClick={this.handleNavChange('middleOfYear')}
          >
            年中自评
          </span>
          <span
            className={`performance-query_nav_item ${currentNav ===
              'endOfYear' && activeClasssName}`}
            onClick={this.handleNavChange('endOfYear')}
          >
            年末自评
          </span>
          <span
            className={`performance-query_nav_item ${currentNav ===
              'directly' && activeClasssName}`}
            onClick={this.handleNavChange('directly')}
          >
            直评查询
          </span>
        </nav>
        <section className="performance-query_content-wrap">
          {/* 目标 */}
          {currentNav === 'target' && (
            <div className="performance-query_item">
              <div className="performance-query_item_nav">
                <span
                  onClick={this.handleTargetNavChange('target')}
                  className={`performance-query_item_nav_item ${targetSelectItem ===
                    'target' && activeTargetItem}`}
                >
                  目标
                </span>
                <span
                  onClick={this.handleTargetNavChange('history')}
                  className={`performance-query_item_nav_item ${targetSelectItem ===
                    'history' && activeTargetItem}`}
                >
                  历史记录
                </span>
              </div>
              <div className="performance-query_item_content_wrap">
                {targetSelectItem === 'target' && (
                  <TargetTarget person={person} selectYear={selectYear}>
                    {this.renderSelect()}
                  </TargetTarget>
                )}
                {targetSelectItem === 'history' && (
                  <TargetHistory person={person} selectYear={selectYear}>
                    {this.renderSelect()}
                  </TargetHistory>
                )}
              </div>
            </div>
          )}
          {/* 年中自评 */}
          {currentNav === 'middleOfYear' && (
            <div className="performance-query_item">
              <div className="performance-query_item_nav">
                <span
                  onClick={this.handleMiddleOfYearNavChange(
                    'targetSelfAppraise'
                  )}
                  className={`performance-query_item_nav_item ${middleOfYearSelectItem ===
                    'targetSelfAppraise' && activeTargetItem}`}
                >
                  目标自评
                </span>
                <span
                  onClick={this.handleMiddleOfYearNavChange(
                    'advantageShortcoming'
                  )}
                  className={`performance-query_item_nav_item ${middleOfYearSelectItem ===
                    'advantageShortcoming' && activeTargetItem}`}
                >
                  优缺点
                </span>
              </div>
              <div className="performance-query_item_content_wrap">
                {middleOfYearSelectItem === 'targetSelfAppraise' && (
                  <TargetSelfAppraise
                    person={person}
                    selectYear={selectYear}
                    type="年中"
                  >
                    {this.renderSelect()}
                  </TargetSelfAppraise>
                )}
                {middleOfYearSelectItem === 'advantageShortcoming' && (
                  <AdvantageShortcoming
                    person={person}
                    type="年中"
                  ></AdvantageShortcoming>
                )}
              </div>
            </div>
          )}
          {/* 年末自评 */}
          {currentNav === 'endOfYear' && (
            <div className="performance-query_item">
              <div className="performance-query_item_nav">
                <span
                  onClick={this.handleEndOfYearNavChange('targetSelfAppraise')}
                  className={`performance-query_item_nav_item ${endOfYearSelectItem ===
                    'targetSelfAppraise' && activeTargetItem}`}
                >
                  目标自评
                </span>
                <span
                  onClick={this.handleEndOfYearNavChange(
                    'advantageShortcoming'
                  )}
                  className={`performance-query_item_nav_item ${endOfYearSelectItem ===
                    'advantageShortcoming' && activeTargetItem}`}
                >
                  优缺点
                </span>
              </div>
              <div className="performance-query_item_content_wrap">
                {endOfYearSelectItem === 'targetSelfAppraise' && (
                  <TargetSelfAppraise
                    person={person}
                    type="年末"
                    selectYear={selectYear}
                  >
                    {this.renderSelect()}
                  </TargetSelfAppraise>
                )}
                {endOfYearSelectItem === 'advantageShortcoming' && (
                  <AdvantageShortcoming
                    person={person}
                    type="年末"
                  ></AdvantageShortcoming>
                )}
              </div>
            </div>
          )}
          {/* 直评查询 */}
          {currentNav === 'directly' && (
            <div className="performance-query_item">
              <div className="performance-query_item_nav">
                <span
                  onClick={this.handleDirectlyNavChange('viewTarget')}
                  className={`performance-query_item_nav_item ${directlySelectItem ===
                    'viewTarget' && activeTargetItem}`}
                >
                  目标查看
                </span>
                <span
                  onClick={this.handleDirectlyNavChange('viewComments')}
                  className={`performance-query_item_nav_item ${directlySelectItem ===
                    'viewComments' && activeTargetItem}`}
                >
                  评语查看
                </span>
              </div>
              <div className="performance-query_item_content_wrap">
                {directlySelectItem === 'viewTarget' && (
                  <ViewTarget person={person} selectYear={selectYear}>
                    {this.renderSelect()}
                  </ViewTarget>
                )}
                {directlySelectItem === 'viewComments' && (
                  <ViewComments person={person} />
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default PerformanceQuery;
