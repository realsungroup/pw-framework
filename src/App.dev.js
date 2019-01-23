import React, { Component } from 'react';
import TableData from './common-components/components/data-components/TableData';
import { Button, message } from 'antd';
import http from './common-components/util/api';
import { setItem } from './common-components/util/util';
import './App.css';

class App extends Component {
  handleLoginClick = async () => {
    const code = 'demo1';
    const password = '66287175';

    let res;
    try {
      res = await http().login({
        Code: code,
        Password: password
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('登录成功');
    setItem('userInfo', JSON.stringify(res));
  };

  handleClearCache = async () => {
    let res;
    try {
      await http().clearCache();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('清除缓存成功');
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleLoginClick} type="primary">
          登录
        </Button>
        <Button onClick={this.handleClearCache} type="primary">
          清除缓存
        </Button>
        <div>
          <TableData
            title="调休登记"
            resid={596720928643}
            width={1360}
            size="small"
            hasBeBtns={false}
            subtractH={180}
            actionBarFixed={true}
            advSearchContainerType="drawer"
            //hasRowEdit
            hasAdd={true}
            hasDelete={false}
            hasModify={false}
            hasRowModify={true}
            hasAdvSearch={true}
            height={600}
            recordFormContainerProps={{
              // width: 800,
              height: 500,
              placement: 'bottom'
            }}
            formProps={{ displayMode: 'default', height: 400 }}
            recordFormType="drawer"
            // cmscolumns="C3_600449702200,C3_600449723545,C3_600449744490,C3_600449756846,C3_600449776309,C3_600449791836,C3_600449800714,C3_600449820713"
            recordFormName="default_rowTest"
            rowEditFormName="default_rowTest"
            // ['C3_600449702200', 'C3_600449702200']
            beforeSaveFields={[
              // 'C3_600449702200',
              'C3_600449723545',
              'C3_600449744490',
              'C3_600449756846',
              'C3_600449776309',
              'C3_600449791836',
              'C3_600449800714',
              'C3_600449820713'
            ]}
            subTableArrProps={[
              {
                subTableName: '子表',
                subResid: 596647249456,
                tableProps: {
                  height: 350
                }
              }
            ]}
            hasResizeableBox={true}
            hasZoomInOut={false}
            bordered={true}
          />
        </div>
      </div>
    );
  }
}

export default App;
