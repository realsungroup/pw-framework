import React, { Component } from 'react';
import { Button, message, Table, Progress, Empty } from 'antd';
import './TotalStatical.less';
import http from 'Util20/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts

const isChrome = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf('chrome') !== -1;
};
const dataURIToBlob = (dataURI, fileName, callback) => {
  var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  callback(new Blob([arr]), fileName + '.png');
};

const callback = function(blob, fileName) {
  var a = document.createElement('a');
  a.setAttribute('download', fileName);
  a.href = URL.createObjectURL(blob);
  a.click();
};

class TotalStatical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      queryQuestions: [],
      answerData: [],
      queryQuestionsGroup: [],
      data: [],
      loadingBtnID: ''
    };
  }
  componentDidMount = () => {
    this.getQueryName(this.props.queryId);
    this.getqueryQuestions(this.props.queryId);
    this.getAmountOfqesOptionAnwserGroupbyperson(this.props.queryId);
    // 获取该问卷的问答题
    this.getAnswerData(this.props.queryId);
  };

  columns = [
    {
      title: '选项',
      dataIndex: 'optionContent'
    },
    {
      title: '小计',
      dataIndex: 'amount',
      width: 80
    },
    {
      title: '比例',
      width: 200,
      dataIndex: 'percentage',
      render: (value, record, index) => {
        if (record.optionContent === '本题有效填写人次') {
          return null;
        }
        const percent = (record.amount / record.total).toFixed(2) * 100;
        return (
          <Progress
            style={{ width: '90%' }}
            percent={percent}
            format={percent => percent.toFixed(2) + '%'}
          />
        );
      }
    }
  ];

  //根据问卷ID拿到问卷的名称
  getQueryName = async id => {
    let res;
    try {
      res = await http().getTable({
        resid: 608822905547,
        cmswhere: `query_id = ${id}`
      });
    } catch (err) {
      return console.error(err.message);
    }
    this.setState({
      queryName: res.data[0].query_name
    });
  };

  //根据问卷ID 拿到该问卷的题目,再根据试题的题目去取出试题的选项。2.根据问卷的ID在问卷答题表中取出属于该问卷的试题。
  getqueryQuestions = async id => {
    let QuestionsData;
    try {
      QuestionsData = await http().getTable({
        resid: 613576714181,
        cmswhere: `query_id = ${id}`
      });
    } catch (err) {
      console.error(err.message);
      return message.error(err.message);
    }
    this.setState({
      queryQuestions: QuestionsData.data
    });
    let cmsString;
    cmsString = this.state.queryQuestions
      .map(item => {
        return item.question_id;
      })
      .join(',');
    // 根据好多条试题的ID 去查找好所有试题ID下面对应的试题选项使用到了cmswhere语句。question_id in ('','',)
    this.getOptionsTableData(cmsString);
  };
  // 613413052304 qesOptionAnwserGroupbyperson
  getAmountOfqesOptionAnwserGroupbyperson = async queryId => {
    let res;
    try {
      res = await http().getTable({
        resid: 613413052304,
        cmswhere: `query_id = ${queryId}`
      });
    } catch (err) {
      console.error(err.message);
    }
    // console.log('qesOptionAnwserGroupbyperson', res.data);
    this.setState({ queryQuestionsGroup: res.data });
  };

  // 获取问题的选项
  getOptionsTableData = async cstring => {
    let res;
    try {
      res = await http().getTable({
        resid: 611518608474,
        cmswhere: `question_id in (${cstring})`
      });
    } catch (err) {
      console.error(err.message);
    }
    // 要得到的 data
    const data = [];
    res.data.forEach((item, index) => {
      const tempDataItem = data.find(
        dataItem => item.question_topic === dataItem.title
      );
      if (!tempDataItem) {
        data.push({
          title: item.question_topic,
          question_id: item.question_id,
          table: {
            dataSource: [
              {
                optionContent: item.option_content,
                amount: item.amount
              }
            ]
          }
        });
      } else {
        tempDataItem.table.dataSource.push({
          optionContent: item.option_content,
          amount: item.amount
        });
      }
    });

    data.forEach(dataItem => {
      let total = 0;
      dataItem.table.dataSource.forEach(record => {
        total += record.amount;
      });
      dataItem.table.dataSource.forEach(record => {
        record.total = total;
      });
      const queryQuestionsGroup = this.state.queryQuestionsGroup;
      // console.log('rtamount', queryQuestionsGroup);
      const rt = queryQuestionsGroup.find(
        queryQuestionsGroupItem =>
          dataItem.question_id === queryQuestionsGroupItem.question_id
      );
      if (rt) {
        dataItem.table.dataSource.push({
          optionContent: '本题有效填写人次',
          amount: rt.amount
        });
      }
    });
    this.setState({ data });
  };
  //根据问卷ID 拿到属于该问卷问答题的数据
  getAnswerData = async id => {
    let res;
    try {
      res = await http().getTable({
        resid: 608838682402,
        cmswhere: `query_id = ${id} and question_type='问答题'`
      });
    } catch (err) {
      return message.error(err.message);
    }
    if (0 <= res.data.length) {
      const answerData = [];
      res.data.forEach(item => {
        const tempAnserdataItem = answerData.find(
          answerDataItem => item.question_id === answerDataItem.question_id
        );
        // find 找到的话返回该元素，
        // 第一次进来是个空的,空的会返回undefined false ,取反  执行if里边的东西。
        if (!tempAnserdataItem) {
          answerData.push({
            question_id: item.question_id,
            question_topic: item.question_topic,
            answers: [item]
          });
        } else {
          tempAnserdataItem.answers.push(item);
        }
      });
      this.setState({ answerData });
      // console.log('处理后问答题的数据',this.state.answerData)
    }
  };
  // 导出图片的功能
  handleExportImgBtnClick = async() => {
    const { queryName } = this.state;
    // 下载图片
    this.refs.toPrint.classList.add('printMode');
    await function download(src, name) {
      if (!src) return;
      const a = document.createElement('a');
      a.setAttribute('download', name);
      a.href = src;
      a.click();
    }
    await html2canvas(document.querySelector('.total-statical__main')).then(
      canvas => {
        const imgDataURL = canvas.toDataURL('image/png', 1.0);
        if (isChrome()) {
          // download(imgDataURL, queryName);
          console.log('谷歌');
          dataURIToBlob(imgDataURL, queryName, callback);
        } else {
          console.log('其他');
          window.open(imgDataURL);
        }
      }
    );
    
    await this.refs.toPrint.classList.remove('printMode');
  };

  // 导出pdf文件
  // hanldeExportPdf = () => {
  //   const dom = document.querySelector('.total-statical__main');
  //   const { queryName } = this.state;
  //   html2canvas(dom).then(canvas => {
  //     let contentWidth = canvas.width;
  //     let contentHeight = canvas.height;
  //     //一页pdf显示html页面生成的canvas高度;
  //     let pageHeight = (contentWidth / 592.28) * 841.89;
  //     //未生成pdf的html页面高度
  //     let leftHeight = contentHeight;
  //     //页面偏移
  //     let position = 0;
  //     //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  //     let imgWidth = 595.28;
  //     let imgHeight = (592.28 / contentWidth) * contentHeight;
  //     let imgData = canvas.toDataURL('image/jpeg', 1.0);
  //     let doc = new jsPDF('', 'pt', 'a4');
  //     //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
  //     //当内容未超过pdf一页显示的范围，无需分页
  //     if (leftHeight < pageHeight) {
  //       doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  //     } else {
  //       while (leftHeight > 0) {
  //         doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  //         leftHeight -= pageHeight;
  //         position -= 841.89;
  //         //避免添加空白页
  //         if (leftHeight > 0) {
  //           doc.addPage();
  //         }
  //       }
  //     }
  //     // doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
  //     doc.save(queryName + '.pdf');
  //   });
  // };

  hanldeExportPdf = () => {
    const { data, answerData, queryName } = this.state;
    const title = {
      text: queryName,
      style: 'header',
      alignment: 'center',
      bold: true,
      fontSize: 20
    };
    let index = 0;
    // 单选 多选
    let tables = [];
    data.forEach(item => {
      tables.push({
        text: `${++index}.${item.title}`,
        style: 'header'
      });
      const list = item.table.dataSource.map(i => {
        let percent;
        if (i.optionContent === '本题有效填写人次') {
          percent = null;
        } else {
          percent = ((i.amount / i.total).toFixed(2) * 100).toFixed(2) + '%';
        }
        return [
          { text: i.optionContent, style: 'tableRow' },
          { text: i.amount, style: 'tableRow' },
          percent
        ];
      });
      tables.push({
        style: 'tableExample',
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: '选项', style: 'tableHeader' },
              { text: '小计', style: 'tableHeader', noWrap: true },
              { text: '比例', style: 'tableHeader', noWrap: true }
            ],
            ...list
          ]
        }
      });
    });
    //问答
    let answers = [];
    answerData.forEach(item => {
      answers.push({
        text: `${++index}.${item.question_topic}`,
        style: 'header'
      });
      const list = item.answers.map(i => {
        return [{ text: i.write_content, style: 'tableRow' }];
      });
      answers.push({
        style: 'tableExample',
        table: {
          widths: ['*'],
          body: list
        }
      });
    });
    let dd = {
      content: [title, ...tables, ...answers],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 0],
          color: 'black'
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: 'black'
        },
        tableRow: {}
      },
      defaultStyle: {
        font: 'simsun'
      }
    };
    pdfMake.fonts = {
      simsun: {
        normal: 'simsun.ttf',
        bold: 'simsun.ttf',
        italics: 'simsun.ttf',
        bolditalics: 'simsun.ttf'
      }
    };
    pdfMake.createPdf(dd).download(queryName + '.pdf');
    // pdfMake.createPdf(dd).open();
  };

  handleAdopt = (answer, outindex, inindex) => async () => {
    this.setState({ loadingBtnID: answer.REC_ID });
    const { answerData } = this.state;
    try {
      await http().modifyRecords({
        resid: '608838682402',
        data: [{ isAdopt: 'Y', REC_ID: answer.REC_ID }]
      });
      answerData[outindex].answers[inindex].isAdopt = 'Y';
      this.setState({ answerData });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({ loadingBtnID: '' });
  };
  //渲染问答题的数据
  renderAnswerChart = () => {
    const { answerData, loadingBtnID } = this.state;
    // console.log(answerData);
    if (0 <= answerData) {
      return;
    } else {
      return answerData.map((item, index) => {
        return (
          <div className="total-statical__chart-wrap" key={item.question_id}>
            <h4 className="total-statical__chart-wrap__question-topic">
              <br />
              <span>{this.state.data.length + index + 1}.</span>
              {item.question_topic}
            </h4>
            <ul className="total-statical__ubox">
              {item.answers.map((answer, _index) => {
                const isAdopt = answer.isAdopt === 'Y';
                return (
                  <li key={_index} className={!isAdopt?'total-statical__ubox__lee unAdoped':'total-statical__ubox__lee'}>
                    <span style={{ flex: 1 }}>{answer.write_content}</span>
                    <span>
                      <Button
                        type="primary"
                        disabled={isAdopt}
                        onClick={this.handleAdopt(answer, index, _index)}
                        loading={loadingBtnID === answer.REC_ID}
                      >
                        {isAdopt ? '已采纳' : '采纳'}
                      </Button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      });
    }
  };

  // 渲染单选和多选的表格
  renderCommonChart = () => {
    const { data } = this.state;
    if (0 >= data.length) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    } else {
      return data.map((item, index) => {
        return (
          <div className="total-statical__chart-wrap" key={item.title}>
            <h4 className="total-statical__chart-wrap__question-topic">
              <span>{index + 1}.</span>
              {item.title}
            </h4>
            <Table
              columns={this.columns}
              dataSource={item.table.dataSource}
              bordered
              size="small"
              pagination={false}
              rowKey="optionContent"
            />
          </div>
        );
      });
    }
  };

  render() {
    const { queryName } = this.state;
    return (
      <React.Fragment>
        <div className="total-statical">
          <div ref='toPrint' className="total-statical__main">
            <h3 className="total-statical__title">{queryName}</h3>
            {this.renderCommonChart()}
            {this.renderAnswerChart()}
          </div>
          <div className="total-statical__btn">
            <Button
              size="small"
              type="primary"
              onClick={this.handleExportImgBtnClick}
              style={{ marginRight: 8 }}
            >
              导出 PNG
            </Button>
            <Button size="small" type="primary" onClick={this.hanldeExportPdf}>
              导出 PDF
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TotalStatical;
