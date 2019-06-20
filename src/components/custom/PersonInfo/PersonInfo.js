import React from 'react';
import './PersonInfo.less';
import TableData from '../../common/data/TableData';
import { Tabs, Select } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;
class PersonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="工作申请表">
          <TabPane tab="工作申请表" key="工作申请表">
            {/* <div className="idlindex__applayBox">
              <ApplayInformnation
                hasSubmit={true}
                initialValue={currentPersonInfo}
              />
            </div> */}
            个人申请表
          </TabPane>
          <TabPane tab="面试评估表" key="面试评估表">
            {/* <TableData
              {...assementForm}
              subtractH={210}
              hasModify={false}
              hasAdd={false}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              hasRowSelection={false}
              hasBeBtns={true}
              actionBarExtra={() => {
                return (
                  <Button
                    onClick={() => {
                      this.addFormCategory('accessment');
                    }}
                  >
                    添加
                  </Button>
                );
              }}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button
                      onClick={() => {
                        this.getFormData(record);
                      }}
                    >
                      弹出不同窗体
                    </Button>
                  );
                }
              ]}
            /> */}
            面试评估表
          </TabPane>
          <TabPane tab="背景调查表" key="背景调查表">
            {/* <TableData
              resid={613152614705}
              height={500}
              hasAdd={false}
              displayMode="classify"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              actionBarExtra={() => {
                return (
                  <Button
                    onClick={() => {
                      this.addFormCategory('reference');
                    }}
                  >
                    添加
                  </Button>
                );
              }}
            /> */}
            背景调查表
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PersonInfo;
