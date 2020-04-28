import React from 'react';
import { Modal } from 'antd';
import { TableData } from 'Common/loadableCommon';
import qs from 'qs';

class WaitingHandle extends React.Component {
  state = {
    modalVisible: false,
    remindData: {}
  };
  closeModal = () => this.setState({ modalVisible: false });
  openModal = () => this.setState({ modalVisible: true });
  render() {
    const { data } = this.props;
    const { modalVisible, remindData } = this.state;
    return (
      <div className="new-home__waiting-handle-list">
        {data.map(data => {
          return (
            <div
              className="new-home__waiting-handle-item"
              key={data.REMINDER_TITLE}
              onClick={() => {
                if (data.REMINDER_LINKTYPE == 0) {
                  this.setState({
                    remindData: data,
                    modalVisible: true
                  });
                } else if (data.REMINDER_LINKTYPE == 1) {
                  const qsObj = qs.parse(data.REMINDER_LINKURL.split('?')[1]);
                  this.props.onItemClick(qsObj.resid, data.REMINDER_LINKURL);
                }
              }}
            >
              <div>{data.REMINDER_TITLE}</div>

              <div>{data.REMINDER_TASKNUM}</div>
            </div>
          );
        })}
        <Modal
          visible={modalVisible}
          onCancel={this.closeModal}
          onOk={this.closeModal}
          width="90vw"
          title={remindData.REMINDER_TITLE}
        >
          <div>
            <TableData
              resid={remindData.REMINDER_RESID}
              key={remindData.REMINDER_RESID}
              size="small"
              subtractH={180}
              height={600}
              hasResizeableBox
              hasAdd={false}
              hasModify={false}
              hasBeBtns={true}
              lngMtsID={remindData.REMINDER_MTSID}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default WaitingHandle;
