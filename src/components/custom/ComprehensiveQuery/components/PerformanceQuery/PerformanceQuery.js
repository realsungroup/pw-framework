import React from 'react';
import './PerformanceQuery.less';
import TargetTarget from './TargetSelfAppraise';
import TargetHistory from './TargetHistory';
import TargetSelfAppraise from './TargetSelfAppraise';
import AdvantageShortcoming from './AdvantageShortcoming';

const activeClasssName = 'performance-query_nav_item__active';
const activeTargetItem = 'performance-query_item_nav_item__active';
class PerformanceQuery extends React.Component {
  state = {
    currentNav: 'target',
    targetSelectItem: 'target',
    middleOfYearSelectItem: 'targetSelfAppraise'
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
  render() {
    const { currentNav, targetSelectItem, middleOfYearSelectItem } = this.state;
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
                {targetSelectItem === 'target' && <TargetTarget />}
                {targetSelectItem === 'history' && <TargetHistory />}
              </div>
            </div>
          )}
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
                  <TargetSelfAppraise />
                )}
                {middleOfYearSelectItem === 'advantageShortcoming' && (
                  <AdvantageShortcoming />
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
