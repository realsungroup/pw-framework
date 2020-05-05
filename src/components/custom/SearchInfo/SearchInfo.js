import React from 'react';
import TableData from 'Common/data/TableData';
import './SearchInfo.less';
import http from '../../../util20/api';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import { LzModal } from '../loadableCustom';
import RecordInput from '../RecordInput';
import { infoTableReverseMap } from '../const';
import { Header } from '../loadableCustom';

class SearchInfo extends React.Component {
  state = {
    modalVisible: false,
    selectKey: '',
    record: null,
  };

  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key='查看数据录入'
          size={size}
          onClick={() => this.handleClick(record)}
        >
          查看数据录入
        </Button>
      );
    },
  ];

  handleClick = (record) => {
    const { tableNo } = record;
    this.setState({
      record,
      modalVisible: true,
      selectKey: infoTableReverseMap[tableNo],
    });
  };

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { modalVisible, record, selectKey } = this.state;
    return (
      <div className='search-info'>
        <Header />
        <TableData
          resid={641929823174}
          subtractH={170}
          actionBarFixed={true}
          height={500}
          // size='small'
          actionBarWidth={490}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasRowDelete={false}
          hasRowModify={false}
          hasRowView={false}
          hasBeBtns={false}
          customRowBtns={this.customRowBtns}
          actionBarWidth={320}
        />
        {modalVisible && (
          <LzModal defaultScaleStatus='max' onClose={this.handleModalClose}>
            <RecordInput {...record} selectKey={selectKey} mode='view' />
          </LzModal>
        )}
      </div>
    );
  }
}

export default withRouter(SearchInfo);
