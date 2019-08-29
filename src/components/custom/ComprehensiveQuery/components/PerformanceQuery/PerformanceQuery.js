import React from 'react';
import './PerformanceQuery.less';
import TargetTarget from './TargetTarget';
import TargetHistory from './TargetHistory';
import TargetSelfAppraise from './TargetSelfAppraise';
import AdvantageShortcoming from './AdvantageShortcoming';
import ViewTarget from './ViewTarget';
import ViewRate from './ViewRate';
import ViewComments from './ViewComments';

const activeClasssName = 'performance-query_nav_item__active';
const activeTargetItem = 'performance-query_item_nav_item__active';
class PerformanceQuery extends React.Component {
  state = {
    currentNav: 'target',
    targetSelectItem: 'target',
    middleOfYearSelectItem: 'targetSelfAppraise',
    endOfYearSelectItem: 'targetSelfAppraise',
    directlySelectItem: 'viewTarget'
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
  render() {
    const {
      currentNav,
      targetSelectItem,
      middleOfYearSelectItem,
      endOfYearSelectItem,
      directlySelectItem
    } = this.state;
    const { personId } = this.props;
    console.log(this.props);
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
                  <TargetTarget personId={personId} />
                )}
                {targetSelectItem === 'history' && (
                  <TargetHistory personId={personId} />
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
                  <TargetSelfAppraise personId={personId} />
                )}
                {middleOfYearSelectItem === 'advantageShortcoming' && (
                  <AdvantageShortcoming personId={personId} />
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
                  <TargetSelfAppraise personId={personId} />
                )}
                {endOfYearSelectItem === 'advantageShortcoming' && (
                  <AdvantageShortcoming personId={personId} />
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
                <span
                  onClick={this.handleDirectlyNavChange('viewRate')}
                  className={`performance-query_item_nav_item ${directlySelectItem ===
                    'viewRate' && activeTargetItem}`}
                >
                  评优评级查看
                </span>
              </div>
              <div className="performance-query_item_content_wrap">
                {directlySelectItem === 'viewTarget' && (
                  <ViewTarget personId={personId} />
                )}
                {directlySelectItem === 'viewComments' && (
                  <ViewComments personId={personId} />
                )}
                {directlySelectItem === 'viewRate' && (
                  <ViewRate personId={personId} />
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
