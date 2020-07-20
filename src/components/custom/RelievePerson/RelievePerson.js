import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin, Modal, Input } from 'antd';
import http from 'Util20/api';
import LzTable from '../../../lib/unit-component/LzTable';
// import TableData from '../../common/data/TableData'

/**
 * 奖惩-符合解除人员
 */
class RelievePerson extends React.Component {
  constructor(props){
    super(props)
    this.baseURL =
    window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03BaseURL;
    this.downloadURL =
    window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03DownloadBaseURL;
  }

  state = {
    loading: false,
    deleteReason: '',
    sendBackReason: null
  };
 
  handleConfirm = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619907534: 'Y'
    }));

    let res;
    try {
      res = await http(this.baseURL).modifyRecords({
        resid,
        data
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('操作成功');
    this.tableDataRef.handleRefresh();
  };
  handleDownMaterial = url => {
    if (!url) {
      return Modal.warning({
        title: '您还未上传过资料'
      });
    }
    const urls = url.split(';file;');
    for (let i = 0, len = urls.length; i < len; i++) {
      const obj = JSON.parse(urls[i]);
      window.open(obj.url);
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: '100vh' }}>
         <TableData
            {...this.props}
            resid="614709186509"
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            hasRowModify={false}
            hasRowDelete={false}
            subtractH={220}
            hasAdvSearch={true}
            advSearch={{
              searchComponent: 'both',
              containerType: 'drawer',
              formName: 'default3i',
              containerProps: 'default3i'
            }}
            customRowBtns={[
              record => {
                return (
                  <Button
                    onClick={() => {
                      this.handleDownMaterial(
                        record.C3_590515131157 || record.C3_590516276367
                      );
                    }}
                  >
                    下载查阅
                  </Button>
                );
              }
            ]}
          /> 
          {/* <LzTable
          resid = '614709186509'
    isSearch ={false}
    formsName = 'default3i'
    hasDownloadExcel= {true}
    cFFillFormInnerFieldNames= 'C3_590510737521'
    addBtn= {{
      type: 'text',
      text: '录入'
    }}
    btnsVisible= {{
      check : true,
      mod: false,
      del: true,
      edit: false,
      save: false,
      cancel: false
    }
    }
    pagination= {{
      pageSize: 10,
      current: 0}
    }
    opIsFixed= {true}
    tableTitle= '统计分析'
    showHeader= {true}
    displayMod= 'classify'
    hasOpenUnitBtn= {true}
    lzAdvSearchStyle= {{
      background: '#e5e9ed',
      borderRadius: '4px',
      border: '1px solid #e5e9ed'
    }
    }
    advSearchConfig= {{
      defaultVisible: false,
      containerName: 'drawer',
      drawerWidth: 550,
      labelWidth: '24%',
      rowWidth: '100%',
      dateRanges: [
        {
          title: '违纪日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_590511645885' // 内部字段
        },
        {
          title: '确认审批的日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_591363529469' // 内部字段
        }
      ],
      tag: [
        {
          title: '合同类别',
          op: 'or',
          tags: [
            {
              label: 'SH',
              value: 'SH',
              isSelected: false,
              innerFieldName: 'C3_590686786388'
            },
            {
              label: 'WX',
              value: 'WX',
              isSelected: false,
              innerFieldName: 'C3_590686786388'
            }
          ]
        },
        {
          title: '违纪类别',
          op: 'or',
          tags: [
            {
              label: '绩效处分',
              value: '绩效处分',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            },
            {
              label: '警告',
              value: '警告',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            },
            {
              label: '较重警告',
              value: '较重警告',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            },
            {
              label: '严重警告',
              value: '严重警告',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            }
          ]
        },
        {
          title: '到期撤销',
          op: 'or',
          tags: [
            {
              label: '是',
              value: 'Y',
              isSelected: false,
              innerFieldName: 'C3_591373611399'
            },
            {
              label: '否',
              value: 'N',
              isSelected: false,
              innerFieldName: 'C3_591373611399'
            }
          ]
        }
      ],
      search: [
        {
          title: '工号/姓名/部门',
          innerFieldNames: [
            'C3_590510737521',
            'C3_590510740042',
            'C3_590510763625'
          ]
        },
        {
          title: '惩处依据',
          innerFieldNames: ['C3_590511744313']
        },
        {
          title: '职级',
          innerFieldNames: ['C3_590512134594']
        },
        {
          title: '一级部门',
          innerFieldNames: ['C3_590516541218']
        },
        {
          title: '二级部门',
          innerFieldNames: ['C3_590516558243']
        },
        {
          title: '三级部门',
          innerFieldNames: ['C3_590516572216']
        }
      ]
    }
    }
/> */}
        </div>
      </Spin>
    );
  }
}

export default RelievePerson;
