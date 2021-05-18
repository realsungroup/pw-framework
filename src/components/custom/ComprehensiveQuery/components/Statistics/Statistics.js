import React from 'react';
import './Statistics.less';
import { DatePicker, Table, Button } from 'antd';
import ExportJsonExcel from 'js-export-excel';

const { RangePicker } = DatePicker
class Statistics extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scrollHeight: 520,
			data: [{
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			}, {
				number: 123,
				name: '阿道夫',
				startDate: '2021-05-20',
				endDate: '2021-05-20',
				hours: 1
			},
			]
		};
	}

	columns = [
		{
			title: '工号',
			dataIndex: 'number',
			key: 'number',
			width: 100,
		},
		{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			width: 100,
		},
		{
			title: '开始日期',
			dataIndex: 'startDate',
			key: 'startDate',
			width: 100,
		},
		{
			title: '结束日期',
			dataIndex: 'endDate',
			key: 'endDate',
			width: 100,
		},
		{
			title: '超时小时',
			dataIndex: 'hours',
			key: 'hours',
			width: 100,
		},
	]
	componentDidMount() {
		this.setState({
			scrollHeight: this.tableRef.offsetHeight - 38 - 24 - 56
		})
	}
	handleDownloadExcel = async () => {
		var option = {};
		const { data } = this.state;
		const exportData = data

		option.fileName = '年假账户明细';
		option.datas = [
			{
				sheetData: exportData,
				sheetName: '年假账户明细',
				sheetHeader: [
					'工号',
					'姓名',
					'开始日期',
					'结束日期',
					'超时小时'
				]
			}
		];
		var toExcel = new ExportJsonExcel(option);
		toExcel.saveExcel();
	};
	render() {
		const { scrollHeight, data } = this.state;
		return (
			<div ref={(ref) => { this.tableRef = ref }}
				className="cq-statistics">
				<div>
					<RangePicker size="small" style={{ width: 450, marginRight: 8 }} />
					<Button onClick={this.handleDownloadExcel} size="small">导出</Button>
				</div>
				<Table
					className="cq-statistics__table"
					columns={this.columns}
					dataSource={data}
					bordered
					size="small"
					pagination={{ pageSize: 40, size: "small" }}
					loading={false}
					scroll={{ y: scrollHeight }}
				/>
			</div>
		);
	}
}

export default Statistics;
