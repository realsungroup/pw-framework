import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message, Input, Row, Col } from 'antd';
import http from 'Util20/api';
import './ShVisit.less';
import { Link } from 'react-router-dom';
const labels = [
  [
    { labelName: '来访事由：', labelId: '' },
    { labelName: '来访人数：', labelId: '' },
    { labelName: '接待人：', labelId: '' }
  ],
  [
    { labelName: '有效开始时间：', labelId: '', type: 'date' },
    { labelName: '有效结束时间：', labelId: '', type: 'date' }
  ],
  [
    { labelName: '申请人分机号：', labelId: '' },
    { labelName: '申请人手机号：', labelId: '' }
  ]
];
/**
 * 考试安排
 */
export default class ShVisit extends Component {
  state = { visible: false, record: '' };
  showModal = () => {
    this.setState({ visible: true });
  };
  render() {
    return (
      <div className="table-data-wrap" style={{ height: '100vh' }}>
        <Button
          onClick={() => {
            this.showModal();
          }}
        >
          申请普通访客
        </Button>
        <Button
          onClick={() => {
            this.showModal();
          }}
        >
          申请VIP访客
        </Button>
        <Modal
          visible={this.state.visible}
          width={'80vw'}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <div className="formfield">
            {labels.map(item => {
              return (
                <Row style={{ marginBottom: 16 }}>
                  {item.map(item2 => {
                    return (
                      <Col span={8}>
                        <label>{item2.labelName}</label>
                        <Input
                          type={item2.type ? item2.type : ''}
                          style={{ width: '240px' }}
                        />
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </div>
        </Modal>
      </div>
    );
  }
}
