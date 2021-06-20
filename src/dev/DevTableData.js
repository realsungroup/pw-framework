import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
import '../components/common/styles/TableData.less';

// 导入需要开发的组件
import TableData from 'Common/data/TableData';
import { withRecordForm } from 'Common/hoc/withRecordForm';

class DevTableData extends Component {
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
    return (
      <div style={{ height: 400 }}>
        <TableData
          resid="609868074490"
          baseURL="http://powerworks.realsun.me:5051/"
          // fixedColumns={['工号']}
          // columnMaxWidth={{
          //   C3_609868116494: 200
          // }}
          // columnMaxWidth={200}
          isUseBESize={true}
          isWrap={false}
          // height={400}
        />
        {/* <TableData
          resid="609868074490"
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          hasRowModify={true}
          hasRowDelete={true}
          hasRowView={true}
          height={600}
          subtractH={220}
          hasBeBtns={false}
          isUseFormDefine={false}
          hasAdd
          hasRowEdit
          hasRowEditAdd={true}
          actionBarFixed={false}
          rowEditAddPosition="end"
          rowColorConfig={{ position: 'text' }}
          successMessageComponent="Modal"
          isSetColumnWidth={false}
          // cmscolumns="C3_609868116494"
          // rowColorRules={rowColorRules}
          // recordFormName="default3i"
        /> */}
        {/* <TableData
          hasRowSelection={false}
          refTargetComponentName="TableData"
          wrappedComponentRef={element => (this.tableDataRef = element)}
          advSearch={{
            searchComponent: [
              {
                title: '搜索1',
                name: 'PwForm',
                order: 2
              },
              {
                title: '搜索2',
                name: 'AdvSearch',
                order: 1
              }
            ],
            containerType: 'drawer',
            formName: 'default',
            validationFields: [],
            isUseTableFields: true,
            fields: [
              { label: '姓名', value: 'name', control: 'Input' },
              { label: '年龄', value: 'age', control: 'Input' }
            ]
          }}
          actionBarWidth={300}
          title="调休登记"
          resid={611835781753}
          // width={1360}
          size="small"
          hasBeBtns={true}
          subtractH={200}
          actionBarFixed={true}
          advSearchContainerType="drawer"
          hasRowEdit
          hasAdd={true}
          hasDelete={true}
          hasModify={true}
          hasRowModify={true}
          hasAdvSearch={true}
          // height={400}
          recordFormContainerProps={{
            // width: 800,
            height: 500,
            placement: 'right'
          }}
          formProps={{ displayMode: 'default', height: 400 }}
          // recordFormType="drawer"
          // cmscolumns="C3_600449702200,C3_600449723545,C3_600449744490,C3_600449756846,C3_600449776309,C3_600449791836,C3_600449800714,C3_600449820713"
          recordFormName="default"
          rowEditFormName="default"
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
          addText="添加基本信息"
          enAddText="add base info"
          rowModifyText="修改基本信息"
          enRowModifyText="modify base info"
          actionBarExtra={params => (
            <button onClick={() => this.handleOpenRecordForm(params)}>
              添加
            </button>
          )}
          hasRefresh
          headerExtra={
            <button onClick={() => console.log('批量添加')}>批量添加</button>
          }
          hasImport
          importConfig={{
            mode: 'fe',
            saveState: 'added',
            containerType: 'drawer'
          }}
          dblinkname="me"
        /> */}
      </div>
    );
  }
}

const DevTableDataWrap = withRecordForm()(DevTableData);

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <DevTableDataWrap />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
