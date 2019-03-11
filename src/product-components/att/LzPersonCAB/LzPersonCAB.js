import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Tabs, DatePicker } from 'antd';
import './LzPersonCAB.less';
import { LzTable, LzTabs } from '../../../loadableComponents';
import moment from 'moment';
import CurMonSchedule from './CurMonSchedule';
import tabsProps from './config';
const { MonthPicker,RangePicker } = DatePicker;
const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

/**
 * 个人考勤
 */
export default class LzPersonCAB extends React.Component {
  static propTypes = {
    /**
     * 用户记录
     */
    record: PropTypes.object.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      selectedKey: '1',
      selectedMonth: moment(),
      mRRecord: {}, // 月报记录 
      date:"2018-12-21",
      date2:"2018-12-29"
    };
  }
  handlePanelChange = (date, dateString) => {
    console.log( dateString[0]);
    this.setState({
      date:dateString[0],
      date2:dateString[1]
    })
  }
  componentDidMount() {}

  handleTabsClick = () => {};

  renderContent = () => {
    switch (this.state.selectedKey) {
      // case '1': {
      //   const { resid, subresid, record } = this.props;
      //   const { selectedMonth } = this.state;
      //   const lzTableProps = {
      //     dataMode: 'sub',
      //     resid: resid,
      //     subresid: subresid,
      //     hostrecid: record.REC_ID,
      //     cmswhere: `YEARMONTH = ${selectedMonth.format('YYYYMM')}`,
      //     btnsVisible: {
      //       check: true
      //     },
      //     isSearch: true,
      //     tableSize: 'small',
      //     exceptTableInnerHeight: 225
      //   };
      //   const cmswhere = `YEARMONTH = ${selectedMonth.format(
      //     'YYYYMM'
      //   )} and PNID = ${record.PNID}`;
         
      // }

      case '1': {
        tabsProps.tabPanes.forEach(item => {
          console.log("数据",this.props)
          item.componentInfo.props.hostrecid = this.props.hostrecid;
          item.componentInfo.props.tableSize = 'small';
          item.componentInfo.props.isSearch = false;
          // item.componentInfo.props.cmswhere = `${this.state.date}`
          // item.componentInfo.props.cmswhere = `C3_595620538016 between '${this.state.date}' and '${this.state.date2}'`;
          // item.componentInfo.props.cmswhere = `YEARMONTH = ${this.state.selectedMonth.format(
          //   'YYYYMM'
          // )}`;
        });
        return (
          <div>
            <LzTabs {...tabsProps} />
          </div>
        );
      }


      // case '4': {
      //   const props = {
      //     resid: 593696007689,
      //     pagination: {
      //       current: 0,
      //       pageSize: 10
      //     },
      //     addBtn: true,
      //     btnsVisible: {
      //       edit: false,
      //       save: false,
      //       cancel: false,
      //       check: false,
      //       check: false,
      //       del: true
      //     },
      //     opIsFixed: true,
      //     tableSize: 'small'
      //   };
      //   return <LzTable {...props} />;
      // }
    }
  };

  handleMenuItemChange = ({ key }) => {
    this.setState({ selectedKey: key });
  };

  handleMonthChange = date => {
    if (date) {
      this.setState({ selectedMonth: date });
    }
  };

  render() {
    const { record } = this.props;
    const { selectedMonth } = this.state;
    return (
      <div className="lz-person-ca">
        <Layout style={{ width: '100%', height: '100%' }}>
          {/* <Sider width={260}>
            <div className="lz-person-ca__userinfo">
              <Avatar className="lz-person-ca__avatar" icon="user" size={120} />
              {/* <div className="lz-person-ca__name">{record.YGNAMES}</div> */}

              {/* <div className="lz-person-ca__select-month"> */}
                {/* <RangePicker
                  // value={selectedMonth}
                  onChange={this.handleMonthChange}
                  className="lz-person-ca__month-picker"
                /> */}
                {/* <RangePicker
        placeholder={['开始日期', '结束日期']}
        format="YYYY-MM-DD"
        onChange={this.handlePanelChange}
        className="lz-person-ca__month-picker"
      />
              </div>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              onClick={this.handleMenuItemChange}
            >
              <Menu.Item key="1">
                <Icon type="video-camera" />
                <span className="nav-text">个人调整</span>
              </Menu.Item>
              {/* <Menu.Item key="4">
                <Icon type="video-camera" />
                <span className="nav-text">调休登记</span>
              </Menu.Item> 
            </Menu>
          </Sider> */}
          <Content>
            <div className="lz-person-ca__content">
            {this.renderContent(1)}
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
