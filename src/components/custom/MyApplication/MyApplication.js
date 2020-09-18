import React, { Component } from 'react';
import './MyApplication.less';
import { Tabs } from 'antd';
import moment from 'moment';
import http from '../../../util20/api';
import TableData from '../../common/data/TableData';
import PropTypes from 'prop-types';
const { TabPane } = Tabs;
class MyApplication extends Component {
  static propTypes = {
    /**
     * 表达初始化值
     */
    initialValue: PropTypes.object
  };

  static defaultProps = {
    initialValue: {}
  };

  constructor(props) {
    super(props);
    this.state = {
    };

  }
  componentDidMount() {

  }

  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="未审批" key="1">
            <div style={{ width: '100vw', height: 'calc(100vh - 60px)' }}>
              <TableData
                resid={518442541615}
                mainTableProps={{
                  actionBarWidth: 300,
                  hasAdd: true,
                  hasBeBtns: true,
                  hasModify: true,
                  hasBackBtn: true,
                  hasDelete: true,
                  hasRowModify: true,
                  hasRowView: true,
                  hasRowDelete: true,
                  isUseFormDefine: false,
                  // isSetColumnWidth:false,
                  recordFormUseAbsolute: true,

                  backendButtonPopConfirmProps: { placement: 'bottom' },
                  advSearch: {
                    formName: 'defaultSearch'
                  },
                  formProps: {
                    // height: 500
                    width: 1250
                  },
                  subtractH: 200
                }}
                subTablesProps={{
                  518461643267: {
                    hasBeBtns: true,
                    hasRowModify: false,
                    hasRowView: false,
                    hasRowDelete: false,
                    // isSetColumnWidth:false,
                    noWidthFields: 'C3_518436882584',
                    baseURL: 'http://10.108.11.36:6001/',
                    downloadBaseURL: 'http://10.108.21.41:6000/',
                    advSearch: {
                      isRequestFormData: false,
                    },
                  }
                }}

              />

            </div>
          </TabPane>
          <TabPane tab="已审批" key="2">
            <div style={{ width: '100vw', height: 'calc(100vh - 60px)' }}>
              <TableData
                resid={526752850957}
                actionBarWidth={300}
                hasAdd={false}
                hasBeBtns={false}
                hasModify={false}
                hasBackBtn={false}
                hasDelete={false}
                hasRowModify={false}
                hasRowView={false}
                hasRowDelete={false}
                isUseFormDefine={false}
              />

            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MyApplication;
