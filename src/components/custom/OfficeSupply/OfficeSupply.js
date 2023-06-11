import React, { Component } from 'react';
import { Button, message, Input, Modal, Form, InputNumber, Tabs } from 'antd';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
import './OfficeSupply.less';

const { TabPane } = Tabs;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

const baseURL = 'http://test.pwk.web.api.realsun.biz/';
const downloadBaseURL = 'http://test.ehr.web.realsun.biz/';

const { Search } = Input;

class OfficeSupply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addSupplyModal: false,//添加申请模态窗
            chooseRecordModal: false,//选择领用人模态窗
            ischoosePeople: false,//是否是选择人员
            ischooseGood: false,//是否选择物品
            isSpecialApply: false,//是否是特殊申请
            loading: false,
            initialApplyData: null//申请单初始值
        };
    }

    componentDidMount = async () => {
        //检测当前登陆人是否存在于特殊物品申请许可表内
        const userInfo = JSON.parse(getItem('userInfo'));
        const id = userInfo.UserInfo.EMP_ID;
        try {
            let res = await http({ baseURL: baseURL }).getTable({
                resid: 677773355471,
                cmswhere: `num = '${id}'`
            })
            if (res.data[0]) {
                this.setState({
                    isSpecialApply: true
                })
            }
        } catch (error) {
            console.log(error.message);
            message.info(error.message);
        }

    }

    //关闭所有模态窗
    closeModal = () => {
        this.setState({
            addSupplyModal: false,
            initialApplyData: null,
            isModifying: false
        })
    }

    //根据选中的记录自动填写信息
    chooseRecord = (record) => {
        const { ischoosePeople, ischooseGood } = this.state;
        //领用工号和领用人
        if (ischoosePeople) {
            this.props.form.setFieldsValue({
                C3_677773884530: record.C3_677949250254,//工号
                C3_677773911110: record.C3_677949258036,//姓名
            });
            this.setState({
                ischoosePeople: false
            })
        }
        //产品标识列、产品名称和产品单位
        if (ischooseGood) {
            this.props.form.getFieldDecorator('C3_677774113236');
            this.props.form.setFieldsValue({
                C3_677773951739: record.C3_677774701674,//产品标识列
                C3_677773964880: record.C3_677774739098,//产品名称
                C3_677773985038: record.C3_677774917660,//产品单位
                C3_677774113236: record.C3_677774808604,//是否特殊物品申请
            });
            this.setState({
                ischooseGood: false
            })
        }
    }

    //修改申请单
    modifyApply = (record) => {
        console.log(record);
        this.setState({
            addSupplyModal: true,
            initialApplyData: record,
            isModifying: true
        });
    }

    //提交表单数据
    onSubmit = async () => {
        this.setState({
            loading: true
        })
        const data = this.props.form.getFieldsValue();
        const { isModifying, initialApplyData } = this.state;
        let res;
        if (data.C3_677773884530 && data.C3_677773951739 && data.C3_677773996742) {
            try {
                if (isModifying) {
                    data.REC_ID = initialApplyData.REC_ID;
                    res = await http({ baseURL: baseURL }).modifyRecords({
                        resid: 677773305405,
                        data: [data],
                        isEditOrAdd: true,
                    })
                    this.setState({
                        initialApplyData: null
                    })
                    message.success('修改成功');
                } else {
                    res = await http({ baseURL: baseURL }).addRecords({
                        resid: 677773305405,
                        data: [data]
                    })
                    message.success('提交成功');
                }
            } catch (error) {
                console.log(error.message);
                message.info(error.message);
            }
            this.closeModal();
            this.tableDataRef.handleRefresh();
        } else {
            message.error('请将申请表信息填写完整')
        }
        this.setState({
            isModifying: false,
            loading: false
        })
    }

    render() {
        const { initialApplyData, addSupplyModal, chooseRecordModal, ischoosePeople, ischooseGood, isSpecialApply } = this.state;
        const { choosePeopleResid } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="未提交" key="1">
                        <TableData
                            baseURL={baseURL}
                            downloadBaseURL={downloadBaseURL}
                            resid={677860309990}
                            hasBeBtns={true}
                            hasRowSelection={true}
                            hasAdd={false}
                            hasDelete={false}
                            hasModify={false}
                            hasRowDelete={true}
                            hasRowModify={false}
                            hasRowView={true}
                            isUseBESize={true}
                            hasBeSort={false}
                            isWrap={true}
                            style={{ height: 'calc(100vh - 60px)' }}
                            actionBarWidth={250}
                            subtractH={210}
                            wrappedComponentRef={element => (this.tableDataRef = element)}
                            refTargetComponentName="TableData"
                            customRowBtns={[
                                record => {
                                    return (
                                        <Button
                                            onClick={() => {
                                                this.modifyApply(record);
                                            }}
                                        >
                                            修改
                                        </Button>
                                    );
                                }
                            ]}
                            actionBarExtra={() => {
                                return (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            this.setState({
                                                addSupplyModal: true
                                            })
                                        }}
                                    >
                                        添加申请
                                    </Button>
                                );
                            }}
                        />
                        <Modal
                            title='申请办公用品'
                            width="70%"
                            visible={addSupplyModal}
                            onOk={() => {
                                this.onSubmit();
                            }}
                            onCancel={() => {
                                this.closeModal();
                            }}
                        >
                            <Form {...formItemLayout}>
                                <Form.Item label="领用工号">
                                    {getFieldDecorator('C3_677773884530', { initialValue: initialApplyData ? initialApplyData.C3_677773884530 : '' })(<Search placeholder="请点击搜索按钮选择"
                                        onSearch={() => {
                                            this.setState({
                                                chooseRecordModal: true,
                                                ischoosePeople: true
                                            })
                                        }} />)}
                                </Form.Item>
                                <Form.Item label="领用人">
                                    {getFieldDecorator('C3_677773911110', { initialValue: initialApplyData ? initialApplyData.C3_677773911110 : '' })(<Input disabled />)}
                                </Form.Item>
                                <Form.Item label="产品标识列">
                                    {getFieldDecorator('C3_677773951739', { initialValue: initialApplyData ? initialApplyData.C3_677773951739 : '' })(<Search placeholder="请点击搜索按钮选择"
                                        onSearch={() => {
                                            this.setState({
                                                chooseRecordModal: true,
                                                ischooseGood: true
                                            })
                                        }} />)}
                                </Form.Item>
                                <Form.Item label="产品名称">
                                    {getFieldDecorator('C3_677773964880', { initialValue: initialApplyData ? initialApplyData.C3_677773964880 : '' })(<Input disabled />)}
                                </Form.Item>
                                <Form.Item label="产品单位">
                                    {getFieldDecorator('C3_677773985038', { initialValue: initialApplyData ? initialApplyData.C3_677773985038 : '' })(<Input disabled />)}
                                </Form.Item>
                                <Form.Item label="数量">
                                    {getFieldDecorator('C3_677773996742', { initialValue: initialApplyData ? initialApplyData.C3_677773996742 : '' })(<InputNumber />)}
                                </Form.Item>
                                <Form.Item label="备注">
                                    {getFieldDecorator('C3_677774011915', { initialValue: initialApplyData ? initialApplyData.C3_677774011915 : '' })(<Input />)}
                                </Form.Item>
                            </Form>
                        </Modal>
                        <Modal
                            width="60%"
                            visible={chooseRecordModal}
                            footer={null}
                            onCancel={() => {
                                this.setState({
                                    ischooseGood: false,
                                    ischoosePeople: false,
                                    chooseRecordModal: false
                                });
                            }}
                            destroyOnClose={true}
                        >
                            <TableData
                                resid={ischoosePeople ? choosePeopleResid : ischooseGood ? isSpecialApply ? 677861437228 : 677861421582 : null}
                                baseURL={baseURL}
                                downloadBaseURL={downloadBaseURL}
                                hasRowView={false}
                                subtractH={210}
                                hasAdd={false}
                                hasRowSelection={false}
                                hasRowDelete={false}
                                hasRowModify={false}
                                hasRowView={false}
                                hasModify={false}
                                hasDelete={false}
                                actionBarWidth={150}
                                style={{ height: 500 }}
                                customRowBtns={[
                                    record => {
                                        return (
                                            <Button
                                                onClick={() => {
                                                    this.setState({ chooseRecordModal: false })
                                                    this.chooseRecord(record);
                                                }}
                                            >
                                                选择
                                            </Button>
                                        );
                                    }
                                ]}
                            />
                        </Modal>
                    </TabPane>
                    <TabPane tab="已提交" key="2">
                        <TableData
                            baseURL={baseURL}
                            donloadBaseURL={downloadBaseURL}
                            resid={677873245970}
                            baseURL={baseURL}
                            hasBeBtns={false}
                            hasRowSelection={false}
                            hasAdd={false}
                            hasDelete={false}
                            hasModify={false}
                            hasRowDelete={false}
                            hasRowModify={false}
                            hasRowView={true}
                            isUseBESize={true}
                            hasBeSort={false}
                            isWrap={true}
                            subtractH={170}
                            style={{ height: 'calc(100vh - 60px)' }}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Form.create()(OfficeSupply);
