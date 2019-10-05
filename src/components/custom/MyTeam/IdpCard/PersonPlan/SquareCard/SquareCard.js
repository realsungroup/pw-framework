import React from 'react';
import {
  Icon,
  Divider,
  Select,
  Input,
  DatePicker,
  Popconfirm,
  Popover
} from 'antd';
import './SquareCard.less';
import http from 'Util20/api';
import moment from 'moment';

/**
 * 管理员确认
 */
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const { TextArea } = Input;
class SquareCard extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    SquareCardArr: [],
    val: null
  };
  onConfirm = index => {
    let SquareCardArr = this.state.SquareCardArr;
    SquareCardArr[index].options.push(SquareCardArr[index].value);
    this.setState({
      SquareCardArr,
      val: null
    });
  };
  onChange = (index, event) => {
    let SquareCardArr = this.state.SquareCardArr;
    SquareCardArr[index].value = event.target.value;
    this.setState({
      SquareCardArr,
      val: event.target.value
    });
  };
  renderCard = () => {
    return (
      this.props.SquareCardArr &&
      this.props.SquareCardArr.map((item, index) => {
        console.log('detailOptions', item);
        if (item.type !== 'none') {
          let data;
          let titleData;
          if (item.authority === 'modify') {
            switch (item.type) {
              case 'tagSelect':
                titleData = (
                  <span className="squarecard-contain-title">{item.name}</span>
                );
                console.log('item.value', item.value);
                data = item.value ? (
                  <Select
                    className="word-color"
                    key={item.key}
                    value={item.value}
                    style={{ width: '40%' }}
                    onChange={this.props.onChangeTagSelect.bind(this, index)}
                    mode="tags"
                    placeholder="可自定义发展措施"
                    maxTagCount={1}
                  >
                    {item.options.map(item => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                ) : (
                  <Select
                    className="word-color"
                    key={item.key}
                    style={{ width: '40%' }}
                    onChange={this.props.onChangeTagSelect.bind(this, index)}
                    mode="tags"
                    placeholder="可自定义发展措施"
                    maxTagCount={1}
                  >
                    {item.options.map(item => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                );
                break;
              case 'input':
                titleData = (
                  <span className="squarecard-contain-title">{item.name}</span>
                );
                data = <Input></Input>;
                break;
              case 'select':
                titleData = (
                  <span className="squarecard-contain-title">{item.name}</span>
                );
                data = (
                  <React.Fragment>
                    <Select
                      className="word-color"
                      key={item.key}
                      defaultValue={item.value}
                      style={{ width: '40%' }}
                      onChange={this.props.onChangeSelect.bind(this, index)}
                    >
                      {item.options.map(item => {
                        return <Option value={item}>{item}</Option>;
                      })}
                    </Select>
                    {item.name === '胜任力/Competency:' ? (
                      <Popover
                        content={
                          <div>
                            {item.detailOptions &&
                              item.detailOptions.map((items, index) => {
                                let aDeptArr =
                                  items.adept && items.adept.split('.');
                                let notAdeptArr =
                                  items.adept && items.notAdept.split('.');
                                let overUseArr =
                                  items.adept && items.overuse.split('.');
                                console.log('aDeptArr', aDeptArr);
                                if (item.value === items.ability) {
                                  return (
                                    <div>
                                      <div style={{ padding: '16px' }}>
                                        <h4>擅长</h4>
                                        <ul>
                                          {aDeptArr.map(item => {
                                            return <li>{item}</li>;
                                          })}
                                        </ul>
                                      </div>
                                      <div style={{ padding: '16px' }}>
                                        <h4>不擅长</h4>
                                        <ul>
                                          {notAdeptArr.map(item => {
                                            return <li>{item}</li>;
                                          })}
                                        </ul>
                                      </div>
                                      <div style={{ padding: '16px' }}>
                                        <h4>过度使用</h4>
                                        <ul>
                                          {overUseArr.map(item => {
                                            return <li>{item}</li>;
                                          })}
                                        </ul>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                          </div>
                        }
                        title="胜任力描述"
                      >
                        <span className="squarecard-contain-detail">描述</span>
                      </Popover>
                    ) : null}
                  </React.Fragment>
                );
                break;
              case 'textArea':
                titleData = (
                  <span
                    className="squarecard-contain-title"
                    style={{ width: '100%' }}
                  >
                    {item.name}
                  </span>
                );
                data = (
                  <TextArea
                    rows={4}
                    value={item.value}
                    onChange={this.props.onChangeTextArea.bind(this, index)}
                    className="squarecard-contain-area word-color"
                  ></TextArea>
                );
                break;
              case 'date':
                titleData = (
                  <span className="squarecard-contain-title">{item.name}</span>
                );
                data = (
                  <DatePicker
                    className="word-color"
                    defaultValue={
                      item.value ? moment(item.value, dateFormat) : ''
                    }
                    onChange={this.props.onChangeDate.bind(this, index)}
                  />
                );
              default:
                break;
            }
          } else {
            switch (item.type) {
              case 'tagSelect':
                titleData = (
                  <span className="squarecard-contain-title">{item.name}</span>
                );
                data = (
                  <span className="squarecard-contain-title word-color">
                    {item.value}
                  </span>
                );
                break;
              case 'select':
                titleData = (
                  <span className="squarecard-contain-title">{item.name}</span>
                );
                data = (
                  <span className="squarecard-contain-title word-color">
                    {item.value}
                  </span>
                );
                break;
              case 'textArea':
                titleData = (
                  <span
                    className="squarecard-contain-title"
                    style={{ width: '100%' }}
                  >
                    {item.name}
                  </span>
                );
                data = (
                  <span
                    className="squarecard-contain-title word-color"
                    style={{ width: '100%', marginTop: '10px' }}
                  >
                    {item.value}
                  </span>
                );
                break;
              case 'date':
                titleData = (
                  <span className="squarecard-contain-title">{item.name}</span>
                );
                data = (
                  <span className="squarecard-contain-title word-color">
                    {item.value}
                  </span>
                );
                break;
              default:
                break;
            }
          }
          return (
            <div
              style={{
                margin: '10px 0',
                width: '100%',
                display: item.type === 'textArea' ? '' : 'flex'
              }}
            >
              {titleData}
              {data}
            </div>
          );
        }
      })
    );
  };
  componentDidMount = async () => {};
  componentWillReceiveProps = () => {};
  render() {
    return (
      <div
        className="squarecard-contain"
        style={{ width: '360px', margin: '10px 10px' }}
      >
        {this.props.icon !== 'noClose' ? (
          <Popconfirm
            title="您确定删除吗?"
            onConfirm={() => {
              this.props.onRemove(this.props.index);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Icon
              type="close"
              style={{
                position: 'relative',
                left: '47%',
                top: '10px',
                color: '#ccc'
              }}
            />
          </Popconfirm>
        ) : null}

        {this.renderCard()}
      </div>
    );
  }
}

export default SquareCard;
