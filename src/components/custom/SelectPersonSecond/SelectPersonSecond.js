import React, { Component } from 'react';
import './SelectPersonSecond.less';
import { Checkbox, Button, Popconfirm, Row, Col } from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
export default class SelectPersonSecond extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: [],
      indeterminate: true,
      checkAll: false
    };
  }

  handleSelectPersonChange = (selectednumber, e) => {
    // console.log(selectednumber,e.target.checked)
    const checked = e.target.checked;
    let tempCheckedValues = [];
    // 定义一个临时变量，如果选中了，push到这个数组当中，如果没有，需要从数组当中找到，然后删除掉
    if (checked) {
      tempCheckedValues.push(selectednumber);
    } else {
      const index = tempCheckedValues.findIndex(
        selectednumber => (selectednumber = selectednumber)
      );
      tempCheckedValues.splice(index, 1);
    }
    this.setState({
      checkedValues: tempCheckedValues
    });
  };

  render() {
    return (
      <div className="selectPersonSecond">
        <h3>名单人员</h3>
        <div className="tableBox">
          <div className="tableHead">
            {/* <Checkbox indeterminate>全选</Checkbox>
            <Popconfirm title="确定删除？">
              <Button type="danger">批量删除</Button>
            </Popconfirm> */}
          </div>
          <ul>
            {this.props.persons.map((person, index) => {
              return (
                <li key={person.C3_227192472953} className="personItem">
                  {/* <Checkbox
                    onChange={e => {
                      this.props.onCheckboxChange &&
                        this.props.onCheckboxChange(
                          e.target.checked,
                          person.number
                        );
                    }}
                  /> */}
                  <div className="header-picture">{''}</div>
                  <div className="info">
                    <div className="info-number">{person.C3_227192472953}</div>
                    <div className="info-name">{person.C3_227192484125}</div>
                  </div>
                  <div className="department">{person.C3_227212499515}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
