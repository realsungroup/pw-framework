import React from 'react';
import { Select, Button, Modal, Form, Input, message, DatePicker } from 'antd';
import DoorsSelect from '../DoorsSelect';
import { collectData } from '../../../collectApi';
import { getRootRegion } from '../../../hikApi';

const { RangePicker } = DatePicker;

class ManualCollectData extends React.Component {
  state = {
    indexCode: '',

    // form's fields
    tableresid: '',
    baseUrl: '',
    receiveStartTime: null,
    receiveEndTime: null,
    eventTypes: '196893',
    selectedDoors: []
  };

  columns = [
    {
      title: '门禁点',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '所在区域',
      dataIndex: 'regionPathName',
      key: 'regionPathName'
    }
  ];

  componentDidMount = async () => {
    this.setState({ loading: true });
    let res, queryDoorsRes;
    try {
      res = await getRootRegion();
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({
      indexCode: res.data.indexCode,
      loading: false
    });
  };

  handleSelectedDoorsChange = selectedDoors => {
    this.setState({ selectedDoors });
  };

  handleOk = () => {
    const { validateFields } = this.props.form;
    const { selectedDoors } = this.state;

    validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!selectedDoors.length) {
        return message.error('请选择门禁点');
      }

      this.submitData(values);
    });
  };

  handleConfirm = () => {
    const {
      tableresid,
      baseUrl,
      receiveStartTime,
      receiveEndTime,
      eventTypes,
      selectedDoors
    } = this.state;
    if (
      !tableresid ||
      !baseUrl ||
      !receiveStartTime ||
      !receiveEndTime ||
      !eventTypes ||
      !selectedDoors.length
    ) {
      return message.error('所有的都是必填项');
    }

    Modal.confirm({
      title: '再次确认',
      content: (
        <div>
          <h4>您确定按照如下配置采集刷脸数据吗？</h4>
          <div>
            <h4>刷卡目标表:</h4>
            {tableresid}
          </div>
          <div>
            <h4>目标表api地址:</h4>
            {baseUrl}
          </div>
          <div>
            <h4>数据入库时间范围:</h4>
            {receiveStartTime.format('YYYY-MM-DD HH:mm:ss')} -
            {receiveEndTime.format('YY-MM-DD HH:mm:ss')}
          </div>
          <div>
            <h4>事件类型列表:</h4>
            {eventTypes}
          </div>
          <div>
            <h4>门禁点:</h4>
            {selectedDoors.map(door => door.name).join(',')}
          </div>
        </div>
      ),
      onOk: this.handleSubmit
    });
  };

  handleSubmit = async () => {
    const {
      tableresid,
      baseUrl,
      receiveStartTime,
      receiveEndTime,
      eventTypes,
      selectedDoors
    } = this.state;

    let res;
    try {
      res = await collectData({
        tableresid,
        baseUrl,
        receiveStartTime: `${receiveStartTime.format(
          'YYYY-MM-DDTHH:mm:ss'
        )}+08:00`,
        receiveEndTime: `${receiveEndTime.format('YYYY-MM-DDTHH:mm:ss')}+08:00`,
        eventTypes: eventTypes.split(',').map(item => Number(item)),
        doorIndexCodes: selectedDoors.map(door => door.indexCode)
      });
    } catch (err) {
      return message.error(err.message);
    }

    if (res.data.records) {
      Modal.info({
        title: '操作成功',
        content: `正在采集中，采集数量：${res.data.records.length}`
      });
    }
  };

  render() {
    const { indexCode, loading, mode, selectedDoors } = this.state;

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <Form>
          <Form.Item label="刷卡目标表">
            <Input
              style={{ width: 400 }}
              value={this.state.tableresid}
              onChange={e => this.setState({ tableresid: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="目标表api地址">
            <Input
              style={{ width: 400 }}
              value={this.state.baseUrl}
              onChange={e => this.setState({ baseUrl: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="数据入库时间范围">
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              style={{ width: 400 }}
              value={[this.state.receiveStartTime, this.state.receiveEndTime]}
              onChange={dates => {
                if (dates) {
                  this.setState({
                    receiveStartTime: dates[0],
                    receiveEndTime: dates[1]
                  });
                } else {
                  this.setState({
                    receiveStartTime: null,
                    receiveEndTime: null
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item label="事件类型列表">
            <Input
              style={{ width: 400 }}
              value={this.state.eventTypes}
              onChange={e => this.setState({ eventTypes: e.target.value })}
            />
          </Form.Item>

          <h3>门禁点</h3>
          {!!indexCode && (
            <DoorsSelect
              regionIndexCodes={[indexCode]}
              onSelectedDoorsChange={this.handleSelectedDoorsChange}
              defaultSelectedDoors={mode === 'add' ? [] : selectedDoors}
            ></DoorsSelect>
          )}
        </Form>
        <div style={{ width: 1110, margin: '32px auto' }}>
          <Button
            block
            type="primary"
            onClick={this.handleConfirm}
            loading={loading}
          >
            确定
          </Button>
        </div>
      </div>
    );
  }
}

export default ManualCollectData;
