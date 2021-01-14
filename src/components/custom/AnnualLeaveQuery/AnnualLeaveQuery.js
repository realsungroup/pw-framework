import React from 'react';
import { Tabs, message, Select, Table, DatePicker, Modal, Icon, Button } from 'antd';
import './AnnualLeaveQuery.less';
import { getItem } from 'Util20/util';
import http from 'Util20/api';
import TableData from 'Common/data/TableData';
import memoize from 'memoize-one';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

class AnnualLeaveQuery extends React.Component {

	constructor(props) {
		super(props);
		const userInfoJson = JSON.parse(getItem('userInfo'));
		this.state = {
			UserCode: userInfoJson.UserCode,
			UserName: userInfoJson.Data
		}
	}

	render() {
		const { 员工年假季度账户表, 员工年假使用明细表, baseURL } = this.props;
		const { UserCode } = this.state;
		return <div className="page-annual-leave-query">
			<Tabs >
				<TabPane tab="账户明细" key="1">
					<Summary baseURL={baseURL} subResid={员工年假使用明细表} resid={员工年假季度账户表} userCode={UserCode} />
				</TabPane>
				<TabPane tab="使用明细" key="2">
					<Detail baseURL={baseURL} resid={员工年假使用明细表} userCode={UserCode} />
				</TabPane>
			</Tabs>
		</div>
	}
}

export default AnnualLeaveQuery;

const quarters = [{ title: '第1季度', value: 1 }, { title: '第2季度', value: 2 }, { title: '第3季度', value: 3 }, { title: '第4季度', value: 4 }]
const styles = {
	selectStyle: {
		width: 120,
		margin: '0 4px'
	}
}
// 输出base64编码
const base64 = s => window.btoa(unescape(encodeURIComponent(s)));
const tableToExcel = (str) => {
	// Worksheet名
	const worksheet = '员工年假'
	const uri = 'data:application/vnd.ms-excel;base64,';

	// 下载的表格模板数据
	const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
	xmlns:x="urn:schemas-microsoft-com:office:excel" 
	xmlns="http://www.w3.org/TR/REC-html40">
	<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
	<x:Name>${worksheet}</x:Name>
	<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
	</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
	</head><body><table>${str}</table></body></html>`;
	// 下载模板
	window.location.href = uri + base64(template);
};
class Summary extends React.PureComponent {
	state = {
		allAnnualLeaveQuery: [],//全部年假数据
		years: [],//员工从入职到当前的年份
		startYear: undefined,
		startQuarter: 1,
		endYear: undefined,
		endQuarter: 4,
		subTableModalVisible: false,
		usesubTableModalVisible: false,
		applyRecordsModalVisible: false,
		selectedRecord: {},
		selectedSubRecord: {}
	}
	columns = [
		{
			title: '年份',
			dataIndex: 'year',
			key: 'year',
			// width: 100,
		},
		{
			title: '季度',
			dataIndex: 'quarter',
			key: 'quarter',
			// width: 100,
		},
		{
			title: '合计可用年假',
			dataIndex: 'hjky',
			key: 'hjky',
			// width: 120,
		},
		{
			title: '剩余可用年假',
			dataIndex: 'synj',
			key: 'synj',
			// width: 120,
		},
		{
			title: '累积申请',
			dataIndex: 'ljsq',
			key: 'ljsq',
			// width: 120,
		},
		{
			title: '当季分配年假天数',
			children: [
				{
					title: '已用',
					dataIndex: 'sydjfp',
					key: 'sydjfp',
				},
				{
					title: '未用',
					dataIndex: 'djfp',
					key: 'djfp',
				},
				{
					title: '合计',
					dataIndex: 'djhj',
					key: 'djhj',
				},
			],
		},
		{
			title: '往季分配年假天数',
			children: [
				{
					title: '已用',
					dataIndex: 'ljsysjsy',
					key: 'ljsysjsy',
				},
				{
					title: '未用',
					dataIndex: 'sjsy',
					key: 'sjsy',
				},
				{
					title: '合计',
					dataIndex: 'wjhj',
					key: 'wjhj',
				},
			],
		},
		{
			title: '往年分配年假天数',
			children: [
				{
					title: '已用',
					dataIndex: 'ljsysnsy',
					key: 'ljsysnsy',
				},
				{
					title: '未用',
					dataIndex: 'snsy',
					key: 'snsy',
				},
				{
					title: '合计',
					dataIndex: 'wnhj',
					key: 'wnhj',
				},
			],
		},
		{
			title: '是否结算',
			dataIndex: 'SendBack',
			key: 'SendBack',
			// width: 100,
		},
		{
			title: '操作',
			key: 'action',
			render: (text, record) => (
				<>
					<span className="table-action--view" onClick={() => {
						this.setState({ selectedRecord: record, usesubTableModalVisible: true })
					}}>
						使用明细
					</span>
					<span className="table-action--view" onClick={() => {
						this.setState({ selectedRecord: record, subTableModalVisible: true })
					}}>
						交易明细
				</span>
				</>
			),
		},
	];
	componentDidMount() {
		this.fetchAnnualLeaves();
	}
	fetchAnnualLeaves = async () => {
		const { resid, userCode, baseURL } = this.props
		try {
			const res = await http({ baseURL }).getTable({
				resid,
				cmswhere: `numberID = '${userCode}'`
			})
			const yearSet = new Set();
			res.data.forEach(item => {
				item.sydjfp = item.sydjfp || 0;
				item.djhj = item.sydjfp + item.djfp; //当季合计

				item.ljsysjsy = item.ljsysjsy || 0;
				item.wjhj = item.ljsysjsy + item.sjsy; //往季合计

				item.ljsysnsy = item.ljsysnsy || 0;
				item.wnhj = item.ljsysnsy + item.snsy; //往年合计
				yearSet.add(item.year);
			});
			const years = [...yearSet];
			this.setState({
				allAnnualLeaveQuery: res.data,
				years,
				startYear: years[0],
				endYear: years[0]
			})
		} catch (error) {
			console.error(error)
			message.error(error.message)
		}
	}

	calcAnnualLeaves = memoize((startYear, startQuarter, endYear, endQuarter, allAnnualLeaveQuery = []) => {
		return allAnnualLeaveQuery.filter((item) => {
			return item.year >= startYear && item.quarter >= startQuarter && item.year <= endYear && item.quarter <= endQuarter
		})
	})

	render() {
		const { selectedSubRecord, applyRecordsModalVisible, usesubTableModalVisible, selectedRecord, allAnnualLeaveQuery, years, startQuarter, startYear, endQuarter, endYear, subTableModalVisible } = this.state;
		const { subResid, resid, baseURL } = this.props
		const annualLeaves = this.calcAnnualLeaves(startYear, startQuarter, endYear, endQuarter, allAnnualLeaveQuery);
		return <div className="alq-summary">
			<header className="alq-summary__header">
				<div>
					从
					<Select
						onChange={(value) => {
							this.setState({
								startYear: value
							})
						}}
						value={startYear}
						size="small"
						style={styles.selectStyle}
					>
						{years.map(item => {
							return <Option value={item}>{item}</Option>
						})}
					</Select>
					<Select
						onChange={(value) => {
							this.setState({
								startQuarter: value
							})
						}}
						value={startQuarter}
						size="small"
						style={styles.selectStyle}
					>
						{quarters.map(item => {
							return <Option value={item.value}>{item.title}</Option>
						})}
					</Select>
						至
					<Select
						onChange={(value) => {
							this.setState({
								endYear: value
							})
						}}
						value={endYear}
						size="small"
						style={styles.selectStyle}
					>
						{years.map(item => {
							return <Option value={item}>{item}</Option>
						})}
					</Select>
					<Select
						onChange={(value) => {
							this.setState({
								endQuarter: value
							})
						}}
						value={endQuarter}
						size="small"
						style={styles.selectStyle}
					>
						{quarters.map(item => {
							return <Option value={item.value}>{item.title}</Option>
						})}
					</Select>

					<Button
						icon="download"
						size="small"
						onClick={() => {
							tableToExcel(document.querySelector('.annual-leave .ant-table-body').innerHTML)
						}}>下载</Button>
				</div>
				<Icon onClick={() => {
					Modal.info({
						title: '提示',
						content: '1.在每个季度（或者年）的第一天，上个季度（或者年）剩余的年假将会被结算至当前季度。'
					})
				}} type="question-circle" style={{ color: '#1890ff' }} />
			</header>
			<div>
				<Table
					className="annual-leave"
					columns={this.columns}
					dataSource={annualLeaves}
					bordered
					size="small"
					pagination={false}
				// scroll={{ x: 'calc(700px + 50%)', y: 240 }}
				/>
			</div>
			<Modal
				title="年假月度使用情况"
				visible={usesubTableModalVisible}
				footer={null}
				width="80vw"
				onCancel={() => {
					this.setState({ usesubTableModalVisible: false })
				}}>
				<TableData
					key={selectedRecord.REC_ID}
					dataMode="sub"
					resid={resid}
					subresid={'662737017622'}
					hostrecid={selectedRecord.REC_ID}
					baseURL={baseURL}
					subtractH={200}
					hasAdd={false}
					hasModify={false}
					hasDelete={false}
					hasRowEdit={false}
					hasRowModify={false}
					hasRowView={true}
					hasRowDelete={false}
					actionBarWidth={100}
					height={500}
					customRowBtns={[
						(record, btnSize) => {
							return <Button onClick={() => { this.setState({ selectedSubRecord: record, applyRecordsModalVisible: true }) }} size={btnSize}>申请记录</Button>
						},
					]}
				/>
			</Modal>
			<Modal
				title="申请记录"
				visible={applyRecordsModalVisible}
				footer={null}
				width="70vw"
				onCancel={() => {
					this.setState({ applyRecordsModalVisible: false })
				}}>
				<TableData
					key={selectedSubRecord.REC_ID}
					dataMode="sub"
					resid={resid}
					subresid={'662737017622'}
					hostrecid={selectedSubRecord.REC_ID}
					baseURL={baseURL}
					subtractH={200}
					hasAdd={false}
					hasModify={false}
					hasDelete={false}
					hasRowEdit={false}
					hasRowModify={false}
					hasRowView={true}
					hasRowDelete={false}
					actionBarWidth={100}
					height={500}
				/>
			</Modal>
			<Modal
				title="年假交易明细"
				visible={subTableModalVisible}
				footer={null}
				width="80vw"
				onCancel={() => {
					this.setState({ subTableModalVisible: false })
				}}>
				<TableData
					key={selectedRecord.REC_ID}
					dataMode="sub"
					resid={resid}
					subresid={subResid}
					hostrecid={selectedRecord.REC_ID}
					baseURL={baseURL}
					subtractH={200}
					hasAdd={false}
					hasModify={false}
					hasDelete={false}
					hasRowEdit={false}
					hasRowModify={false}
					hasRowView={true}
					hasRowDelete={false}
					actionBarWidth={100}
					height={500}
				/>
			</Modal>
		</div>
	}
}

class Detail extends React.PureComponent {
	state = {
		startDate: '',
		endDate: '',
		cmswhere: ''
	}
	render() {
		const { resid, baseURL, userCode } = this.props;
		const { cmswhere } = this.state;
		return <div className="alq-detail">
			<div className="alq-detail__header">
				假期开始时间的范围:<RangePicker style={{ marginLeft: 8 }} size="small" onChange={(dates, dateString) => {
					console.log(dates, dateString);
					let cmswhere = this.state.cmswhere;
					if (dateString[0] && dateString[1]) {
						cmswhere = ` and startBreak >= '${dateString[0]}' and startBreak <= '${dateString[1]}'`
					} else {
						cmswhere = ''
					}
					this.setState({
						cmswhere
					})
				}}></RangePicker>
			</div>
			<div>
				<TableData
					resid={resid}
					baseURL={baseURL}
					subtractH={200}
					hasAdd={false}
					hasModify={false}
					hasDelete={false}
					hasRowEdit={false}
					hasRowModify={false}
					hasRowView={true}
					hasRowDelete={false}
					actionBarWidth={100}
					height={500}
					cmswhere={`numberID = '${userCode}' ${cmswhere}`}
				/>
			</div>
		</div>
	}
}