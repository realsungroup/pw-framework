import React from 'react';
import { Modal } from 'antd';
import { TableData } from 'Common/loadableCommon';
import qs from 'qs';
import emptyImg from '../assets/boxemp.png';

class WaitingHandle extends React.Component {
  state = {
    modalVisible: false,
    remindData: {},
    baseURL: undefined
  };
  closeModal = () => this.setState({ modalVisible: false });
  openModal = () => this.setState({ modalVisible: true });
  render() {
    const { data, reminderDataConfig, onItemClick } = this.props;
    const { modalVisible, remindData, baseURL } = this.state;
    return (
      <div className="new-home__waiting-handle-list">
        {data.map(data => {
          return (
            <div
              className="new-home__waiting-handle-item"
              key={data.REMINDER_TITLE}
              onClick={() => {
                if (data.REMINDER_LINKTYPE == 0) {
                  const config = reminderDataConfig.find(config => {
                    return config.dblinkname === data.dblinkname;
                  });
                  console.log(config.baseurl);
                  this.setState({
                    remindData: data,
                    modalVisible: true,
                    baseURL: config.baseurl
                  });
                } else if (data.REMINDER_LINKTYPE == 1) {
                  const qsObj = qs.parse(data.REMINDER_LINKURL.split('?')[1]);
                  onItemClick(qsObj.resid, data.REMINDER_LINKURL);
                }
              }}
            >
              <div>{data.REMINDER_TITLE}</div>
              <div>{data.REMINDER_TASKNUM}</div>
            </div>
          );
        })}
        {data.length === 0 && (
          <div className="new-home__waiting-handle-empty">
            <img src={emptyImg} />
            <p className="new-home__waiting-handle-empty-tip">暂无待办事项</p>
          </div>
        )}
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
              baseURL={baseURL}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default WaitingHandle;
