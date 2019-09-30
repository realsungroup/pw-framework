import React from 'react';
import { Icon, Divider, Select, Input, DatePicker, Popconfirm } from 'antd';
import './SquareCard.less';
import http from './node_modules/Util20/api';
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
    console.log('this.props.SquareCardArr', this.props.SquareCardArr);
    return (
      this.props.SquareCardArr &&
      this.props.SquareCardArr.map((item, index) => {
        if (item.type !== 'none') {
          let data;
          let titleData;
          if (item.authority === 'modify') {
            switch (item.type) {
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
                    // dropdownRender={menu => (
                    //   <div>
                    //     {menu}
                    //     <Divider style={{ margin: '4px 0' }} />
                    //     {/* <Popconfirm
                    //       title={
                    //       <input value={this.state.val}  onChange={this.onChange.bind(this,index)}></input>}
                    //       okText="Yes"
                    //       cancelText="No"
                    //       onConfirm={() => {
                    //         this.onConfirm(index)
                    //       } }
                    //     > */}
                    //       <div
                    //         style={{ padding: '8px', cursor: 'pointer' }}
                    //         // onClick={this.addType}
                    //       >
                    //         <Icon type="plus" /> 添加项目
                    //       </div>
                    //     </Popconfirm>
                    //   </div>
                    // )}
                  >
                    {item.options.map(item => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <span>描述</span></React.Fragment>
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
          // console.log("data",data)
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
  componentDidMount = async () => {
    console.log('componentDidMount');
    // this.setState({
    // SquareCardArr: this.props.SquareCardArr
    // });
  };
  componentWillReceiveProps = () => {
    // console.log("componentWillReceiveProps",this.props.SquareCardArr)
  };
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
