import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';

// 导入需要开发的组件
import PwTable from 'Common/ui/PwTable';
import 'Common/data/TableData/TableData.less';

class DevPwTable extends Component {
  handleOpenRecordForm = ({ dataSource, selectedKeys, data }) => {
    console.log({ props: this.props });
    this.props.openRecordForm({
      title: '标题啊啊',
      data,
      operation: 'add',
      recordFormContainerProps: {
        placement: 'bottom',
        onClose: () => this.props.closeRecordForm()
      }
    });
  };

  render() {
    let columns = [
      {
        title: '姓名1',
        dataIndex: 'name1',
        key: 'name1',
      },
      {
        title: '姓名2',
        dataIndex: 'name2',
        key: 'name2'
      },
      {
        title: '姓名3',
        dataIndex: 'name3',
        key: 'name3'
      },
      {
        title: '姓名4',
        dataIndex: 'name4',
        key: 'name4'
      },
      {
        title: '姓名5',
        dataIndex: 'name5',
        key: 'name5'
      }
    ];

    columns = columns.map(column => {
      column.className = `pw-table__column--${column.dataIndex}`;
      return column;
    });

    const dataSource = [
      {
        name1: 'name11111',
        name2: 'name22222',
        name3: 'name33333',
        name4: 'name44444',
        name5: 'name55555'
      }
    ];

    return (
      <div style={{ height: 500, width: 400 }}>
        <PwTable
          className='table-data'
          height={200}
          columns={columns}
          pagination={{}}
          dataSource={dataSource}
          hasDownload={false}
          hasRefresh={false}
          hasAdvSearch={false}
          hasZoomInOut={false}
          headerExtra={false}
          hasSearch={false}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          scroll={{x: 'max-content'}}
        />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <DevPwTable />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
