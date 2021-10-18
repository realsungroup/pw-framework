import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message, Input, Row, Col, Radio, Checkbox } from 'antd';
import http from 'Util20/api';
import './ShVisit.less';
import { Link } from 'react-router-dom';
const labels = [
  [
    { labelName: '来访事由：', labelId: 'C3_687636435090' },
    { labelName: '来访人数：', labelId: 'C3_687636864113' },
    { labelName: '来访单位：', labelId: 'C3_687636425762', class: 'normal' },
    { labelName: '来访区域：', labelId: 'C3_687636446496', class: 'normal' },
    { labelName: '接待人：', labelId: '', class: 'vip' }
  ],
  [
    { labelName: '访问开始时间：', labelId: 'C3_687636460324', type: 'date' },
    { labelName: '访问结束时间：', labelId: '访问结束日期', type: 'date' }
  ],
  [
    { labelName: '申请人分机号：', labelId: 'C3_687636958159' },
    { labelName: '申请人手机号：', labelId: 'C3_687636947347' }
  ]
];
const labels2 = [
  {
    name: '饮用水',
    class: 'normal',
    id: 'C3_687636521478',
    children: [
      {
        labelName: '数量：',
        labelId: 'C3_687636534071'
      }
    ]
  },
  {
    name: '会议室',
    class: 'normal',
    id: 'C3_687636541790',
    children: [
      {
        labelName: '会议室地点：',
        labelId: 'C3_687636560586'
      },
      {
        labelName: '备注：',
        labelId: 'C3_687636574492'
      }
    ]
  },
  {
    name: '茶歇',
    id: 'C3_687636586414',
    children: [
      {
        labelName: '数量：',
        labelId: 'C3_687636598414'
      },
      {
        labelName: '备注：',
        labelId: 'C3_687636609601'
      }
    ]
  },
  {
    name: '午餐',
    id: 'C3_687636621304',
    class: 'normal',
    children: [
      {
        labelName: '数量：',
        labelId: 'C3_687636630725'
      },
      {
        labelName: '送餐时间：',
        labelId: 'C3_687636678443',
        type: 'time'
      },
      {
        labelName: '地点：',
        labelId: 'C3_687636657084'
      },
      {
        labelName: '备注：',
        labelId: 'C3_687636691771'
      }
    ]
  },
  {
    name: 'VIP午餐',
    id: 'C3_687637011565',
    class: 'vip',
    children: [
      {
        labelName: '数量：',
        labelId: 'C3_687637038205'
      },
      {
        labelName: '送餐时间：',
        labelId: 'C3_687637059549',
        type: 'time'
      },
      {
        labelName: '地点：',
        labelId: 'C3_687637071111'
      },
      {
        labelName: '备注：',
        labelId: 'C3_687637089345'
      }
    ]
  },
  {
    name: '车辆',
    id: 'C3_687636975315',
    class: 'vip',
    children: [
      {
        labelName: '行程说明：',
        labelId: 'C3_687636986299'
      }
    ]
  }
];
/**
 * 考试安排
 */
export default class ShVisit extends Component {
  state = {
    visible: false,
    record: '',
    C3_687636501807: null,
    hotelCounter: 0,
    hotelInfo: [
      {
        show: false,
        children: [
          'C3_687636741302',
          'C3_687636765145',
          'C3_687636792098',
          'C3_687636804848'
        ]
      },
      {
        show: false,
        children: [
          'C3_687803759756',
          'C3_687803760256',
          'C3_687803760459',
          'C3_687803760662'
        ]
      },
      {
        show: false,
        children: [
          'C3_687803790818',
          'C3_687803791084',
          'C3_687803791380',
          'C3_687803791646'
        ]
      },
      {
        show: false,
        children: [
          'C3_687803793490',
          'C3_687803793818',
          'C3_687803794099',
          'C3_687803794334'
        ]
      },
      {
        show: false,
        children: [
          'C3_687803796084',
          'C3_687803796380',
          'C3_687803796646',
          'C3_687803796927'
        ]
      },
      {
        show: false,
        children: [
          'C3_687803803396',
          'C3_687803803662',
          'C3_687803803959',
          'C3_687803804224'
        ]
      },
      {
        show: false,
        children: [
          'C3_687803815490',
          'C3_687803815771',
          'C3_687803816052',
          'C3_687803816333'
        ]
      },
      {
        show: false,
        children: [
          'C3_687803821021',
          'C3_687803821287',
          'C3_687803821583',
          'C3_687803821849'
        ]
      }
    ],
    memberCounter: 0,
    memberInfo: [
      {
        show: false,
        children: ['C3_687637117970', 'C3_687637162392', 'C3_687637178298']
      },
      {
        show: false,
        children: ['C3_687637188251', 'C3_687637188798', 'C3_687637189017']
      },
      {
        show: false,
        children: ['C3_687637190251', 'C3_687637190704', 'C3_687637190923']
      },
      {
        show: false,
        children: ['C3_687637204860', 'C3_687637205376', 'C3_687637205595']
      },
      {
        show: false,
        children: ['C3_687637207079', 'C3_687637207563', 'C3_687637207829']
      },
      {
        show: false,
        children: ['C3_687637209876', 'C3_687637210345', 'C3_687637210548']
      }
    ]
  };
  showModal = v => {
    let str = '一般访客申请是指供应商、客户等一般访客。';
    if (v != 'normal') {
      str = 'VIP访客是指政府官员、总部领导等重要客户。';
    }
    this.info(str, v);
  };
  info = (a, b) => {
    let _this = this;
    Modal.info({
      title: '温馨提示',
      content: (
        <div>
          <p>{a}</p>
        </div>
      ),
      onOk() {
        _this.setState({ visible: true, type: b });
      }
    });
  };
  addHotelInfo = brid => {
    let c = this.state.hotelCounter;
    if (brid == 'member') {
      c = this.state.memberCounter;
    }
    let arr = this.state.hotelInfo;
    if (brid == 'member') {
      arr = this.state.memberInfo;
    }
    arr[c].show = true;
    c++;
    if (brid == 'member') {
      this.setState({ memberInfo: arr, memberCounter: c });
    } else {
      this.setState({ hotelInfo: arr, hotelCounter: c });
    }
  };
  deleteHotelInfo = (i, brid) => {
    let n = i;
    let c = this.state.hotelCounter;
    if (brid == 'member') {
      c = this.state.memberCounter;
    }
    let arr = this.state.hotelInfo;
    if (brid == 'member') {
      arr = this.state.memberInfo;
    }
    while (n < c) {
      let a = 0;
      while (a < arr[i].children.length) {
        if (n + 1 == arr.length) {
          this.setState({ [arr[n].children[a]]: '' });
        } else {
          this.setState({
            [arr[n].children[a]]: this.state[arr[n + 1].children[a]]
          });
        }
        a++;
      }
      n++;
    }
    c--;
    arr[c].show = false;
    if (brid == 'member') {
      this.setState({ memberInfo: arr, memberCounter: c });
    } else {
      this.setState({ hotelInfo: arr, hotelCounter: c });
    }
  };
  render() {
    return (
      <div className="table-data-wrap" style={{ height: '100vh' }}>
        <TableData
          resid={'687801941061'}
          hasRowView={false}
          hasAdd={false}
          refTargetComponentName="TableData"
          wrappedComponentRef={element => (this.tableDataRef = element)}
          hasRowDelete={false}
          hasRowModify={false}
          hasModify={false}
          hasDelete={false}
          hasRowView={false}
          subtractH={175}
          actionBarExtra={({ dataSource, selectedRowKeys }) => {
            return (
              <>
                <Button
                  onClick={() => {
                    this.showModal('normal');
                  }}
                >
                  申请普通访客
                </Button>
                <Button
                  onClick={() => {
                    this.showModal('vip');
                  }}
                >
                  申请VIP访客
                </Button>
              </>
            );
          }}
        />

        <Modal
          visible={this.state.visible}
          width={'80vw'}
          title={this.state.type == 'normal' ? '申请普通访客' : '申请VIP访客'}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <div className="formfield">
            {labels.map(item => {
              return (
                <Row style={{ marginBottom: 16 }}>
                  {item.map(item2 => {
                    return !item2.class || item2.class == this.state.type ? (
                      <Col span={6}>
                        <label>{item2.labelName}</label>
                        <Input
                          type={item2.type ? item2.type : ''}
                          style={{ width: '160px' }}
                        />
                      </Col>
                    ) : null;
                  })}
                </Row>
              );
            })}
            <div className="part2">
              <span>是否需要支持：</span>
              <Radio.Group
                onChange={v => {
                  this.setState({ C3_687636501807: v.target.value });
                }}
                value={this.state.C3_687636501807}
              >
                <Radio value={'Y'}>是</Radio>
                <Radio value={'N'}>否</Radio>
              </Radio.Group>
              {this.state.C3_687636501807 == 'Y' ? (
                <>
                  {labels2.map(item => {
                    return !item.class || item.class == this.state.type ? (
                      <div className="label2">
                        <Checkbox
                          onChange={v => {
                            this.setState({ [item.id]: v.target.checked });
                          }}
                          checked={this.state[item.id]}
                        >
                          {item.name}
                        </Checkbox>
                        {this.state[item.id] ? (
                          <ul>
                            {item.children.map(item2 => {
                              return (
                                <li>
                                  <label>{item2.labelName}</label>
                                  <Input
                                    type={item2.type ? item2.type : ''}
                                    style={{ width: '160px' }}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </div>
                    ) : null;
                  })}
                </>
              ) : null}
            </div>
            <div
              className="part3"
              style={
                this.state.C3_687636501807 == 'Y' ? {} : { display: 'none' }
              }
            >
              <Checkbox
                onChange={v => {
                  this.setState({ C3_687636703568: v.target.checked });
                }}
                checked={this.state.C3_687636703568}
              >
                酒店
              </Checkbox>
              {this.state.C3_687636703568 ? (
                <div classNmae="hotelInfo">
                  <div className="buttonLine">
                    <Button
                      size="small"
                      disabled={this.state.hotelCounter > 7}
                      onClick={() => {
                        this.addHotelInfo();
                      }}
                    >
                      添加人员
                    </Button>
                    {this.state.type == 'normal' ? (
                      <Button size="small">选择酒店</Button>
                    ) : (
                      <>
                        <label>指定酒店名称：</label>
                        <Input
                          onChange={v => {
                            this.setState({ C3_687636717177: v.target.value });
                          }}
                          value={this.state.C3_687636717177}
                          style={{ width: '160px' }}
                        />
                      </>
                    )}
                  </div>
                  <dl>
                    <dt>
                      <span>入住人姓名</span>
                      <span>身份证号</span>
                      <span>入住日期</span>
                      <span>离开日期</span>
                    </dt>
                    {this.state.hotelInfo.map((item, index) => {
                      return item.show ? (
                        <dd>
                          {item.children.map(item2 => {
                            return (
                              <Input
                                value={this.state[item2]}
                                onChange={v => {
                                  this.setState({ [item2]: v.target.value });
                                }}
                                style={{ width: '160px' }}
                              />
                            );
                          })}
                          <Button
                            type={'danger'}
                            onClick={() => {
                              this.deleteHotelInfo(index);
                            }}
                          >
                            删除
                          </Button>
                        </dd>
                      ) : null;
                    })}
                  </dl>
                </div>
              ) : null}
            </div>
            <div style={{ marginTop: '.5rem' }}>
              <label>备注：</label>
              <Input
                value={this.state.C3_687636821160}
                onChange={v => {
                  this.setState({ C3_687636821160: v.target.value });
                }}
                style={{ width: '160px' }}
              />
            </div>
            <div className="part4">
              <label>来访人员：</label>
              <Button
                size="small"
                disabled={this.state.memberCounter > 5}
                onClick={() => {
                  this.addHotelInfo('member');
                }}
              >
                添加人员
              </Button>
              <div>
                <dl>
                  <dt>
                    <span>姓名</span>
                    <span>手机号</span>
                    <span>携带物品说明</span>
                  </dt>
                  {this.state.memberInfo.map((item, index) => {
                    return item.show ? (
                      <dd>
                        {item.children.map(item2 => {
                          return (
                            <Input
                              value={this.state[item2]}
                              onChange={v => {
                                this.setState({ [item2]: v.target.value });
                              }}
                              style={{ width: '160px' }}
                            />
                          );
                        })}
                        <Button
                          type={'danger'}
                          onClick={() => {
                            this.deleteHotelInfo(index, 'member');
                          }}
                        >
                          删除
                        </Button>
                      </dd>
                    ) : null;
                  })}
                </dl>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
