import React from 'react';
import { Icon, Divider, Select, Input, DatePicker, Button } from 'antd';
import './SquareCard.less';
import http from 'Util20/api';
/**
 * 管理员确认
 */

const width = '390px';
const height = '317px';
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
  // componentWillReceiveProps = () => {

  //   console.log("componentWillReceiveProps")
  // }
  // componentDidUpdate = () => {
  //   console.log("componentDidUpdate")
  // }
  // componentWillUpdate = () => {

  //   console.log("componentWillUpdate")
  // }s
  renderCard = () => {
    let val = this.state.val;
    console.log(
      'this.props.SquareCardArr',
      this.state.SquareCardArr,
      this.props.SquareCardArr
    );
    return this.props.SquareCardArr.map((item, index) => {
      let data;
      let titleData;
      if (item.authority === 'modify') {
        switch (item.type) {
          case 'input':
            titleData = (
              <span className="squarecard-contain-title">{item.name}</span>
            );
            data = (
              <Select
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
                className="squarecard-contain-area"
              ></TextArea>
            );
            break;
          case 'date':
            titleData = (
              <span
                className="squarecard-contain-title"
              >
                {item.name}
              </span>
            );
            data = (
              <DatePicker
                // onChange={this.props.onChangeDate.bind(this, index)}
              />
            );
          default:
            break;
        }
      } else {
        data = <span>{item.value}</span>;
      }
      // console.log("data",data)
      return (
        <div style={{ margin: '10px 0', width: '100%' }}>
          {titleData}
          {data}
        </div>
      );
    });
  };
  componentDidMount = async () => {
    console.log('componentDidMount');
    this.setState({
      SquareCardArr: this.props.SquareCardArr
    });
  };
  render() {
    return (
      <div
        className="squarecard-contain"
        style={{ width, margin: '10px 20px' }}
      >
        <Icon
          onClick={() => {
            this.props.onRemove(this.props.index);
          }}
          type="close"
          style={{
            position: 'relative',
            left: '47%',
            top: '10px',
            color: '#ccc'
          }}
        />

        {this.renderCard()}

        {/* <div style={{margin:"10px 0",width:"100%"}}>
          <span className="squarecard-contain-title">类别/Category：</span>{' '}
          <Select
            defaultValue="lucy"
            style={{ width: '40%' }}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ padding: '8px', cursor: 'pointer' }}>
                  <Icon type="plus" /> Add item
                </div>
              </div>
            )}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </div>
        <div style={{margin:"10px 0",width:"100%"}}>
          <span className="squarecard-contain-title">类别/Category：</span>{' '}
          <Select
            defaultValue="lucy"
            style={{ width: '40%' }}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ padding: '8px', cursor: 'pointer' }}>
                  <Icon type="plus" /> Add item
                </div>
              </div>
            )}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </div> */}

        {/* <div style={{ margin: '10px 0', width: '100%' }}>
          <span className="squarecard-contain-title">行为指标：</span>{' '}
          <TextArea rows={4} className="squarecard-contain-area"></TextArea>
        </div> */}
      </div>
    );
  }
}

export default SquareCard;
