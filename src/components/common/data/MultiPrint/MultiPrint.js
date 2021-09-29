import React from 'react';
import './MultiPrint.less';
import { message, Button } from 'antd';
import { TableData } from '../../loadableCommon';

/*
 *  批量打印数据
 */
class MultiPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPage: false,
      pages: []
    };
    const Module = props.module;
    this.renderPages = this.renderPages.bind(this);
  }
  handlePrint = () => {
    // 打印
    const newEle = this.refs.toPrint.innerHTML;
    var oldstr = document.body.innerHTML; //保存当前页面
    document.body.innerHTML =
      '<style>@page { size: auto;margin: 0mm;}</style>' + newEle; //把当前页面内容替换为要打印的内容
    window.print();
    window.location.reload();
  };
  //渲染打印页面
  renderPages = (dataSource, selectedRowKeys, single) => {
    let _this = this;
    if (single) {
      let Reldata = [dataSource];
      _this.setState({ pages: Reldata, showPage: true });
      let t = setInterval(function() {
        if (_this.refs.toPrint.innerHTML.length > 0) {
          clearInterval(t);
          _this.handlePrint();
        }
      }, 500);
    } else {
      if (selectedRowKeys.length < 1) {
        message.error('请先选择要打印的记录！');
      } else {
        let data = dataSource;
        let Reldata = [];
        data.map(item => {
          selectedRowKeys.map(items => {
            if (item.REC_ID === items) {
              Reldata.push(item);
            }
          });
        });
        _this.setState({ pages: Reldata, showPage: true });
        let t = setInterval(function() {
          if (_this.refs.toPrint.innerHTML.length > 0) {
            clearInterval(t);
            _this.handlePrint();
          }
        }, 500);
      }
    }
  };
  render() {
    return (
      <div className="multiPrint">
        <TableData
          resid={this.props.resid}
          baseURL={this.props.baseURL}
          cmswhere={this.props.cmswhere}
          downloadBaseURL={this.props.downloadBaseURL}
          subtractH={240}
          hasBeBtns={true}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={this.props.single ? false : true}
          actionBarExtra={({ dataSource, selectedRowKeys }) => {
            return this.props.single ? null : (
              <Button
                onClick={() => {
                  this.renderPages(dataSource, selectedRowKeys);
                }}
              >
                打印
              </Button>
            );
          }}
          customRowBtns={
            this.props.single
              ? [
                  (record, btnSize) => {
                    return (
                      <Button
                        onClick={() => {
                          this.renderPages(record, null, true);
                        }}
                      >
                        打印
                      </Button>
                    );
                  }
                ]
              : null
          }
        />
        <div
          className="beforePrint"
          ref="toPrint"
          style={this.state.showPage ? {} : { display: 'none' }}
        >
          {this.state.pages.map(item => {
            return this.props.children(item);
          })}
        </div>
      </div>
    );
  }
}

export default MultiPrint;
