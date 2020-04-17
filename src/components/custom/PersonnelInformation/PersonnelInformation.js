import React from 'react';
import { Tabs, Button } from 'antd';
import PersonRelationship from '../OrgCharts/PersonRelationship';
function tableToExcel() {
  //要导出的json数据
  const jsonData = [
    {
      name: '路人甲',
      phone: '123456789',
      email: '000@123456.com'
    },
    {
      name: '炮灰乙',
      phone: '123456789',
      email: '000@123456.com'
    },
    {
      name: '土匪丙',
      phone: '123456789',
      email: '000@123456.com'
    },
    {
      name: '流氓丁',
      phone: '123456789',
      email: '000@123456.com'
    }
  ];
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
  let str = `姓名,电话,邮箱\n`;
  //增加\t为了不让表格显示科学计数法或者其他格式
  for (let i = 0; i < jsonData.length; i++) {
    for (let item in jsonData[i]) {
      str += `${jsonData[i][item] + '\t'},`;
    }
    str += '\n';
  }
  //encodeURIComponent解决中文乱码
  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement('a');
  link.href = uri;
  //对下载的文件命名
  link.download = 'json数据表.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/**
 * 人事信息
 */
const { TabPane } = Tabs;
class PersonnelInformation extends React.Component {
  render() {
    const { role } = this.props;
    return (
      <div className="" style={{ height: '100vh', background: '#fff' }}>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="人事基本信息">
            <Button
              onClick={() => {
                tableToExcel();
              }}
            >
              导出
            </Button>
          </TabPane>
          <TabPane
            key="2"
            tab="汇报关系"
            style={{ height: 'calc(100vh - 60px)' }}
          >
            <PersonRelationship
              resid="639856535460"
              idField="C3_305737857578" //主表id字段名
              pidField="C3_417993417686" //父节点id字段名
              level={2}
              hasOpration={false}
              displayFileds={{
                firstField: 'C3_419343735913',
                secondaryField: 'C3_227212499515',
                thirdField: 'C3_417990929081',
                imgField: 'C3_461934233303'
              }}
              procedureConfig={{
                procedure: 'pw_staffs',
                paranames: 'dates',
                paratypes: 'string'
              }}
              baseURL={baseURL}
              hasGroup={role === 'manager' ? false : true}
              hasDepartmentFilter={role === 'manager' ? false : true}
              role={role}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PersonnelInformation;
