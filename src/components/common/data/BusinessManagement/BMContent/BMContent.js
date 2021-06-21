import React from 'react';
import '../../../styles/BMContent.less';
import { propTypes, defaultProps } from './propTypes';
import { message, Spin, Tabs } from 'antd';
import http, { makeCancelable } from '../../../../../util20/api';
import TableData from '../../TableData';

const TabPane = Tabs.TabPane;

/**
 * 业务管理内容
 */
class BMContent extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hasSubTable: false, // 是否有子表
      subTables: [], // 子表
      selectedRecord: null
    };
    this._httpParams = {};
    const { baseURL } = this.props;
    if (baseURL) {
      this._httpParams = { baseURL };
    }
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  getData = async () => {
    const { resid, dblinkname } = this.props;
    this.p1 = makeCancelable(
      http(this._httpParams).getResourceRelation({
        resid,
        dblinkname
      })
    );
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    let hasSubTable = false;
    if (res.data.length) {
      hasSubTable = true;
      res.data.forEach(item => {
        item.resid = item.ResID;
        item.resName = item.ResName;
      });
    }
    this.setState({ hasSubTable, subTables: res.data });
  };

  handleSelectedMenuItem = menuItem => {
    this.setState({ openedTabs: [...this.state.opendedTabs, menuItem] });
  };

  handleRowClick = record => {
    this.setState({ selectedRecord: record });
  };

  render() {
    const { loading, subTables, selectedRecord } = this.state;
    const { resid, dblinkname, baseURL, downloadBaseURL } = this.props;
    return (
      <Spin spinning={loading}>
        <div className="bm-content">
          <div className="bm-content__main-table">
            <TableData
              resid={resid}
              dataMode="main"
              subtractH={190}
              height={520}
              onRowClick={this.handleRowClick}
              hasBeBtns
              baseURL={baseURL}
              dblinkname={dblinkname}
              downloadBaseURL={downloadBaseURL}
            />
          </div>
          {!!subTables.length && (
            <div className="bm-content__sub-table">
              <Tabs>
                {subTables.map(subTable => (
                  <TabPane tab={subTable.resName} key={subTable.resid}>
                    {selectedRecord && selectedRecord ? (
                      <TableData
                        resid={resid}
                        subresid={parseInt(subTable.resid, 10)}
                        dataMode="sub"
                        hostrecid={selectedRecord.REC_ID}
                        subtractH={190}
                        height={520}
                        hasBeBtns
                        baseURL={baseURL}
                        downloadBaseURL={downloadBaseURL}
                        dblinkname={dblinkname}
                      />
                    ) : (
                      <div
                        style={{
                          height: 200,
                          lineHeight: '200px',
                          textAlign: 'center'
                        }}
                      >
                        请选择一条记录
                      </div>
                    )}
                  </TabPane>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </Spin>
    );
  }
}

export default BMContent;
